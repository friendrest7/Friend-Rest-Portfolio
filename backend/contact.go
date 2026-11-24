package main

import (
	"encoding/json"
	"errors"
	"log/slog"
	"net"
	"net/http"
	"net/mail"
	"slices"
	"strings"
	"time"
	"unicode/utf8"
)

var topics = []string{"Internship or job opportunity", "Collaboration", "Open-source work", "Something else"}

type contactRequest struct {
	Name    string `json:"name"`
	Email   string `json:"email"`
	Topic   string `json:"topic"`
	Message string `json:"message"`
	Company string `json:"company"` // honeypot
}

type fieldErrors map[string]string

// validate normalises the request in place and returns any field errors.
func (r *contactRequest) validate() fieldErrors {
	errs := fieldErrors{}
	r.Name = strings.TrimSpace(stripControl(r.Name))
	r.Email = strings.TrimSpace(r.Email)
	r.Topic = strings.TrimSpace(r.Topic)
	r.Message = strings.TrimSpace(r.Message)

	switch n := utf8.RuneCountInString(r.Name); {
	case n < 2:
		errs["name"] = "Please enter your name."
	case n > 100:
		errs["name"] = "Please keep your name under 100 characters."
	}

	if addr, err := mail.ParseAddress(r.Email); err != nil || addr.Address != r.Email || !strings.Contains(r.Email[strings.LastIndex(r.Email, "@")+1:], ".") || len(r.Email) > 254 {
		errs["email"] = "Please enter a valid email address."
	}

	if !slices.Contains(topics, r.Topic) {
		errs["topic"] = "Please choose a topic."
	}

	switch n := utf8.RuneCountInString(r.Message); {
	case n < 20:
		errs["message"] = "Please write at least 20 characters."
	case n > 4000:
		errs["message"] = "Please keep your message under 4,000 characters."
	}
	return errs
}

// stripControl removes CR, LF and other control characters (prevents header injection).
func stripControl(s string) string {
	return strings.Map(func(r rune) rune {
		if r < 0x20 || r == 0x7f {
			return -1
		}
		return r
	}, s)
}

type server struct {
	cfg     config
	sender  Sender
	limiter *rateLimiter
	log     *slog.Logger
}

func newServer(cfg config, sender Sender, log *slog.Logger) *server {
	return &server{cfg: cfg, sender: sender, limiter: newRateLimiter(5, 15*time.Minute), log: log}
}

func (s *server) routes() http.Handler {
	mux := http.NewServeMux()
	mux.HandleFunc("GET /healthz", func(w http.ResponseWriter, _ *http.Request) {
		writeJSON(w, http.StatusOK, map[string]any{"status": "ok", "mail": s.sender != nil})
	})
	mux.HandleFunc("POST /api/contact", s.handleContact)
	mux.HandleFunc("OPTIONS /api/contact", func(w http.ResponseWriter, _ *http.Request) { w.WriteHeader(http.StatusNoContent) })
	return s.securityHeaders(s.cors(mux))
}

func (s *server) handleContact(w http.ResponseWriter, r *http.Request) {
	if ct := r.Header.Get("Content-Type"); !strings.HasPrefix(ct, "application/json") {
		writeJSON(w, http.StatusUnsupportedMediaType, apiError("unsupported_media_type", "Send JSON."))
		return
	}
	ip := s.clientIP(r)
	if !s.limiter.allow(ip, time.Now()) {
		w.Header().Set("Retry-After", "900")
		writeJSON(w, http.StatusTooManyRequests, apiError("rate_limited", "Too many messages. Please try again later."))
		return
	}

	r.Body = http.MaxBytesReader(w, r.Body, 16<<10)
	var req contactRequest
	dec := json.NewDecoder(r.Body)
	dec.DisallowUnknownFields()
	if err := dec.Decode(&req); err != nil {
		if _, ok := errors.AsType[*http.MaxBytesError](err); ok {
			writeJSON(w, http.StatusRequestEntityTooLarge, apiError("too_large", "The message is too long."))
			return
		}
		writeJSON(w, http.StatusBadRequest, apiError("invalid_json", "The request could not be read."))
		return
	}

	// Honeypot filled in: report success without sending anything.
	if req.Company != "" {
		s.log.Info("honeypot triggered", "ip", ip)
		writeJSON(w, http.StatusOK, map[string]any{"ok": true})
		return
	}

	if errs := req.validate(); len(errs) > 0 {
		writeJSON(w, http.StatusUnprocessableEntity, map[string]any{"error": "validation_failed", "message": "Please check the highlighted fields.", "fields": errs})
		return
	}

	if s.sender == nil {
		writeJSON(w, http.StatusServiceUnavailable, apiError("mail_not_configured", "The contact service isn't configured yet."))
		return
	}

	if err := s.sender.Send(r.Context(), req); err != nil {
		s.log.Error("send failed", "error", err)
		writeJSON(w, http.StatusBadGateway, apiError("send_failed", "The message couldn't be delivered right now."))
		return
	}
	s.log.Info("message delivered", "topic", req.Topic)
	writeJSON(w, http.StatusOK, map[string]any{"ok": true})
}

func (s *server) clientIP(r *http.Request) string {
	if s.cfg.TrustProxy {
		if xff := r.Header.Get("X-Forwarded-For"); xff != "" {
			return strings.TrimSpace(strings.Split(xff, ",")[0])
		}
	}
	host, _, err := net.SplitHostPort(r.RemoteAddr)
	if err != nil {
		return r.RemoteAddr
	}
	return host
}

func (s *server) cors(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		origin := strings.TrimRight(r.Header.Get("Origin"), "/")
		if origin != "" && slices.Contains(s.cfg.AllowedOrigins, origin) {
			h := w.Header()
			h.Set("Access-Control-Allow-Origin", origin)
			h.Set("Access-Control-Allow-Methods", "POST, OPTIONS")
			h.Set("Access-Control-Allow-Headers", "Content-Type")
			h.Set("Access-Control-Max-Age", "600")
			h.Add("Vary", "Origin")
		} else if origin != "" && r.Method != http.MethodGet {
			writeJSON(w, http.StatusForbidden, apiError("origin_not_allowed", "Origin not allowed."))
			return
		}
		next.ServeHTTP(w, r)
	})
}

func (s *server) securityHeaders(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		h := w.Header()
		h.Set("X-Content-Type-Options", "nosniff")
		h.Set("X-Frame-Options", "DENY")
		h.Set("Referrer-Policy", "no-referrer")
		h.Set("Cache-Control", "no-store")
		next.ServeHTTP(w, r)
	})
}

func apiError(code, message string) map[string]string {
	return map[string]string{"error": code, "message": message}
}

func writeJSON(w http.ResponseWriter, status int, v any) {
	w.Header().Set("Content-Type", "application/json; charset=utf-8")
	w.WriteHeader(status)
	_ = json.NewEncoder(w).Encode(v)
}

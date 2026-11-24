package main

import (
	"bytes"
	"context"
	"encoding/json"
	"io"
	"log/slog"
	"net/http"
	"net/http/httptest"
	"strings"
	"sync"
	"testing"
	"time"
)

type fakeSender struct {
	mu   sync.Mutex
	sent []contactRequest
	err  error
}

func (f *fakeSender) Send(_ context.Context, m contactRequest) error {
	f.mu.Lock()
	defer f.mu.Unlock()
	if f.err != nil {
		return f.err
	}
	f.sent = append(f.sent, m)
	return nil
}

func testServer(sender Sender) http.Handler {
	cfg := config{AllowedOrigins: []string{"https://example.dev"}}
	return newServer(cfg, sender, slog.New(slog.NewTextHandler(io.Discard, nil))).routes()
}

func post(h http.Handler, body any, origin string) *httptest.ResponseRecorder {
	b, _ := json.Marshal(body)
	req := httptest.NewRequest(http.MethodPost, "/api/contact", bytes.NewReader(b))
	req.Header.Set("Content-Type", "application/json")
	if origin != "" {
		req.Header.Set("Origin", origin)
	}
	req.RemoteAddr = "203.0.113.7:1234"
	rec := httptest.NewRecorder()
	h.ServeHTTP(rec, req)
	return rec
}

var valid = contactRequest{
	Name:    "Ada Lovelace",
	Email:   "ada@example.com",
	Topic:   "Collaboration",
	Message: "Hello! I would like to talk about a project together.",
}

func TestValidate(t *testing.T) {
	cases := []struct {
		name  string
		mod   func(r *contactRequest)
		field string
	}{
		{"short name", func(r *contactRequest) { r.Name = "A" }, "name"},
		{"bad email", func(r *contactRequest) { r.Email = "not-an-email" }, "email"},
		{"email with display name", func(r *contactRequest) { r.Email = "Eve <eve@example.com>" }, "email"},
		{"email without dot in domain", func(r *contactRequest) { r.Email = "a@localhost" }, "email"},
		{"unknown topic", func(r *contactRequest) { r.Topic = "Spam" }, "topic"},
		{"short message", func(r *contactRequest) { r.Message = "hi" }, "message"},
		{"long message", func(r *contactRequest) { r.Message = strings.Repeat("a", 4001) }, "message"},
	}
	for _, tc := range cases {
		t.Run(tc.name, func(t *testing.T) {
			r := valid
			tc.mod(&r)
			if errs := r.validate(); errs[tc.field] == "" {
				t.Fatalf("expected error on %q, got %v", tc.field, errs)
			}
		})
	}
	r := valid
	if errs := r.validate(); len(errs) != 0 {
		t.Fatalf("valid request rejected: %v", errs)
	}
}

func TestHeaderInjectionIsStripped(t *testing.T) {
	r := valid
	r.Name = "Mallory\r\nBcc: victim@example.com"
	r.validate()
	if strings.ContainsAny(r.Name, "\r\n") {
		t.Fatalf("control characters not stripped: %q", r.Name)
	}
	msg := string(buildMessage("me@example.com", "me@example.com", r, time.Unix(0, 0)))
	headers := msg[:strings.Index(msg, "\r\n\r\n")]
	if strings.Contains(headers, "\r\nBcc:") {
		t.Fatalf("header injection succeeded:\n%s", headers)
	}
}

func TestContactDelivers(t *testing.T) {
	fs := &fakeSender{}
	rec := post(testServer(fs), valid, "https://example.dev")
	if rec.Code != http.StatusOK {
		t.Fatalf("status = %d, body = %s", rec.Code, rec.Body)
	}
	if len(fs.sent) != 1 || fs.sent[0].Email != valid.Email {
		t.Fatalf("message not delivered: %+v", fs.sent)
	}
	if got := rec.Header().Get("Access-Control-Allow-Origin"); got != "https://example.dev" {
		t.Fatalf("CORS header = %q", got)
	}
}

func TestHoneypotDoesNotSend(t *testing.T) {
	fs := &fakeSender{}
	r := valid
	r.Company = "Bots Inc"
	rec := post(testServer(fs), r, "")
	if rec.Code != http.StatusOK || len(fs.sent) != 0 {
		t.Fatalf("honeypot: status %d, sent %d", rec.Code, len(fs.sent))
	}
}

func TestValidationErrorReturns422(t *testing.T) {
	r := valid
	r.Email = "nope"
	rec := post(testServer(&fakeSender{}), r, "")
	if rec.Code != http.StatusUnprocessableEntity {
		t.Fatalf("status = %d", rec.Code)
	}
}

func TestDisallowedOriginRejected(t *testing.T) {
	rec := post(testServer(&fakeSender{}), valid, "https://evil.example")
	if rec.Code != http.StatusForbidden {
		t.Fatalf("status = %d", rec.Code)
	}
}

func TestNotConfiguredReturns503(t *testing.T) {
	rec := post(testServer(nil), valid, "")
	if rec.Code != http.StatusServiceUnavailable {
		t.Fatalf("status = %d", rec.Code)
	}
}

func TestRateLimit(t *testing.T) {
	h := testServer(&fakeSender{})
	for i := range 5 {
		if rec := post(h, valid, ""); rec.Code != http.StatusOK {
			t.Fatalf("request %d: status %d", i, rec.Code)
		}
	}
	if rec := post(h, valid, ""); rec.Code != http.StatusTooManyRequests {
		t.Fatalf("6th request: status %d, want 429", rec.Code)
	}
}

func TestRateLimiterWindowResets(t *testing.T) {
	l := newRateLimiter(1, time.Minute)
	now := time.Now()
	if !l.allow("a", now) || l.allow("a", now) {
		t.Fatal("limit not enforced")
	}
	if !l.allow("a", now.Add(2*time.Minute)) {
		t.Fatal("window did not reset")
	}
}

func TestRejectsUnknownFieldsAndOversizedBodies(t *testing.T) {
	h := testServer(&fakeSender{})
	rec := post(h, map[string]string{"name": "x", "extra": "y"}, "")
	if rec.Code != http.StatusBadRequest {
		t.Fatalf("unknown field: status %d", rec.Code)
	}
	big := valid
	big.Message = strings.Repeat("a", 20<<10)
	if rec := post(h, big, ""); rec.Code != http.StatusRequestEntityTooLarge {
		t.Fatalf("oversized: status %d", rec.Code)
	}
}

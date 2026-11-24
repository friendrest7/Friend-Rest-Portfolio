package main

import (
	"context"
	"crypto/tls"
	"fmt"
	"mime"
	"net"
	"net/mail"
	"net/smtp"
	"strconv"
	"strings"
	"sync"
	"time"
)

// Sender delivers a validated contact message.
type Sender interface {
	Send(ctx context.Context, msg contactRequest) error
}

type smtpSender struct{ cfg smtpConfig }

func (s *smtpSender) Send(ctx context.Context, m contactRequest) error {
	addr := net.JoinHostPort(s.cfg.Host, strconv.Itoa(s.cfg.Port))
	body := buildMessage(s.cfg.From, s.cfg.To, m, time.Now())

	done := make(chan error, 1)
	go func() {
		auth := smtp.PlainAuth("", s.cfg.Username, s.cfg.Password, s.cfg.Host)
		if s.cfg.Port == 465 {
			done <- sendImplicitTLS(addr, s.cfg, auth, body)
			return
		}
		// Port 587: net/smtp upgrades with STARTTLS when the server offers it,
		// and PlainAuth refuses to send credentials over an unencrypted link.
		done <- smtp.SendMail(addr, auth, s.cfg.From, []string{s.cfg.To}, body)
	}()

	select {
	case err := <-done:
		return err
	case <-ctx.Done():
		return ctx.Err()
	case <-time.After(20 * time.Second):
		return fmt.Errorf("smtp: timed out")
	}
}

func sendImplicitTLS(addr string, cfg smtpConfig, auth smtp.Auth, body []byte) error {
	conn, err := tls.Dial("tcp", addr, &tls.Config{ServerName: cfg.Host, MinVersion: tls.VersionTLS12})
	if err != nil {
		return err
	}
	c, err := smtp.NewClient(conn, cfg.Host)
	if err != nil {
		return err
	}
	defer c.Close()
	if err := c.Auth(auth); err != nil {
		return err
	}
	if err := c.Mail(cfg.From); err != nil {
		return err
	}
	if err := c.Rcpt(cfg.To); err != nil {
		return err
	}
	w, err := c.Data()
	if err != nil {
		return err
	}
	if _, err := w.Write(body); err != nil {
		return err
	}
	if err := w.Close(); err != nil {
		return err
	}
	return c.Quit()
}

// buildMessage creates an RFC 5322 message. Visitor input never reaches a
// header unencoded: the name is Q-encoded, and the visitor's address is only
// used in Reply-To after validation by net/mail.
func buildMessage(from, to string, m contactRequest, now time.Time) []byte {
	subject := fmt.Sprintf("[Portfolio] %s — %s", m.Topic, m.Name)
	var b strings.Builder
	fmt.Fprintf(&b, "From: %s\r\n", (&mail.Address{Name: "Portfolio contact form", Address: from}).String())
	fmt.Fprintf(&b, "To: %s\r\n", (&mail.Address{Address: to}).String())
	fmt.Fprintf(&b, "Reply-To: %s\r\n", (&mail.Address{Name: m.Name, Address: m.Email}).String())
	fmt.Fprintf(&b, "Subject: %s\r\n", mime.QEncoding.Encode("utf-8", subject))
	fmt.Fprintf(&b, "Date: %s\r\n", now.Format(time.RFC1123Z))
	b.WriteString("MIME-Version: 1.0\r\n")
	b.WriteString("Content-Type: text/plain; charset=utf-8\r\n")
	b.WriteString("Content-Transfer-Encoding: 8bit\r\n\r\n")
	fmt.Fprintf(&b, "Name:  %s\r\nEmail: %s\r\nTopic: %s\r\n\r\n", m.Name, m.Email, m.Topic)
	b.WriteString(strings.ReplaceAll(m.Message, "\n", "\r\n"))
	b.WriteString("\r\n")
	return []byte(b.String())
}

// rateLimiter allows `limit` requests per `window` per key (fixed window, in memory).
type rateLimiter struct {
	mu     sync.Mutex
	limit  int
	window time.Duration
	hits   map[string]*bucket
}

type bucket struct {
	count int
	reset time.Time
}

func newRateLimiter(limit int, window time.Duration) *rateLimiter {
	return &rateLimiter{limit: limit, window: window, hits: map[string]*bucket{}}
}

func (l *rateLimiter) allow(key string, now time.Time) bool {
	l.mu.Lock()
	defer l.mu.Unlock()
	if len(l.hits) > 10000 { // bound memory: drop expired buckets
		for k, b := range l.hits {
			if now.After(b.reset) {
				delete(l.hits, k)
			}
		}
	}
	b, ok := l.hits[key]
	if !ok || now.After(b.reset) {
		l.hits[key] = &bucket{count: 1, reset: now.Add(l.window)}
		return true
	}
	if b.count >= l.limit {
		return false
	}
	b.count++
	return true
}

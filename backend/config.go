package main

import (
	"fmt"
	"os"
	"strconv"
	"strings"
)

type smtpConfig struct {
	Host     string
	Port     int
	Username string
	Password string
	From     string // envelope + header sender, e.g. your Gmail address
	To       string // where messages are delivered
}

func (s smtpConfig) configured() bool {
	return s.Host != "" && s.Username != "" && s.Password != "" && s.To != ""
}

type config struct {
	Port           string
	AllowedOrigins []string
	SMTP           smtpConfig
	// TrustProxy uses the first X-Forwarded-For address as the client IP.
	// Enable only behind a proxy you control (Render, Fly, a load balancer).
	TrustProxy bool
}

func loadConfig() (config, error) {
	c := config{
		Port:       getenv("PORT", "8080"),
		TrustProxy: getenv("TRUST_PROXY", "false") == "true",
		SMTP: smtpConfig{
			Host:     os.Getenv("SMTP_HOST"),
			Username: os.Getenv("SMTP_USERNAME"),
			Password: os.Getenv("SMTP_PASSWORD"),
			From:     os.Getenv("CONTACT_FROM"),
			To:       os.Getenv("CONTACT_TO"),
		},
	}
	port, err := strconv.Atoi(getenv("SMTP_PORT", "587"))
	if err != nil {
		return c, fmt.Errorf("SMTP_PORT: %w", err)
	}
	c.SMTP.Port = port
	if c.SMTP.From == "" {
		c.SMTP.From = c.SMTP.Username
	}
	for o := range strings.SplitSeq(getenv("ALLOWED_ORIGINS", "http://localhost:3000"), ",") {
		if o = strings.TrimRight(strings.TrimSpace(o), "/"); o != "" {
			c.AllowedOrigins = append(c.AllowedOrigins, o)
		}
	}
	return c, nil
}

func getenv(key, fallback string) string {
	if v := strings.TrimSpace(os.Getenv(key)); v != "" {
		return v
	}
	return fallback
}

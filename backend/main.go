// Command contact runs the portfolio's contact-form API.
//
// It accepts POST /api/contact with a JSON body, validates it, applies a
// per-IP rate limit and a honeypot check, and delivers the message by SMTP.
// It uses only the Go standard library.
package main

import (
	"context"
	"errors"
	"log/slog"
	"net/http"
	"os"
	"os/signal"
	"syscall"
	"time"
)

func main() {
	logger := slog.New(slog.NewJSONHandler(os.Stdout, nil))
	cfg, err := loadConfig()
	if err != nil {
		logger.Error("invalid configuration", "error", err)
		os.Exit(1)
	}

	var sender Sender
	if cfg.SMTP.configured() {
		sender = &smtpSender{cfg: cfg.SMTP}
		logger.Info("smtp delivery enabled", "host", cfg.SMTP.Host, "to", cfg.SMTP.To)
	} else {
		logger.Warn("SMTP is not configured: /api/contact will answer 503 so the site falls back to email")
	}

	srv := newServer(cfg, sender, logger)
	httpServer := &http.Server{
		Addr:              ":" + cfg.Port,
		Handler:           srv.routes(),
		ReadHeaderTimeout: 5 * time.Second,
		ReadTimeout:       10 * time.Second,
		WriteTimeout:      30 * time.Second,
		IdleTimeout:       60 * time.Second,
	}

	go func() {
		logger.Info("listening", "port", cfg.Port, "origins", cfg.AllowedOrigins)
		if err := httpServer.ListenAndServe(); err != nil && !errors.Is(err, http.ErrServerClosed) {
			logger.Error("server error", "error", err)
			os.Exit(1)
		}
	}()

	stop := make(chan os.Signal, 1)
	signal.Notify(stop, syscall.SIGINT, syscall.SIGTERM)
	<-stop
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()
	_ = httpServer.Shutdown(ctx)
	logger.Info("shut down")
}

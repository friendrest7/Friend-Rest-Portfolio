"use client";

import { useId, useRef, useState, type FormEvent } from "react";
import { AlertCircle, CheckCircle2, Loader2, Mail, Send } from "lucide-react";
import { cn } from "@/lib/utils";
import { track } from "@/lib/analytics";

const ENDPOINT = process.env.NEXT_PUBLIC_CONTACT_ENDPOINT?.trim() || "";

const topics = ["Internship or job opportunity", "Collaboration", "Open-source work", "Something else"] as const;

interface Values {
  name: string;
  email: string;
  topic: string;
  message: string;
  company: string; // honeypot — must stay empty
}
type Errors = Partial<Record<keyof Values, string>>;
type Status =
  | { kind: "idle" }
  | { kind: "sending" }
  | { kind: "sent" }
  | { kind: "handoff" }
  | { kind: "error"; message: string };

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export function validate(v: Values): Errors {
  const e: Errors = {};
  const name = v.name.trim();
  const message = v.message.trim();
  if (name.length < 2) e.name = "Please enter your name.";
  else if (name.length > 100) e.name = "Please keep your name under 100 characters.";
  if (!EMAIL_RE.test(v.email.trim())) e.email = "Please enter a valid email address.";
  if (!topics.includes(v.topic as (typeof topics)[number])) e.topic = "Please choose a topic.";
  if (message.length < 20) e.message = "Please write at least 20 characters so I have some context.";
  else if (message.length > 4000) e.message = "Please keep your message under 4,000 characters.";
  return e;
}

function mailtoHref(email: string, v: Values) {
  const subject = `[Portfolio] ${v.topic} — ${v.name.trim()}`;
  const body = `${v.message.trim()}\n\n— ${v.name.trim()}\n${v.email.trim()}`;
  return `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}

export function ContactForm({ email }: { email: string }) {
  const uid = useId();
  const formRef = useRef<HTMLFormElement>(null);
  const [values, setValues] = useState<Values>({ name: "", email: "", topic: topics[0], message: "", company: "" });
  const [errors, setErrors] = useState<Errors>({});
  const [touched, setTouched] = useState<Partial<Record<keyof Values, boolean>>>({});
  const [status, setStatus] = useState<Status>({ kind: "idle" });

  const set = (k: keyof Values) => (e: { target: { value: string } }) => {
    const next = { ...values, [k]: e.target.value };
    setValues(next);
    if (touched[k]) setErrors(validate(next));
    if (status.kind === "error" || status.kind === "sent" || status.kind === "handoff") setStatus({ kind: "idle" });
  };
  const blur = (k: keyof Values) => () => {
    setTouched((t) => ({ ...t, [k]: true }));
    setErrors(validate(values));
  };

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    const found = validate(values);
    setErrors(found);
    setTouched({ name: true, email: true, topic: true, message: true });
    if (Object.keys(found).length > 0) {
      const firstKey = (["name", "email", "topic", "message"] as const).find((k) => found[k]);
      formRef.current?.querySelector<HTMLElement>(`[name="${firstKey}"]`)?.focus();
      return;
    }
    if (values.company) {
      // Bot filled the honeypot: pretend success without sending anything.
      setStatus({ kind: "sent" });
      return;
    }

    if (!ENDPOINT) {
      track("contact_mailto");
      window.location.href = mailtoHref(email, values);
      setStatus({ kind: "handoff" });
      return;
    }

    setStatus({ kind: "sending" });
    try {
      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), 15000);
      const res = await fetch(ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: values.name.trim(),
          email: values.email.trim(),
          topic: values.topic,
          message: values.message.trim(),
          company: values.company,
        }),
        signal: controller.signal,
      });
      clearTimeout(timer);
      if (res.ok) {
        track("contact_sent");
        setStatus({ kind: "sent" });
        setValues({ name: "", email: "", topic: topics[0], message: "", company: "" });
        setTouched({});
        return;
      }
      const data = (await res.json().catch(() => ({}))) as { error?: string; message?: string };
      const msg =
        res.status === 429
          ? "Too many messages from this connection. Please try again later or email me directly."
          : data.message || "The message couldn't be delivered right now.";
      setStatus({ kind: "error", message: msg });
    } catch {
      setStatus({ kind: "error", message: "The contact service couldn't be reached." });
    }
  }

  const field =
    "w-full rounded-xl border bg-bg px-3.5 py-3 text-[0.9375rem] text-fg placeholder:text-fg-subtle transition-colors focus:border-accent focus:outline-none focus-visible:outline-none";
  const errCls = (k: keyof Values) => (errors[k] && touched[k] ? "border-danger" : "border-border-strong");
  const errId = (k: string) => `${uid}-${k}-error`;
  const sending = status.kind === "sending";

  return (
    <form ref={formRef} onSubmit={onSubmit} noValidate className="relative space-y-5" aria-describedby={`${uid}-note`}>
      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor={`${uid}-name`} className="mb-1.5 block text-sm text-fg">
            Name
          </label>
          <input
            id={`${uid}-name`}
            name="name"
            autoComplete="name"
            value={values.name}
            onChange={set("name")}
            onBlur={blur("name")}
            aria-invalid={Boolean(errors.name && touched.name)}
            aria-describedby={errors.name && touched.name ? errId("name") : undefined}
            className={cn(field, errCls("name"))}
            placeholder="Your name"
          />
          {errors.name && touched.name && (
            <p id={errId("name")} className="mt-1.5 text-xs text-danger">
              {errors.name}
            </p>
          )}
        </div>
        <div>
          <label htmlFor={`${uid}-email`} className="mb-1.5 block text-sm text-fg">
            Email
          </label>
          <input
            id={`${uid}-email`}
            name="email"
            type="email"
            inputMode="email"
            autoComplete="email"
            value={values.email}
            onChange={set("email")}
            onBlur={blur("email")}
            aria-invalid={Boolean(errors.email && touched.email)}
            aria-describedby={errors.email && touched.email ? errId("email") : undefined}
            className={cn(field, errCls("email"))}
            placeholder="you@company.com"
          />
          {errors.email && touched.email && (
            <p id={errId("email")} className="mt-1.5 text-xs text-danger">
              {errors.email}
            </p>
          )}
        </div>
      </div>

      <fieldset>
        <legend className="mb-2 text-sm text-fg">What is it about?</legend>
        <div className="flex flex-wrap gap-2">
          {topics.map((t) => (
            <label
              key={t}
              className={cn(
                "cursor-pointer rounded-full border px-3.5 py-2 text-[0.8rem] transition-colors has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-accent",
                values.topic === t ? "border-accent bg-accent-soft text-fg" : "border-border text-fg-muted hover:border-border-strong hover:text-fg",
              )}
            >
              <input type="radio" name="topic" value={t} checked={values.topic === t} onChange={set("topic")} className="sr-only" />
              {t}
            </label>
          ))}
        </div>
      </fieldset>

      <div>
        <label htmlFor={`${uid}-message`} className="mb-1.5 flex justify-between text-sm text-fg">
          Message
          <span className={cn("font-mono text-xs", values.message.length > 4000 ? "text-danger" : "text-fg-subtle")} aria-hidden="true">
            {values.message.length}/4000
          </span>
        </label>
        <textarea
          id={`${uid}-message`}
          name="message"
          rows={6}
          value={values.message}
          onChange={set("message")}
          onBlur={blur("message")}
          aria-invalid={Boolean(errors.message && touched.message)}
          aria-describedby={errors.message && touched.message ? errId("message") : undefined}
          className={cn(field, "resize-y", errCls("message"))}
          placeholder="Tell me about the role, project or idea…"
        />
        {errors.message && touched.message && (
          <p id={errId("message")} className="mt-1.5 text-xs text-danger">
            {errors.message}
          </p>
        )}
      </div>

      {/* Honeypot: hidden from people and assistive tech, attractive to bots */}
      <div aria-hidden="true" className="absolute -left-[9999px] h-px w-px overflow-hidden">
        <label htmlFor={`${uid}-company`}>Company</label>
        <input id={`${uid}-company`} name="company" tabIndex={-1} autoComplete="off" value={values.company} onChange={set("company")} />
      </div>

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <p id={`${uid}-note`} className="text-xs leading-relaxed text-fg-subtle sm:max-w-xs">
          {ENDPOINT
            ? "Your message is sent directly to my inbox. I reply to every genuine message."
            : "This opens your email app with the message ready to send — nothing is sent until you press send there."}
        </p>
        <button
          type="submit"
          disabled={sending}
          className="inline-flex h-11 shrink-0 items-center justify-center gap-2 rounded-full bg-accent px-6 text-sm font-medium text-accent-fg transition-colors hover:bg-accent-strong disabled:cursor-not-allowed disabled:opacity-70"
        >
          {sending ? (
            <>
              <Loader2 size={16} className="animate-spin" aria-hidden="true" /> Sending…
            </>
          ) : ENDPOINT ? (
            <>
              Send message <Send size={15} aria-hidden="true" />
            </>
          ) : (
            <>
              Open in email app <Mail size={15} aria-hidden="true" />
            </>
          )}
        </button>
      </div>

      <div role="status" aria-live="polite" className="empty:hidden">
        {status.kind === "sent" && (
          <p className="flex items-start gap-2.5 rounded-xl border border-accent-line bg-accent-soft p-4 text-sm text-fg">
            <CheckCircle2 size={18} className="mt-px shrink-0 text-accent" aria-hidden="true" />
            Thanks — your message was delivered. I&apos;ll get back to you by email.
          </p>
        )}
        {status.kind === "handoff" && (
          <p className="flex items-start gap-2.5 rounded-xl border border-border-strong bg-surface-2 p-4 text-sm text-fg-muted">
            <Mail size={18} className="mt-px shrink-0 text-accent" aria-hidden="true" />
            <span>
              Your email app should now be open with the message ready. If nothing happened, email me at{" "}
              <a href={`mailto:${email}`} className="text-fg underline underline-offset-4">
                {email}
              </a>
              .
            </span>
          </p>
        )}
        {status.kind === "error" && (
          <p className="flex items-start gap-2.5 rounded-xl border border-danger/40 bg-danger/5 p-4 text-sm text-fg-muted">
            <AlertCircle size={18} className="mt-px shrink-0 text-danger" aria-hidden="true" />
            <span>
              {status.message}{" "}
              <a href={mailtoHref(email, values)} className="text-fg underline underline-offset-4">
                Send it from your email app instead
              </a>
              .
            </span>
          </p>
        )}
      </div>
    </form>
  );
}

import React, { useMemo, useRef, useState } from "react";
import confetti from "canvas-confetti";
import HoverTypingText from "./HoverTypingText.jsx";

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function getConfettiOrigin(button) {
  if (!button) return { x: 0.5, y: 0.6 };
  const rect = button.getBoundingClientRect();
  return {
    x: (rect.left + rect.width / 2) / window.innerWidth,
    y: (rect.top + rect.height / 2) / window.innerHeight,
  };
}

export default function NewsletterSignup() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const buttonRef = useRef(null);

  const apiKey = useMemo(() => (
    import.meta.env.VITE_BREVO_API_KEY || import.meta.env.BREVO_API_KEY
  ), []);

  const listId = useMemo(() => {
    const raw = import.meta.env.VITE_BREVO_LIST_ID || import.meta.env.BREVO_LIST_ID;
    const parsed = Number(raw);
    return Number.isFinite(parsed) ? parsed : 2;
  }, []);

  async function handleSubmit(event) {
    event.preventDefault();
    const trimmed = email.trim();

    if (!emailPattern.test(trimmed)) {
      setError("Enter a valid email address.");
      return;
    }

    if (!apiKey) {
      setError("Newsletter is not configured yet.");
      return;
    }

    setIsSubmitting(true);
    setError("");

    try {
      const response = await fetch("https://api.brevo.com/v3/contacts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "api-key": apiKey,
        },
        body: JSON.stringify({
          email: trimmed,
          listIds: [listId],
          updateEnabled: true,
        }),
      });

      const ok = response.status === 200 || response.status === 204 || response.status === 201;

      if (!ok) {
        let message = "Unable to subscribe right now. Please try again.";
        try {
          const data = await response.json();
          if (data?.message) message = data.message;
        } catch {
          // Ignore response parsing errors.
        }
        setError(message);
        return;
      }

      setIsSuccess(true);
      setEmail("");
      confetti({
        particleCount: 150,
        spread: 80,
        origin: getConfettiOrigin(buttonRef.current),
        disableForReducedMotion: true,
      });
    } catch {
      setError("Unable to subscribe right now. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <section className="section compact-section newsletter-section">
      <div className="section-head">
        <p className="eyebrow">newsletter</p>
        <HoverTypingText
          element="h2"
          variants={[
            "Dispatches from the build floor.",
            "What I'm shipping, learning, and breaking.",
            "Engineering notes — no fluff, no schedule.",
            "Short reads from the trenches.",
            "Updates only when there's something real.",
          ]}
        />
      </div>

      <div className="newsletter-card plain-panel" aria-live="polite">
        <div className="newsletter-copy">
          <strong>No spam. No schedule. Just signal.</strong>
          <p>I send an email when I ship something worth talking about — product launches, engineering deep-dives, and lessons from production.</p>
        </div>

        {isSuccess ? (
          <div className="newsletter-success" role="status">
            <strong>You&apos;re in! 🎉</strong>
            <p>Thanks for subscribing. I&apos;ll only send what matters.</p>
          </div>
        ) : (
          <form className="newsletter-form" onSubmit={handleSubmit} noValidate>
            <label className="newsletter-label" htmlFor="newsletter-email">Email address</label>
            <div className="newsletter-fields">
              <input
                id="newsletter-email"
                className="newsletter-input"
                type="email"
                name="email"
                autoComplete="email"
                inputMode="email"
                placeholder="you@domain.com"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                disabled={isSubmitting}
                aria-invalid={Boolean(error)}
              />
              <button
                ref={buttonRef}
                className="btn btn-accent newsletter-button"
                type="submit"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Subscribing..." : "Subscribe"}
              </button>
            </div>
            {error && <p className="newsletter-error" role="status">{error}</p>}
          </form>
        )}
      </div>
    </section>
  );
}

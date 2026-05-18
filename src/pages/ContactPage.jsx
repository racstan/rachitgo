import React, { useState } from "react";
import TiltCard from "../components/TiltCard.jsx";
import HoverTypingText from "../components/HoverTypingText.jsx";
import WaveText from "../components/WaveText.jsx";
import { contacts } from "../data/contacts.js";

function ContactCard({ item }) {
  const [copied, setCopied] = useState(false);

  async function handleCopy(event) {
    event.preventDefault();
    event.stopPropagation();
    const value = item.copyValue || item.href;
    if (!value) return;

    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(value);
      } else {
        const textarea = document.createElement("textarea");
        textarea.value = value;
        textarea.style.position = "fixed";
        textarea.style.opacity = "0";
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand("copy");
        textarea.remove();
      }
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1200);
    } catch {
      setCopied(false);
    }
  }

  function openLink() {
    if (!item.href) return;
    if (item.href.startsWith("mailto:") || item.href.startsWith("tel:")) {
      window.location.href = item.href;
      return;
    }
    window.open(item.href, "_blank", "noopener,noreferrer");
  }

  return (
    <TiltCard
      element="article"
      role="link"
      aria-label={`${item.platform} ${item.handle}`}
      className="contact-card"
      data-color={item.color}
      color={item.color}
      onClick={openLink}
    >
      <div className="contact-card-icon" style={{ background: `${item.color}22`, borderColor: `${item.color}44`, color: item.color }}>
        <span
          className="contact-icon"
          style={{ WebkitMaskImage: `url(${item.iconUrl})`, maskImage: `url(${item.iconUrl})` }}
          aria-hidden="true"
        />
      </div>
      <div className="contact-card-info">
        <div className="contact-platform" style={{ color: item.color }}>
          <WaveText text={item.platform} />
        </div>
        <div className="contact-handle">{item.handle}</div>
        <p className="contact-desc">{item.desc}</p>
      </div>
      <button
        type="button"
        className="contact-copy"
        data-no-card-drag
        onClick={handleCopy}
        aria-label={`Copy ${item.platform} link`}
      >
        {copied ? "Copied" : "Copy"}
      </button>
      <div className="contact-arrow">→</div>
    </TiltCard>
  );
}

export default function ContactPage() {
  return (
    <section className="page">
      <div className="section-head">
        <p className="eyebrow">let's connect</p>
        <HoverTypingText
          element="h2"
          variants={[
            "Find me everywhere.\nSay hello.",
            "Let's talk builds.\nSay hello.",
            "Open for work.\nDrop a note.",
            "Say hi anytime.\nLet's connect.",
            "Let's build together.\nReach out.",
          ]}
        />
      </div>
      <p style={{ color: "var(--muted)", marginBottom: "40px", fontSize: "17px", lineHeight: "1.7" }}>
        Open for software development, freelance builds, engineering collaboration,
        and meaningful conversations about tech. Pick whichever platform you prefer.
      </p>

      <div className="contact-grid">
        {contacts.map((item) => (
          <ContactCard key={item.platform} item={item} />
        ))}
      </div>
    </section>
  );
}

import React, { useRef } from "react";

const contacts = [
  {
    platform: "Email",
    handle: "rachit@example.com",
    href: "mailto:rachit@example.com",
    icon: "✉️",
    color: "#3fb950",
    desc: "Best for project inquiries and professional discussions.",
  },
  {
    platform: "GitHub",
    handle: "@rachitasthana",
    href: "https://github.com/rachitasthana",
    icon: "🐙",
    color: "#ffffff",
    desc: "Open source work, contributions, and personal projects.",
  },
  {
    platform: "LinkedIn",
    handle: "Rachit Asthana",
    href: "https://linkedin.com/in/rachitasthana",
    icon: "💼",
    color: "#0A66C2",
    desc: "Professional network, job opportunities, and referrals.",
  },
  {
    platform: "Twitter / X",
    handle: "@rachit_dev",
    href: "https://twitter.com/rachit_dev",
    icon: "🐦",
    color: "#1DA1F2",
    desc: "Tech thoughts, quick updates, and community discussions.",
  },
  {
    platform: "Discord",
    handle: "rachit#0001",
    href: "https://discord.gg/",
    icon: "💬",
    color: "#5865F2",
    desc: "Real-time chat, collaboration, and dev communities.",
  },
  {
    platform: "Reddit",
    handle: "u/rachitasthana",
    href: "https://reddit.com/user/rachitasthana",
    icon: "🤖",
    color: "#FF4500",
    desc: "Long-form discussions, AMAs, and community posts.",
  },
  {
    platform: "Instagram",
    handle: "@rachit.dev",
    href: "https://instagram.com/rachit.dev",
    icon: "📸",
    color: "#E1306C",
    desc: "Behind the scenes, workspace, and life outside code.",
  },
  {
    platform: "Slack",
    handle: "Rachit Asthana",
    href: "#",
    icon: "⚡",
    color: "#4A154B",
    desc: "Enterprise collaboration — reach out via shared workspaces.",
  },
  {
    platform: "Telegram",
    handle: "@rachitasthana",
    href: "https://t.me/rachitasthana",
    icon: "✈️",
    color: "#26A5E4",
    desc: "Quick messages and file sharing.",
  },
  {
    platform: "Dev.to",
    handle: "@rachitasthana",
    href: "https://dev.to/rachitasthana",
    icon: "📝",
    color: "#08090a",
    desc: "Technical articles, tutorials, and engineering writeups.",
  },
];

function useTilt(strength = 14) {
  const ref = useRef(null);
  function onMove(e) {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = ((e.clientX - rect.left)  / rect.width  - 0.5) * strength;
    const y = ((e.clientY - rect.top)   / rect.height - 0.5) * -strength;
    el.style.transform = `perspective(700px) rotateX(${y}deg) rotateY(${x}deg) scale(1.05) translateY(-4px)`;
    el.style.boxShadow = `0 16px 40px ${el.dataset.color}33`;
  }
  function onLeave() {
    const el = ref.current;
    if (!el) return;
    el.style.transform = "perspective(700px) rotateX(0deg) rotateY(0deg) scale(1) translateY(0)";
    el.style.boxShadow = "";
  }
  return { ref, onMouseMove: onMove, onMouseLeave: onLeave };
}

function ContactCard({ item }) {
  const tilt = useTilt(12);
  return (
    <a
      {...tilt}
      href={item.href}
      target={item.href.startsWith("mailto") ? "_self" : "_blank"}
      rel="noopener noreferrer"
      className="contact-card"
      data-color={item.color}
      style={{ "--card-color": item.color, transition: "transform 0.15s ease, box-shadow 0.15s ease" }}
      ref={tilt.ref}
    >
      <div className="contact-card-icon" style={{ background: `${item.color}22`, borderColor: `${item.color}44` }}>
        <span>{item.icon}</span>
      </div>
      <div className="contact-card-info">
        <div className="contact-platform" style={{ color: item.color }}>{item.platform}</div>
        <div className="contact-handle">{item.handle}</div>
        <p className="contact-desc">{item.desc}</p>
      </div>
      <div className="contact-arrow">→</div>
    </a>
  );
}

export default function ContactPage() {
  return (
    <section className="page">
      <div className="section-head">
        <p className="eyebrow">let's connect</p>
        <h2>Find me everywhere.<br />Say hello.</h2>
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

import React from "react";
import { contacts } from "../data/contacts.js";
import { experienceTimeline, profile, projectCards, skillGroups } from "../data/profile.js";

function Section({ id, eyebrow, title, children }) {
  return (
    <section id={id} className="professional-section">
      <p className="eyebrow">{eyebrow}</p>
      <h2>{title}</h2>
      {children}
    </section>
  );
}

export default function ProfessionalPage() {
  return (
    <article className="professional-page">
      <section id="professional-home" className="professional-hero">
        <div>
          <p className="eyebrow">professional mode</p>
          <h1>{profile.name}</h1>
          <p className="professional-role">{profile.roleLine}</p>
          <p className="professional-summary">{profile.summary}</p>
          <div className="professional-actions">
            <a href="/CV2026.pdf" download="Rachit_Asthana_Resume.pdf" style={{ background: "var(--accent-2)", color: "#ffffff", borderColor: "var(--accent-2)" }}>Download Resume</a>
            <a href="/CV2026.pdf" download="Rachit_Asthana_CV.pdf" style={{ background: "var(--accent-2)", color: "#ffffff", borderColor: "var(--accent-2)" }}>Download CV</a>
            <a href={`mailto:${profile.email}`}>Email me</a>
            <a href={profile.githubUrl} target="_blank" rel="noreferrer">GitHub</a>
            <a href={profile.linkedinUrl} target="_blank" rel="noreferrer">LinkedIn</a>
          </div>
        </div>
        <aside className="professional-card">
          <strong>Core stack</strong>
          <p>Laravel, React, TypeScript, cloud platforms, DevOps practices, and AI integrations.</p>
        </aside>
      </section>

      <Section id="professional-experience" eyebrow="experience" title="Work Experience & Education">
        <div className="professional-timeline">
          {experienceTimeline.map((item) => (
            <article key={`${item.year}-${item.role}`} className="professional-row">
              <span>{item.year}</span>
              <div>
                <h3>{item.role}</h3>
                <p style={{ fontWeight: "600", color: "var(--accent-2)", margin: "2px 0 6px" }}>{item.company || "Context"}</p>
                <div style={{ display: "flex", gap: "6px", flexWrap: "wrap", margin: "6px 0" }}>
                  {item.tags?.map((tag) => (
                    <span key={tag} className="tag-chip" style={{ fontSize: "10px", padding: "2px 6px", borderRadius: "4px", background: "color-mix(in srgb, var(--panel-2) 60%, transparent)", border: "1px solid var(--line)", color: "var(--text-dim)" }}>
                      {tag}
                    </span>
                  ))}
                </div>
                <small style={{ display: "block", marginTop: "8px" }}>{item.desc}</small>
              </div>
            </article>
          ))}
        </div>
      </Section>

      <Section id="professional-projects" eyebrow="selected work" title="Projects with context">
        <div className="professional-list" style={{ display: "flex", flexDirection: "column", gap: "18px" }}>
          {projectCards.map((project) => (
            <article key={project.id} className="professional-project-row">
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", flexWrap: "wrap", gap: "12px", marginBottom: "8px" }}>
                <h3 style={{ margin: 0, fontSize: "20px" }}>{project.title}</h3>
                <span style={{ fontSize: "12px", color: "var(--accent-2)", fontWeight: "600", fontFamily: "monospace" }}>{project.highlights.join(" • ")}</span>
              </div>
              <p style={{ margin: 0, color: "var(--text-dim)", fontSize: "14px", lineHeight: "1.6" }}>{project.summary}</p>
            </article>
          ))}
        </div>
      </Section>

      <Section id="professional-skills" eyebrow="skills" title="Technical coverage">
        <div className="professional-skill-grid">
          {skillGroups.map((group) => (
            <article key={group.cat} className="professional-card">
              <h3>{group.cat}</h3>
              <p>{group.items.join(" / ")}</p>
            </article>
          ))}
        </div>
      </Section>

      <Section id="professional-contact" eyebrow="contact" title="Reach out directly">
        <div className="professional-contact-grid">
          {contacts.map((contact) => (
            <a
              key={contact.id}
              className="professional-card professional-contact-card"
              href={contact.href}
              {...(contact.href.startsWith("/") || contact.href.startsWith("http") ? { target: "_blank", rel: "noopener noreferrer" } : {})}
            >
              <strong>{contact.platform}</strong>
              <span>{contact.handle}</span>
            </a>
          ))}
        </div>
      </Section>
    </article>
  );
}

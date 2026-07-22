import React, { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { Download, FileText, ExternalLink } from "lucide-react";
import { contacts } from "../data/contacts.js";
import Highlights from "../components/Highlights.jsx";
import ClothParagraph from "../components/ClothParagraph.jsx";
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

export default function ProfessionalPage({ defaultHash }) {
  const location = useLocation();

  useEffect(() => {
    const hash = location.hash || defaultHash;
    if (hash) {
      const targetId = hash.replace("#", "");
      const el = document.getElementById(targetId);
      if (el) {
        setTimeout(() => {
          el.scrollIntoView({ behavior: "smooth", block: "start" });
        }, 100);
      }
    }
  }, [location.hash, defaultHash]);

  return (
    <article className="professional-page">
      <section id="professional-home" className="professional-hero">
        <div>
          <p className="eyebrow">professional mode</p>
          <h1>{profile.name}</h1>
          <ClothParagraph className="professional-role">{profile.roleLine}</ClothParagraph>
          <ClothParagraph className="professional-summary">{profile.summary}</ClothParagraph>
          <div className="professional-actions">
            <a href="#professional-resume" style={{ background: "var(--accent-2)", color: "#ffffff", borderColor: "var(--accent-2)" }}>
              View Resume
            </a>
            <a href="#professional-cv" style={{ background: "var(--accent-2)", color: "#ffffff", borderColor: "var(--accent-2)" }}>
              View CV
            </a>
            <a href="/docs/resumelatest.pdf" download="Rachit_Asthana_Resume.pdf">
              Download Resume (PDF)
            </a>
            <a href="/docs/cvlatest.pdf" download="Rachit_Asthana_CV.pdf">
              Download CV (PDF)
            </a>
            <a href={`mailto:${profile.email}`}>Email me</a>
            <a href={profile.githubUrl} target="_blank" rel="noreferrer">
              GitHub
            </a>
            <a href={profile.linkedinUrl} target="_blank" rel="noreferrer">
              LinkedIn
            </a>
          </div>
        </div>
        <aside className="professional-card">
          <strong>Core stack</strong>
          <p>Laravel, React, TypeScript, cloud platforms, DevOps practices, and AI integrations.</p>
        </aside>
      </section>

      <Highlights compact />

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
                    <span
                      key={tag}
                      className="tag-chip"
                      style={{
                        fontSize: "10px",
                        padding: "2px 6px",
                        borderRadius: "4px",
                        background: "color-mix(in srgb, var(--panel-2) 60%, transparent)",
                        border: "1px solid var(--line)",
                        color: "var(--text-dim)",
                      }}
                    >
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
              <p style={{ margin: 0, color: "var(--text-dim)", fontSize: "14px", lineHeight: "1.6" }}>
                {project.summary}
              </p>
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

      {/* Embedded Resume Viewer */}
      <Section id="professional-resume" eyebrow="credentials" title="Professional Resume">
        <div className="professional-card" style={{ padding: "24px", display: "flex", flexDirection: "column", gap: "20px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "16px" }}>
            <div>
              <h3 style={{ margin: 0, fontSize: "20px" }}>Rachit Asthana — Professional Resume</h3>
              <p style={{ margin: "4px 0 0", color: "var(--text-dim)", fontSize: "14px" }}>
                Summary of technical skillsets, highlighted achievements, and latest work history.
              </p>
            </div>
            <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
              <a
                href="/docs/resumelatest.pdf"
                download="Rachit_Asthana_Resume.pdf"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "8px",
                  padding: "10px 18px",
                  background: "var(--accent-2)",
                  color: "#ffffff",
                  borderRadius: "999px",
                  fontWeight: "600",
                  fontSize: "13px",
                  textDecoration: "none",
                  border: "none",
                  cursor: "pointer",
                }}
              >
                <Download size={14} /> Download Resume (PDF)
              </a>
              <a
                href="/docs/resumelatest.pdf"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "8px",
                  padding: "10px 18px",
                  background: "var(--panel-2)",
                  color: "var(--text)",
                  border: "1px solid var(--line)",
                  borderRadius: "999px",
                  fontWeight: "600",
                  fontSize: "13px",
                  textDecoration: "none",
                }}
              >
                <ExternalLink size={14} /> Open Fullscreen
              </a>
            </div>
          </div>

          <div style={{ width: "100%", height: "750px", borderRadius: "14px", overflow: "hidden", border: "1px solid var(--line)", background: "var(--panel)", boxShadow: "0 12px 36px rgba(0,0,0,0.12)" }}>
            <iframe
              src="/docs/resumelatest.pdf"
              width="100%"
              height="100%"
              style={{ border: "none" }}
              title="Rachit Asthana Resume"
            />
          </div>
        </div>
      </Section>

      {/* Embedded CV Viewer */}
      <Section id="professional-cv" eyebrow="curriculum vitae" title="Detailed Curriculum Vitae (CV)">
        <div className="professional-card" style={{ padding: "24px", display: "flex", flexDirection: "column", gap: "20px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "16px" }}>
            <div>
              <h3 style={{ margin: 0, fontSize: "20px" }}>Rachit Asthana — Full Curriculum Vitae</h3>
              <p style={{ margin: "4px 0 0", color: "var(--text-dim)", fontSize: "14px" }}>
                Comprehensive catalog of academic accomplishments, research papers, publications, and full technical experience.
              </p>
            </div>
            <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
              <a
                href="/docs/cvlatest.pdf"
                download="Rachit_Asthana_CV.pdf"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "8px",
                  padding: "10px 18px",
                  background: "var(--accent-2)",
                  color: "#ffffff",
                  borderRadius: "999px",
                  fontWeight: "600",
                  fontSize: "13px",
                  textDecoration: "none",
                  border: "none",
                  cursor: "pointer",
                }}
              >
                <FileText size={14} /> Download CV (PDF)
              </a>
              <a
                href="/docs/cvlatest.pdf"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "8px",
                  padding: "10px 18px",
                  background: "var(--panel-2)",
                  color: "var(--text)",
                  border: "1px solid var(--line)",
                  borderRadius: "999px",
                  fontWeight: "600",
                  fontSize: "13px",
                  textDecoration: "none",
                }}
              >
                <ExternalLink size={14} /> Open Fullscreen
              </a>
            </div>
          </div>

          <div style={{ width: "100%", height: "750px", borderRadius: "14px", overflow: "hidden", border: "1px solid var(--line)", background: "var(--panel)", boxShadow: "0 12px 36px rgba(0,0,0,0.12)" }}>
            <iframe
              src="/docs/cvlatest.pdf"
              width="100%"
              height="100%"
              style={{ border: "none" }}
              title="Rachit Asthana CV"
            />
          </div>
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

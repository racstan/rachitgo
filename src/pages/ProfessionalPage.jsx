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

      <Section id="professional-projects" eyebrow="selected work" title="Projects with context">
        <div className="professional-grid">
          {projectCards.map((project) => (
            <article key={project.id} className="professional-card">
              <h3>{project.title}</h3>
              <p>{project.summary}</p>
              <ul>
                {project.highlights.map((item) => <li key={item}>{item}</li>)}
              </ul>
            </article>
          ))}
        </div>
      </Section>

      <Section id="professional-experience" eyebrow="experience" title="Education, internships, and research">
        <div className="professional-timeline">
          {experienceTimeline.map((item) => (
            <article key={`${item.year}-${item.role}`} className="professional-row">
              <span>{item.year}</span>
              <div>
                <h3>{item.role}</h3>
                <p>{item.company}</p>
                <small>{item.desc}</small>
              </div>
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
            <a key={contact.id} className="professional-card professional-contact-card" href={contact.href}>
              <strong>{contact.platform}</strong>
              <span>{contact.handle}</span>
            </a>
          ))}
        </div>
      </Section>
    </article>
  );
}

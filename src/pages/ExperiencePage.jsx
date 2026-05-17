import React from "react";
import TiltCard from "../components/TiltCard.jsx";
import HoverTypingText from "../components/HoverTypingText.jsx";
import Timeline from "../components/Timeline.jsx";
import { experienceTimeline, skillGroups } from "../data/profile.js";

export default function ExperiencePage() {
  return (
    <section className="page experience-page">
      <div className="section-head">
        <p className="eyebrow">my roadmap</p>
        <HoverTypingText
          element="h2"
          variants={[
            "From VIT to product engineering.",
            "Internships, research, and products.",
            "Data, full-stack, and AI systems.",
            "The work behind the portfolio.",
            "A practical engineering timeline.",
          ]}
        />
      </div>

      <Timeline items={experienceTimeline} />

      {/* Skills grid */}
      <div className="section-head" style={{ marginTop: "64px" }}>
        <p className="eyebrow">technical skills</p>
        <HoverTypingText
          element="h2"
          variants={[
            "The full stack, top to bottom.",
            "Frontend to backend to systems.",
            "From UI polish to infra glue.",
            "A stack built for shipping.",
            "Skills that span the build.",
          ]}
        />
      </div>
      <div className="skills-grid">
        {skillGroups.map((group) => (
          <TiltCard key={group.cat} className="skill-card" color="var(--accent)">
            <h3 className="skill-cat">{group.cat}</h3>
            <div className="skill-items">
              {group.items.map((item) => (
                <span key={item} className="skill-badge">{item}</span>
              ))}
            </div>
          </TiltCard>
        ))}
      </div>
    </section>
  );
}

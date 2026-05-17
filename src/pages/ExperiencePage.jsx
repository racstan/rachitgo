import React from "react";
import TiltCard from "../components/TiltCard.jsx";
import HoverTypingText from "../components/HoverTypingText.jsx";
import Timeline, { timelineData } from "../components/Timeline.jsx";

const skills = [
  { cat: "Languages",  items: ["JavaScript", "TypeScript", "Python", "Rust", "Go", "C", "C++", "Java", "Bash"] },
  { cat: "Frontend",   items: ["React", "Next.js", "Vite", "CSS Modules", "Framer Motion", "Tailwind"] },
  { cat: "Backend",    items: ["Node.js", "Express", "FastAPI", "PostgreSQL", "Redis", "GraphQL"] },
  { cat: "Systems",    items: ["Linux", "Docker", "AWS", "Nginx", "Git", "CI/CD"] },
];

export default function ExperiencePage() {
  return (
    <section className="page experience-page">
      <div className="section-head">
        <p className="eyebrow">my roadmap</p>
        <HoverTypingText
          element="h2"
          variants={[
            "From first line of code\nto production systems.",
            "From curiosity to production\nsystems.",
            "From learning to shipping\nreal software.",
            "From notebooks to systems\nin the wild.",
            "From experiments to\nproduction work.",
          ]}
        />
      </div>

      <Timeline items={[...timelineData].reverse()} />

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
        {skills.map((group) => (
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

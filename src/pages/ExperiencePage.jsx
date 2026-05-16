import React, { useRef } from "react";
import Timeline from "../components/Timeline.jsx";

const skills = [
  { cat: "Languages",  items: ["JavaScript", "TypeScript", "Python", "Rust", "Go", "C", "C++", "Java", "Bash"] },
  { cat: "Frontend",   items: ["React", "Next.js", "Vite", "CSS Modules", "Framer Motion", "Tailwind"] },
  { cat: "Backend",    items: ["Node.js", "Express", "FastAPI", "PostgreSQL", "Redis", "GraphQL"] },
  { cat: "Systems",    items: ["Linux", "Docker", "AWS", "Nginx", "Git", "CI/CD"] },
];

// 3D tilt card hook
function useTilt(strength = 12) {
  const ref = useRef(null);
  function onMove(e) {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width  - 0.5) * strength;
    const y = ((e.clientY - rect.top)  / rect.height - 0.5) * -strength;
    el.style.transform = `perspective(600px) rotateX(${y}deg) rotateY(${x}deg) scale(1.03)`;
  }
  function onLeave() {
    const el = ref.current;
    if (!el) return;
    el.style.transform = "perspective(600px) rotateX(0deg) rotateY(0deg) scale(1)";
  }
  return { ref, onMouseMove: onMove, onMouseLeave: onLeave };
}

function TiltCard({ children, className = "", color }) {
  const tilt = useTilt(10);
  return (
    <div
      {...tilt}
      className={`tilt-card ${className}`}
      style={{ "--card-accent": color, transition: "transform 0.15s ease" }}
    >
      {children}
    </div>
  );
}

export default function ExperiencePage() {
  return (
    <section className="page experience-page">
      <div className="section-head">
        <p className="eyebrow">my roadmap</p>
        <h2>From first line of code<br />to production systems.</h2>
      </div>

      <Timeline />

      {/* Skills grid */}
      <div className="section-head" style={{ marginTop: "64px" }}>
        <p className="eyebrow">technical skills</p>
        <h2>The full stack, top to bottom.</h2>
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

import React, { useRef, useState } from "react";

const timeline = [
  {
    year: "2024–Now",
    role: "Full-Stack Engineer",
    company: "Freelance / Self-Employed",
    tags: ["React", "Node.js", "PostgreSQL", "AWS"],
    desc: "Building production web products for clients — dashboards, SaaS tools, developer utilities, and automated pipelines. Focus on performance, clean APIs, and maintainable codebases.",
    icon: "🚀",
    color: "#3fb950",
  },
  {
    year: "2023–2024",
    role: "Developer Tools & OSS",
    company: "Personal Projects",
    tags: ["Rust", "Python", "CLI", "Systems"],
    desc: "Developed CLI tools, source inspection utilities, and low-level systems demos. Explored compiler design, runtime internals, and memory layout through hands-on experiments.",
    icon: "🔧",
    color: "#58a6ff",
  },
  {
    year: "2022–2023",
    role: "Web Development",
    company: "Internships & Contracts",
    tags: ["Next.js", "TypeScript", "Docker"],
    desc: "Shipped features in production React apps, built REST and GraphQL APIs, containerised services, and wrote integration tests. First exposure to real engineering workflows and code review.",
    icon: "💻",
    color: "#d29922",
  },
  {
    year: "2020–2022",
    role: "B.Tech Computer Science",
    company: "University",
    tags: ["DSA", "OS", "DBMS", "Networks", "Compilers"],
    desc: "Deep focus on computer science fundamentals — data structures, algorithms, operating systems, databases, networking protocols, and compiler basics. Built the mental models that underpin everything.",
    icon: "🎓",
    color: "#e040fb",
  },
  {
    year: "2019–2020",
    role: "First Lines of Code",
    company: "Self-taught",
    tags: ["C", "Python", "HTML/CSS"],
    desc: "Wrote the first program. Fell in love with the idea that a machine does exactly what you tell it. Started with competitive programming and small automation scripts.",
    icon: "✨",
    color: "#ff7043",
  },
];

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

      {/* Timeline */}
      <div className="timeline">
        {timeline.map((item, i) => (
          <TiltCard key={i} className="timeline-card" color={item.color}>
            <div className="timeline-left">
              <div className="timeline-dot" style={{ background: item.color, boxShadow: `0 0 16px ${item.color}88` }}>
                {item.icon}
              </div>
              {i < timeline.length - 1 && <div className="timeline-line" style={{ background: `linear-gradient(${item.color}, ${timeline[i+1].color})` }} />}
            </div>
            <div className="timeline-body">
              <div className="timeline-year" style={{ color: item.color }}>{item.year}</div>
              <div className="timeline-role">{item.role}</div>
              <div className="timeline-company">{item.company}</div>
              <p className="timeline-desc">{item.desc}</p>
              <div className="timeline-tags">
                {item.tags.map((t) => (
                  <span key={t} className="timeline-tag" style={{ borderColor: `${item.color}55`, color: item.color }}>{t}</span>
                ))}
              </div>
            </div>
          </TiltCard>
        ))}
      </div>

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

import React, { useRef } from "react";

export const timelineData = [
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

function useTilt(strength = 12) {
  const ref = useRef(null);
  function onMove(e) {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width  - 0.5) * strength;
    const y = ((e.clientY - rect.top)  / rect.height - 0.5) * -strength;
    el.style.transform = `perspective(600px) rotateX(${y}deg) rotateY(${x}deg) scale(1.01)`;
  }
  function onLeave() {
    const el = ref.current;
    if (!el) return;
    el.style.transform = "perspective(600px) rotateX(0deg) rotateY(0deg) scale(1)";
  }
  return { ref, onMouseMove: onMove, onMouseLeave: onLeave };
}

function TiltCard({ children, className = "", color }) {
  const tilt = useTilt(8);
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

export default function Timeline() {
  return (
    <div className="timeline-container">
      <div className="timeline-branch" />
      {timelineData.map((item, i) => (
        <div key={i} className="timeline-row">
          <div className="timeline-node">
            <div className="timeline-dot-inner" style={{ borderColor: item.color, background: `${item.color}22` }} />
          </div>
          <TiltCard className="timeline-content" color={item.color}>
            <div className="timeline-header">
              <span className="timeline-role">{item.role}</span>
              <span className="timeline-year">{item.year}</span>
            </div>
            <div className="timeline-company">{item.company}</div>
            <p className="timeline-desc">{item.desc}</p>
            <div className="timeline-tags">
              {item.tags.map((t) => (
                <span key={t} className="timeline-tag" style={{ borderColor: `${item.color}55`, color: item.color }}>{t}</span>
              ))}
            </div>
          </TiltCard>
        </div>
      ))}
    </div>
  );
}

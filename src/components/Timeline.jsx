import React, { useEffect, useRef } from "react";
import TiltCard from "./TiltCard.jsx";
import WaveText from "./WaveText.jsx";

export const timelineData = [
  {
    year: "2019–2020",
    role: "First Lines of Code",
    company: "Self-taught",
    tags: ["C", "Python", "HTML/CSS"],
    desc: "Wrote the first program. Fell in love with the idea that a machine does exactly what you tell it. Started with competitive programming and small automation scripts.",
    icon: "✨",
    color: "#ff7043",
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
    year: "2022–2023",
    role: "Web Development",
    company: "Internships & Contracts",
    tags: ["Next.js", "TypeScript", "Docker"],
    desc: "Shipped features in production React apps, built REST and GraphQL APIs, containerised services, and wrote integration tests. First exposure to real engineering workflows and code review.",
    icon: "💻",
    color: "#d29922",
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
    year: "2024–Now",
    role: "Full-Stack Engineer",
    company: "Freelance / Self-Employed",
    tags: ["React", "Node.js", "PostgreSQL", "AWS"],
    desc: "Building production web products for clients — dashboards, SaaS tools, developer utilities, and automated pipelines. Focus on performance, clean APIs, and maintainable codebases.",
    icon: "🚀",
    color: "#3fb950",
  },
];

export default function Timeline({ items }) {
  const data = items || timelineData;
  const rowRefs = useRef([]);

  useEffect(() => {
    const rows = rowRefs.current.filter(Boolean);
    if (!rows.length) return undefined;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
          } else {
            entry.target.classList.remove("is-visible");
          }
        });
      },
      { threshold: 0.2, rootMargin: "0px 0px -10% 0px" },
    );

    rows.forEach((row) => observer.observe(row));
    return () => observer.disconnect();
  }, [data.length]);
  return (
    <div className="timeline-container">
      <div className="timeline-branch" />
      {data.map((item, i) => (
        <div
          key={i}
          className="timeline-row"
          ref={(el) => {
            rowRefs.current[i] = el;
          }}
        >
          <div className="timeline-node">
            <div className="timeline-dot-inner" style={{ borderColor: item.color, background: `${item.color}22` }} />
          </div>
          <TiltCard className="timeline-content" color={item.color}>
            <div className="timeline-header">
              <span className="timeline-role"><WaveText text={item.role} /></span>
              <span className="timeline-year">{item.year}</span>
            </div>
            <div className="timeline-company">{item.company}</div>
            <p className="timeline-desc expandable-text">{item.desc}</p>
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

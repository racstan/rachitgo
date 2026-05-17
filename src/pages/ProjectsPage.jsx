import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import TiltCard from "../components/TiltCard.jsx";
import HoverTypingText from "../components/HoverTypingText.jsx";

const projectGroups = [
  {
    id: "academic",
    title: "Academic projects",
    summary: "Coursework and research prototypes focused on fundamentals and clarity.",
    highlights: ["Coursework prototypes", "Research experiments", "Capstone builds"],
  },
  {
    id: "work",
    title: "Work projects",
    summary: "Client and team builds that ship to production and support real users.",
    highlights: ["Product dashboards", "Workflow automation", "Production releases"],
  },
  {
    id: "hobby",
    title: "Hobby projects",
    summary: "Personal experiments and open-source ideas for learning and fun.",
    highlights: ["UI experiments", "Developer tooling", "Learning builds"],
  },
];

export default function ProjectsPage({ onActivate }) {
  useEffect(() => {
    onActivate("project-os");
  }, [onActivate]);

  return (
    <section className="section page">
      <div className="section-head">
        <p className="eyebrow">projects</p>
        <HoverTypingText
          element="h2"
          variants={[
            "Project categories",
            "Work, academic, and hobby builds",
            "What I build across contexts",
            "Projects by focus area",
            "A snapshot of what I ship",
          ]}
        />
      </div>
      <div className="card-grid">
        {projectGroups.map((group) => (
          <TiltCard
            key={group.id}
            element="article"
            className="portfolio-card project-card"
            onMouseEnter={() => onActivate(group.id)}
            onFocus={() => onActivate(group.id)}
            tabIndex={0}
          >
            <span>Category</span>
            <h3>{group.title}</h3>
            <p>{group.summary}</p>
            <ul className="project-card-list">
              {group.highlights.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
            <Link className="project-card-action" to="/contact">
              Explore More
            </Link>
          </TiltCard>
        ))}
      </div>
    </section>
  );
}

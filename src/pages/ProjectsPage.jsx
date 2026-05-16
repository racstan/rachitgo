import React, { useEffect } from "react";
import { portfolioItems } from "../data/portfolio.js";

const projects = portfolioItems.filter((item) => item.type === "Project");

export default function ProjectsPage({ onActivate }) {
  useEffect(() => {
    onActivate("project-os");
  }, [onActivate]);

  return (
    <section className="section page">
      <div className="section-head">
        <p className="eyebrow">projects</p>
        <h2>Selected projects</h2>
      </div>
      <div className="card-grid">
        {projects.map((project) => (
          <article
            key={project.id}
            className="portfolio-card"
            onMouseEnter={() => onActivate(project.id)}
            onFocus={() => onActivate(project.id)}
            tabIndex={0}
          >
            <span>{project.type}</span>
            <h3>{project.title}</h3>
            <strong>{project.subtitle}</strong>
            <p>{project.detail}</p>
          </article>
        ))}
      </div>
    </section>
  );
}

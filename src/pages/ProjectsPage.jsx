import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import TiltCard from "../components/TiltCard.jsx";
import HoverTypingText from "../components/HoverTypingText.jsx";
import { projectCards } from "../data/profile.js";

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
            "Projects with real context.",
            "Healthcare, research, and embedded systems.",
            "What I have built so far.",
            "From prototypes to product systems.",
            "A practical project snapshot.",
          ]}
        />
      </div>
      <div className="card-grid">
        {projectCards.map((group) => (
          <TiltCard
            key={group.id}
            element="article"
            className="portfolio-card project-card"
            onMouseEnter={() => onActivate(group.activateId)}
            onFocus={() => onActivate(group.activateId)}
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

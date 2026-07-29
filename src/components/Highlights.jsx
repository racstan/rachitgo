import React, { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, PlayCircle, Sparkles, Video, Terminal, Cpu } from "lucide-react";
import HoverTypingText from "./HoverTypingText.jsx";
import ClothParagraph from "./ClothParagraph.jsx";
import { projectCards } from "../data/profile.js";
import { caseStudies } from "../data/caseStudies.js";

const icons = [Sparkles, Video, PlayCircle, Terminal, Cpu];

export default function Highlights({ compact = false }) {
  const highlightProjects = useMemo(() => {
    return projectCards.map((project) => {
      const detail = caseStudies[project.id];
      return {
        ...project,
        category: detail?.category ?? "Project",
        subtitle: detail?.subtitle ?? "",
        metrics: detail?.metrics ?? [],
        videoUrl: detail?.videoUrl ?? "",
      };
    });
  }, []);

  const [activeId, setActiveId] = useState(highlightProjects[0]?.id);
  const activeProject = useMemo(
    () => highlightProjects.find((project) => project.id === activeId) ?? highlightProjects[0],
    [activeId, highlightProjects],
  );
  const activeMetrics = activeProject?.metrics?.slice(0, 3) ?? [];

  if (!activeProject) {
    return null;
  }

  return (
    <section className={`highlights ${compact ? "highlights-compact" : ""}`} aria-label="Project highlights">
      <div className="section-head highlights-head">
        <p className="eyebrow">highlights</p>
        <HoverTypingText
          element="h2"
          variants={[
            "Highlights with the build story on video.",
            "Curated moments and project walkthroughs.",
            "Metrics that mattered.",
          ]}
        />
        <ClothParagraph>
          Curated moments from each project, paired with the walkthrough video and the metrics that mattered.
        </ClothParagraph>
      </div>

      <div className="highlights-grid">
        <div className="highlight-list" role="list">
          {highlightProjects.map((project, index) => {
            const Icon = icons[index % icons.length];
            const active = project.id === activeProject.id;
            return (
              <button
                key={project.id}
                type="button"
                className={`highlight-item ${active ? "active" : ""}`}
                onClick={() => setActiveId(project.id)}
                onFocus={() => setActiveId(project.id)}
              >
                <Icon size={18} />
                <span>
                  <strong>{project.title}</strong>
                  <small>{project.highlights.join(" • ")}</small>
                </span>
              </button>
            );
          })}
        </div>

        <article className="highlight-detail-card">
          <div className="highlight-detail-top">
            <div>
              <span className="highlight-label">{activeProject.category}</span>
              <h3>{activeProject.title}</h3>
              {activeProject.subtitle && <p className="highlight-subtitle">{activeProject.subtitle}</p>}
            </div>
            {activeProject.href && (
              <Link to={activeProject.href} className="highlight-link">
                view project <ArrowRight size={14} />
              </Link>
            )}
          </div>
          <ClothParagraph className="highlight-summary">{activeProject.summary}</ClothParagraph>
          <div className="highlight-tags">
            {activeProject.highlights.map((item) => (
              <span key={item} className="highlight-tag">{item}</span>
            ))}
          </div>
          {activeMetrics.length > 0 && (
            <div className="highlight-metrics">
              {activeMetrics.map((metric) => (
                <div key={metric.label} className="highlight-metric">
                  <strong>{metric.value}</strong>
                  <span>{metric.label}</span>
                </div>
              ))}
            </div>
          )}
          {activeProject.videoUrl && (
            <div className="highlight-video">
              <video
                src={activeProject.videoUrl}
                controls
                playsInline
                preload="metadata"
              />
            </div>
          )}
        </article>
      </div>
    </section>
  );
}

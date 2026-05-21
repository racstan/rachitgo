import React from "react";
import { useParams, Link, Navigate } from "react-router-dom";
import { caseStudies } from "../data/caseStudies.js";
import { ArrowLeft, Cpu, AlertCircle, Award, CheckCircle } from "lucide-react";

export default function ProjectDetailPage() {
  const { id } = useParams();
  const project = caseStudies[id];

  if (!project) {
    return <Navigate to="/projects" replace />;
  }

  return (
    <article className="page project-detail-page">
      <Link to="/projects" className="back-link">
        <ArrowLeft size={16} /> Back to Projects
      </Link>

      <header className="project-detail-header">
        <div className="project-detail-meta">
          <span className="eyebrow">{project.category}</span>
          <span className="project-duration">{project.timeline}</span>
        </div>
        <h1>{project.title}</h1>
        <p className="project-subtitle">{project.subtitle}</p>
        <p className="project-role-badge">Role: <strong>{project.role}</strong></p>
      </header>

      {/* Metrics Row */}
      <section className="metrics-grid" aria-label="Key performance indicators">
        {project.metrics.map((metric, i) => (
          <div key={i} className="metric-box">
            <span className="metric-value">{metric.value}</span>
            <span className="metric-label">{metric.label}</span>
          </div>
        ))}
      </section>

      <div className="project-detail-grid">
        {/* Main Content Column */}
        <div className="project-detail-main">
          <section className="detail-section">
            <h3>Problem Statement</h3>
            <p className="lead-text">{project.problem}</p>
          </section>

          <section className="detail-section">
            <h3>System Architecture</h3>
            <div className="architecture-timeline">
              {project.architecture.map((arch, i) => (
                <div key={i} className="arch-card">
                  <div className="arch-header">
                    <Cpu size={16} className="icon-blue" />
                    <h4>{arch.layer}</h4>
                  </div>
                  <p>{arch.details}</p>
                </div>
              ))}
            </div>
          </section>

          <section className="detail-section">
            <h3>Technical Challenges & Engineering</h3>
            <div className="challenges-container">
              {project.challenges.map((challenge, i) => (
                <div key={i} className="challenge-card">
                  <div className="challenge-header">
                    <AlertCircle size={16} className="icon-amber" />
                    <h4>{challenge.title}</h4>
                  </div>
                  <p>{challenge.description}</p>
                </div>
              ))}
            </div>
          </section>

          <section className="detail-section outcome-section">
            <div className="outcome-header">
              <CheckCircle size={20} className="icon-green" />
              <h3>Business & Technical Outcomes</h3>
            </div>
            <p>{project.outcomes}</p>
          </section>
        </div>

        {/* Sidebar Info Column */}
        <aside className="project-detail-sidebar">
          <div className="sidebar-card">
            <h4>Technology Stack</h4>
            <div className="tech-tags">
              {project.techStack.map((tech) => (
                <span key={tech} className="tech-tag">
                  {tech}
                </span>
              ))}
            </div>
          </div>

          <div className="sidebar-card credential-card">
            <Award size={20} className="icon-gold" />
            <h4>Validation</h4>
            <p>
              Tested and benchmarked for compliance and computational accuracy.
            </p>
          </div>
        </aside>
      </div>

      {project.videoUrl && (
        <section className="detail-section project-video-section" style={{ marginTop: "48px" }}>
          <h3 style={{ marginBottom: "16px", display: "flex", alignItems: "center", gap: "8px" }}>
            <span style={{ display: "inline-block", width: "8px", height: "8px", borderRadius: "50%", background: "var(--accent)" }}></span>
            Implementation Walkthrough Video
          </h3>
          <div style={{
            position: "relative",
            width: "100%",
            borderRadius: "16px",
            overflow: "hidden",
            border: "1px solid var(--line)",
            background: "var(--panel)",
            boxShadow: "0 20px 40px rgba(0,0,0,0.15)",
            aspectRatio: "16/9"
          }}>
            <video
              src={project.videoUrl}
              controls
              playsInline
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                display: "block"
              }}
            />
          </div>
        </section>
      )}
    </article>
  );
}

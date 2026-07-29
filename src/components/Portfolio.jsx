import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import TiltCard from "./TiltCard.jsx";
import ClothParagraph from "./ClothParagraph.jsx";
import { portfolioItems } from "../data/portfolio.js";
import { languages } from "../data/languages.js";

const projects = portfolioItems.filter((item) => item.type === "Project");
const experience = portfolioItems.find((item) => item.id === "experience");
const academics = portfolioItems.find((item) => item.id === "academics");
const skills = portfolioItems.find((item) => item.id === "skills");
const identityModes = [
  { label: "developer", value: "Rachit Asthana" },
];

export default function Portfolio({ activeId, onActivate, labOpen, onToggleLab }) {
  const [identityIndex, setIdentityIndex] = useState(0);
  const [roleIndex, setRoleIndex] = useState(0);

  const roleOptions = [
    "Product Engineer",
    "Full Stack Architect",
    "Systems Builder",
    "Software Developer",
    "Freelance Engineer",
    "Citizen of Earth",
    "Clash of Clans player (Yes, I still do upgrades)",
    "Age of Empires lover (Wood please!)",
    "Coffee-to-Code Compiler",
    "Professional Bug Creator & Solver",
    "Vim Escaper (Stuck since 2021)",
    "Linux Daily Driver",
    "Terminal Over GUI",
    "Stack Overflow Archaeologist",
    "Dark Mode Loyalist",
    "git push --force Survivor",
    "npm install Hope",
    "Laravel Artisan",
    "React Hook Addict",
    "TypeScript Evangelist",
    "Docker Compose Poet",
    "Database Schema Designer",
    "Open Source Contributor",
    "Documentation Reader (Rare Breed)",
    "Pixel Perfectionist",
    "Keyboard Shortcut Maximizer",
  ];

  useEffect(() => {
    const timer = window.setInterval(() => {
      setIdentityIndex((index) => (index + 1) % identityModes.length);
    }, 1200);
    return () => window.clearInterval(timer);
  }, []);

  const identity = identityModes[identityIndex];

  return (
    <section className="portfolio">
      <motion.section
        className="hero"
        id="profile"
        onMouseEnter={() => onActivate("profile")}
        onFocus={() => onActivate("profile")}
        tabIndex={0}
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.55 }}
      >
        <p
          className="eyebrow"
          style={{ cursor: "pointer", display: "inline-block" }}
          onPointerEnter={() => setRoleIndex((prev) => {
            const next = Math.floor(Math.random() * roleOptions.length);
            return next === prev ? (next + 1) % roleOptions.length : next;
          })}
          onFocus={() => setRoleIndex((prev) => {
            const next = Math.floor(Math.random() * roleOptions.length);
            return next === prev ? (next + 1) % roleOptions.length : next;
          })}
          title={roleOptions.join(" / ")}
        >
          {roleOptions[roleIndex].toLowerCase()}
        </p>
        <h1>Rachit Asthana</h1>
        <ClothParagraph>
          I architect production software that solves real problems — from clinical AI platforms to high-performance
          AI trading engines like Forgededge. This portfolio is the engineering layer; the professional view is one toggle away.
        </ClothParagraph>
        <div className="identity-strip" aria-label={`Identity shown as ${identity.label}`}>
          <span>{identity.label}</span>
          <code key={identity.value}>{identity.value}</code>
        </div>
        <div className="hero-links">
          <a href="#projects">View projects</a>
          <a href="#services">Hire for work</a>
          <a href="mailto:asthanarachit@gmail.com">Contact me</a>
        </div>
      </motion.section>

      <section className="section compact-section" id="about">
        <div className="section-head">
          <p className="eyebrow">about</p>
          <h2>I care about software that ships, systems that scale, and code that other engineers can actually read.</h2>
        </div>
        <div className="two-col">
          <TiltCard element="article" className="plain-panel">
            <strong>What I care about</strong>
            <p>
              Clean architecture that other engineers can read, production UX that users actually enjoy,
              and performance metrics I can measure — not just claim.
            </p>
          </TiltCard>
          <TiltCard element="article" className="plain-panel">
            <strong>How I work</strong>
            <p>
              Scope it, design it, build it, test it, ship it, then polish it. I work in structured sprints
              with clear deliverables — no ambiguity, no scope creep.
            </p>
          </TiltCard>
        </div>
      </section>

      <section className="section compact-section" id="services">
        <div className="section-head">
          <p className="eyebrow">what I do</p>
          <h2>From database schemas to pixel-perfect UIs — I build the full picture.</h2>
        </div>
        <div className="service-grid">
          <TiltCard element="article" className="service-card">
            <span className="service-num">01</span>
            <h3>Full-stack products</h3>
            <p>Laravel + React applications with real-time features, clean APIs, and production-grade deployment pipelines.</p>
          </TiltCard>
          <TiltCard element="article" className="service-card">
            <span className="service-num">02</span>
            <h3>AI-powered workflows</h3>
            <p>OpenAI integrations, ML pipelines, intelligent document processing, and AI scribes built into real business tools.</p>
          </TiltCard>
          <TiltCard element="article" className="service-card">
            <span className="service-num">03</span>
            <h3>High-performance systems</h3>
            <p>AWS deployments, Docker orchestration, AI data processing pipelines, and high-performance background job architectures.</p>
          </TiltCard>
        </div>
        <div className="language-band" aria-label="Languages represented on this page">
          {languages.map((language) => (
            <span key={language.id}>{language.name}</span>
          ))}
        </div>
      </section>

      <section className="section" id="projects">
        <div className="section-head">
          <p className="eyebrow">portfolio</p>
          <h2>Projects</h2>
        </div>
        <div className="card-grid">
          {projects.map((project) => (
            <TiltCard
              key={project.id}
              element="article"
              className={`portfolio-card ${activeId === project.id ? "active" : ""}`}
              onMouseEnter={() => onActivate(project.id)}
              onFocus={() => onActivate(project.id)}
              onClick={() => onActivate(project.id)}
              tabIndex={0}
            >
              <span>{project.type}</span>
              <h3>{project.title}</h3>
              <strong>{project.subtitle}</strong>
              <p>{project.detail}</p>
            </TiltCard>
          ))}
        </div>
      </section>

      <section className="section two-col" id="experience">
        <TiltCard element="article" className="plain-panel" onMouseEnter={() => onActivate("experience")} onFocus={() => onActivate("experience")} tabIndex={0}>
          <p className="eyebrow">experience</p>
          <h2>{experience.title}</h2>
          <strong>{experience.subtitle}</strong>
          <p>{experience.detail}</p>
        </TiltCard>
        <TiltCard element="article" className="plain-panel" onMouseEnter={() => onActivate("academics")} onFocus={() => onActivate("academics")} tabIndex={0}>
          <p className="eyebrow">academics</p>
          <h2>{academics.title}</h2>
          <strong>{academics.subtitle}</strong>
          <p>{academics.detail}</p>
        </TiltCard>
      </section>

      <section className="section" id="skills">
        <TiltCard element="article" className="plain-panel" onMouseEnter={() => onActivate("skills")} onFocus={() => onActivate("skills")} tabIndex={0}>
          <p className="eyebrow">skills</p>
          <h2>{skills.title}</h2>
          <strong>{skills.subtitle}</strong>
          <p>{skills.detail}</p>
          <div className="language-band">
            {languages.map((language) => (
              <span key={language.id}>{language.name}</span>
            ))}
          </div>
        </TiltCard>
      </section>

      <section className="section compact-section" id="academics">
        <TiltCard element="article" className="plain-panel">
          <p className="eyebrow">addition feature</p>
          <h2>Low-level execution lab</h2>
          <p>
            Core portfolio content stays simple and direct. The code lab is an extra engineering view for visitors
            who want to inspect runtime and execution concepts in detail.
          </p>
          <div className="hero-links">
            <button onClick={onToggleLab}>{labOpen ? "Hide Lab View" : "Open Lab View"}</button>
            <a href="#profile">Back to top</a>
          </div>
        </TiltCard>
      </section>

      <footer
        className="contact"
        id="contact"
        onMouseEnter={() => onActivate("contact")}
        onFocus={() => onActivate("contact")}
        tabIndex={0}
      >
        <div>
          <p className="eyebrow">contact</p>
          <h2>Let's build software that people rely on and engineers respect.</h2>
        </div>
        <a href="mailto:asthanarachit@gmail.com">asthanarachit@gmail.com</a>
      </footer>
    </section>
  );
}

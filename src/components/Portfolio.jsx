import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import TiltCard from "./TiltCard.jsx";
import { portfolioItems } from "../data/portfolio.js";
import { languages } from "../data/languages.js";

const projects = portfolioItems.filter((item) => item.type === "Project");
const experience = portfolioItems.find((item) => item.id === "experience");
const academics = portfolioItems.find((item) => item.id === "academics");
const skills = portfolioItems.find((item) => item.id === "skills");
const identityModes = [
  { label: "plain", value: "Rachit Asthana" },
  { label: "hex", value: "52 61 63 68 69 74 20 41 73 74 68 61 6e 61" },
  { label: "binary", value: "01010010 01100001 01100011 01101000 01101001 01110100" },
  { label: "python", value: 'print("Rachit Asthana")' },
  { label: "rust", value: 'println!("Rachit Asthana");' },
  { label: "hindi", value: "रचित अस्थाना" },
];

export default function Portfolio({ activeId, onActivate, labOpen, onToggleLab }) {
  const [identityIndex, setIdentityIndex] = useState(0);

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
        <p className="eyebrow">software developer / freelancer / builder</p>
        <h1>Rachit Asthana</h1>
        <p>
          I build web products, developer tools, automation, and systems-minded experiments. The portfolio stays
          readable for clients and recruiters, while the side lab keeps the low-level execution view as a playful
          engineering layer.
        </p>
        <div className="identity-strip" aria-label={`Identity shown as ${identity.label}`}>
          <span>{identity.label}</span>
          <code key={identity.value}>{identity.value}</code>
        </div>
        <div className="hero-links">
          <a href="#projects">View projects</a>
          <a href="#services">Hire for work</a>
          <a href="mailto:rachit@example.com">Contact me</a>
        </div>
      </motion.section>

      <section className="section compact-section" id="about">
        <div className="section-head">
          <p className="eyebrow">about</p>
          <h2>Software engineer focused on products that ship and systems that hold up.</h2>
        </div>
        <div className="two-col">
          <TiltCard element="article" className="plain-panel">
            <strong>What I care about</strong>
            <p>
              Clear architecture, production quality UX, measurable performance, and readable code that teams can
              extend without friction.
            </p>
          </TiltCard>
          <TiltCard element="article" className="plain-panel">
            <strong>How I work</strong>
            <p>
              Product-first delivery with structured engineering execution: scope, design, implementation, testing,
              rollout, and iterative polish.
            </p>
          </TiltCard>
        </div>
      </section>

      <section className="section compact-section" id="services">
        <div className="section-head">
          <p className="eyebrow">what I do</p>
          <h2>Product engineering with enough systems depth to debug the hard parts.</h2>
        </div>
        <div className="service-grid">
          <TiltCard element="article" className="service-card">
            <span className="service-num">01</span>
            <h3>React products</h3>
            <p>Frontend interfaces, dashboards, portfolio sites, interaction design, and production polish.</p>
          </TiltCard>
          <TiltCard element="article" className="service-card">
            <span className="service-num">02</span>
            <h3>Developer tooling</h3>
            <p>CLI tools, automation, source inspection, build workflows, and faster feedback loops.</p>
          </TiltCard>
          <TiltCard element="article" className="service-card">
            <span className="service-num">03</span>
            <h3>Systems learning</h3>
            <p>Readable demos around runtimes, compilers, operating systems, memory, and execution flow.</p>
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
          <p>
            {skills.detail}
          </p>
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
          <h2>Let us build software that people can use and engineers can understand.</h2>
        </div>
        <a href="mailto:rachit@example.com">rachit@example.com</a>
      </footer>
    </section>
  );
}

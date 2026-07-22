import React from "react";
import ClothParagraph from "./ClothParagraph.jsx";
import { Link } from "react-router-dom";

export default function Footer({ mode }) {
  const isProfessional = mode === "professional";

  return (
    <footer className="footer">
      <div className="footer-inner">
        <div className="footer-top">
          <div className="footer-brand">
            <strong>Rachit Asthana</strong>
            <ClothParagraph>Building production software that ships and scales.</ClothParagraph>
          </div>
          <div className="footer-links">
            <div className="footer-col">
              <span className="footer-col-title">Navigate</span>
              {isProfessional ? (
                <>
                  <a href="#professional-home">Home</a>
                  <a href="#professional-experience">Experience</a>
                  <a href="#professional-projects">Projects</a>
                  <a href="#professional-skills">Skills</a>
                  <a href="#professional-contact">Contact</a>
                </>
              ) : (
                <>
                  <Link to="/">Home</Link>
                  <Link to="/projects">Projects</Link>
                  <Link to="/journey">My Journey</Link>
                  <Link to="/blogs">Blogs</Link>
                  <Link to="/contact">Contact</Link>
                </>
              )}
            </div>
            <div className="footer-col">
              <span className="footer-col-title">Connect</span>
              <a href="mailto:asthanarachit@gmail.com">Email</a>
              <a href="https://github.com/racstan" target="_blank" rel="noreferrer">GitHub</a>
              <a href="https://linkedin.com/in/rachitasthana/" target="_blank" rel="noreferrer">LinkedIn</a>
              <a href="https://instagram.com/rachitgo" target="_blank" rel="noreferrer">Instagram</a>
            </div>
            <div className="footer-col">
              <span className="footer-col-title">Resources</span>
              {isProfessional ? (
                <>
                  <a href="#professional-resume">Resume</a>
                  <a href="#professional-cv">CV</a>
                </>
              ) : (
                <>
                  <Link to="/resume">Resume</Link>
                  <Link to="/cv">CV</Link>
                </>
              )}
            </div>
          </div>
        </div>
        <div className="footer-divider" />
        <div className="footer-meta">
          <span>&copy; {new Date().getFullYear()} Rachit Asthana. Crafted with curiosity.</span>
          <span className="footer-made">Built with React 19 + Vite 7 on Linux</span>
        </div>
      </div>
    </footer>
  );
}

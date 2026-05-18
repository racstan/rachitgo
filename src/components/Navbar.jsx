import React, { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import { BriefcaseBusiness, Moon, Sparkles, Sun, Menu, X } from "lucide-react";
import WaveText from "./WaveText.jsx";

const navItems = [
  { to: "/", label: "Home" },
  { to: "/projects", label: "Projects" },
  { to: "/experience", label: "Experience" },
  { to: "/blogs", label: "Blogs" },
  { to: "/contact", label: "Contact" },
];

const professionalItems = [
  { href: "#professional-projects", label: "Projects" },
  { href: "#professional-experience", label: "Experience" },
  { href: "#professional-skills", label: "Skills" },
  { href: "#professional-contact", label: "Contact" },
];

export default function Navbar({ theme, onToggleTheme, mode, onToggleMode }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav className={`navbar ${scrolled ? "scrolled" : ""} ${mode === "professional" ? "professional-navbar" : ""}`}>
      {/* Brand — static, wave on hover */}
      <div className="brand-static" tabIndex={0}>
        <span className="brand-name-static name-group">
          {"Rachit Asthana".split("").map((char, i) => (
            <span key={i} className="name-char">{char === " " ? "\u00A0" : char}</span>
          ))}
        </span>
        <span className="brand-sub-static">software engineer</span>
      </div>

      {/* Spacer */}
      <div style={{ flex: 1 }} />

      {/* Nav links — RHS */}
      <div id="primary-navigation" className={`nav-links ${mobileOpen ? "open" : ""}`}>
        {mode === "professional" ? professionalItems.map((item) => (
          <a
            key={item.href}
            href={item.href}
            className="nav-link"
            onClick={() => setMobileOpen(false)}
          >
            {item.label}
          </a>
        )) : navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.to === "/"}
            className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}
            onClick={() => setMobileOpen(false)}
          >
            <WaveText text={item.label} />
          </NavLink>
        ))}
      </div>

      <button className="mode-toggle" onClick={onToggleMode} aria-label="Toggle professional mode">
        {mode === "professional" ? <BriefcaseBusiness size={15} /> : <Sparkles size={15} />}
        <span>{mode === "professional" ? "Professional" : "Full"}</span>
      </button>

      {/* Theme toggle */}
      <button className="theme-toggle" onClick={onToggleTheme} aria-label="Toggle theme">
        {theme === "dark" ? <Sun size={16} /> : <Moon size={16} />}
      </button>

      {/* Mobile hamburger */}
      <button
        className="mobile-nav-btn"
        onClick={() => setMobileOpen((v) => !v)}
        aria-label="Toggle menu"
        aria-expanded={mobileOpen}
        aria-controls="primary-navigation"
      >
        {mobileOpen ? <X size={16} /> : <Menu size={16} />}
      </button>
    </nav>
  );
}

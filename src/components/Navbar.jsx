import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import { Sun, Moon, Menu, X } from "lucide-react";

const navItems = [
  { to: "/", label: "Home" },
  { to: "/projects", label: "Projects" },
  { to: "/experience", label: "Experience" },
  { to: "/blogs", label: "Blogs" },
  { to: "/contact", label: "Contact" },
];

export default function Navbar({ theme, onToggleTheme }) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <nav className="navbar">
      {/* Brand — static, rainbow on hover */}
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
      <div className={`nav-links ${mobileOpen ? "open" : ""}`}>
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.to === "/"}
            className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}
            onClick={() => setMobileOpen(false)}
          >
            {item.label}
          </NavLink>
        ))}
      </div>

      {/* Theme toggle */}
      <button className="theme-toggle" onClick={onToggleTheme} aria-label="Toggle theme">
        {theme === "dark" ? <Sun size={16} /> : <Moon size={16} />}
      </button>

      {/* Mobile hamburger */}
      <button
        className="mobile-nav-btn"
        onClick={() => setMobileOpen((v) => !v)}
        aria-label="Toggle menu"
      >
        {mobileOpen ? <X size={16} /> : <Menu size={16} />}
      </button>
    </nav>
  );
}

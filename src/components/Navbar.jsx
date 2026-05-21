import React, { useState, useEffect, useRef } from "react";
import { NavLink, Link, useLocation } from "react-router-dom";
import { BriefcaseBusiness, Moon, Sparkles, Sun, Menu, X } from "lucide-react";
import WaveText from "./WaveText.jsx";

const navItems = [
  { to: "/", label: "Home" },
  { to: "/projects", label: "Projects" },
  { to: "/journey", label: "My Journey" },
  { to: "/blogs", label: "Blogs" },
  { to: "/contact", label: "Contact" },
];

const professionalItems = [
  { href: "#professional-experience", label: "Experience" },
  { href: "#professional-projects", label: "Projects" },
  { href: "#professional-skills", label: "Skills" },
  { href: "#professional-contact", label: "Contact" },
];

export default function Navbar({ theme, onToggleTheme, mode, onToggleMode }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const isHome = location.pathname === "/";

  // Navbar bounce/drag state
  const navRef = useRef(null);
  const [dragging, setDragging] = useState(false);
  const [returning, setReturning] = useState(false);
  const returningRef = useRef(false);
  const returningTimerRef = useRef(null);

  const dragRef = useRef({
    active: false,
    moved: false,
    startX: 0,
    startY: 0,
    lastX: 0,
    lastY: 0,
    lastTime: 0,
    vx: 0,
    vy: 0,
    x: 0,
    y: 0,
    targetX: 0,
    targetY: 0,
    frame: null,
  });

  const nextTiltRef = useRef({ x: 0, y: 0 });
  const tiltFrameRef = useRef(null);

  function onMouseMove(e) {
    if (dragging || returning || dragRef.current.active || returningRef.current || window.innerWidth < 768) return;
    const el = navRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const strength = 3;
    const x = ((e.clientX - rect.left) / rect.width - 0.5) * strength;
    const y = ((e.clientY - rect.top) / rect.height - 0.5) * -strength;
    nextTiltRef.current = { x, y };
    if (tiltFrameRef.current) return;
    tiltFrameRef.current = requestAnimationFrame(() => {
      tiltFrameRef.current = null;
      el.style.transform = `perspective(1000px) rotateX(${nextTiltRef.current.y}deg) rotateY(${nextTiltRef.current.x}deg) scale(1.005)`;
    });
  }

  function onMouseLeave() {
    if (dragging || returning || dragRef.current.active || returningRef.current) return;
    const el = navRef.current;
    if (!el) return;
    el.style.transform = "perspective(1000px) rotateX(0deg) rotateY(0deg) scale(1)";
  }

  function clamp(value, min, max) {
    return Math.min(max, Math.max(min, value));
  }

  function isInteractiveTarget(target) {
    return target.closest?.("a, button, input, textarea, select, summary, [data-no-card-drag], .nav-dropdown, .dropdown-menu, .brand-static");
  }

  function setNavTransform(x, y, rotate = 0, scale = 1) {
    const el = navRef.current;
    if (!el) return;
    el.style.transform = `translate3d(${x}px, ${y}px, 0) rotate(${rotate}deg) scale(${scale})`;
  }

  function animateHome() {
    const state = dragRef.current;
    const spring = 0.035;
    const damping = 0.92;
    state.vx += -state.x * spring;
    state.vy += -state.y * spring;
    state.vx *= damping;
    state.vy *= damping;
    state.x += state.vx;
    state.y += state.vy;

    setNavTransform(state.x, state.y, clamp(state.x / 60, -3, 3), 1);

    if (
      Math.abs(state.x) < 0.5 &&
      Math.abs(state.y) < 0.5 &&
      Math.abs(state.vx) < 0.08 &&
      Math.abs(state.vy) < 0.08
    ) {
      state.x = 0;
      state.y = 0;
      state.vx = 0;
      state.vy = 0;
      setNavTransform(0, 0, 0, 1);
      setDragging(false);
      if (returningTimerRef.current) window.clearTimeout(returningTimerRef.current);
      returningTimerRef.current = window.setTimeout(() => {
        returningRef.current = false;
        setReturning(false);
      }, 500);
      return;
    }

    state.frame = requestAnimationFrame(animateHome);
  }

  function springHome() {
    const state = dragRef.current;
    state.active = false;
    if (state.frame) cancelAnimationFrame(state.frame);
    returningRef.current = true;
    setReturning(true);
    state.frame = requestAnimationFrame(animateHome);
  }

  const resetNavImmediate = () => {
    const state = dragRef.current;
    state.active = false;
    state.moved = false;
    state.x = 0;
    state.y = 0;
    state.vx = 0;
    state.vy = 0;
    state.targetX = 0;
    state.targetY = 0;
    if (state.frame) cancelAnimationFrame(state.frame);
    if (returningTimerRef.current) window.clearTimeout(returningTimerRef.current);
    returningRef.current = false;
    setReturning(false);
    setNavTransform(0, 0, 0, 1);
    setDragging(false);
  };

  useEffect(() => {
    window.addEventListener("scroll", resetNavImmediate, { passive: true });
    window.addEventListener("resize", resetNavImmediate);
    window.addEventListener("blur", resetNavImmediate);
    return () => {
      window.removeEventListener("scroll", resetNavImmediate);
      window.removeEventListener("resize", resetNavImmediate);
      window.removeEventListener("blur", resetNavImmediate);
      if (dragRef.current.frame) cancelAnimationFrame(dragRef.current.frame);
      if (returningTimerRef.current) window.clearTimeout(returningTimerRef.current);
    };
  }, []);

  useEffect(() => {
    let ticking = false;
    const onScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          setScrolled((prev) => {
            const isScrolled = window.scrollY > 20;
            if (prev === isScrolled) return prev;
            return isScrolled;
          });
          ticking = false;
        });
        ticking = true;
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav
      ref={navRef}
      className={`navbar ${scrolled ? "scrolled" : ""} ${mode === "professional" ? "professional-navbar" : ""} ${dragging ? "is-dragging" : ""} ${returning ? "is-returning" : ""}`}
      onPointerDown={(e) => {
        if (e.button !== undefined && e.button !== 0) return;
        if (isInteractiveTarget(e.target)) return;
        
        const state = dragRef.current;
        if (returningTimerRef.current) window.clearTimeout(returningTimerRef.current);
        returningRef.current = false;
        setReturning(false);
        state.active = true;
        state.moved = false;
        state.startX = e.clientX;
        state.startY = e.clientY;
        state.lastX = e.clientX;
        state.lastY = e.clientY;
        state.lastTime = performance.now();
        state.vx = 0;
        state.vy = 0;
        state.x = 0;
        state.y = 0;
        state.targetX = 0;
        state.targetY = 0;
        if (state.frame) cancelAnimationFrame(state.frame);
        setDragging(true);
        navRef.current?.setPointerCapture?.(e.pointerId);
      }}
      onPointerMove={(e) => {
        const state = dragRef.current;
        if (!state.active) {
          if (!dragging && !returningRef.current) {
            onMouseMove(e);
          }
          return;
        }

        const dx = e.clientX - state.startX;
        const dy = e.clientY - state.startY;
        const maxX = Math.max(150, window.innerWidth * 0.15);
        const maxY = Math.max(80, window.innerHeight * 0.1);
        state.targetX = clamp(dx, -maxX, maxX);
        state.targetY = clamp(dy, -maxY, maxY);
        state.x = state.targetX;
        state.y = state.targetY;
        const now = performance.now();
        const dt = Math.max(now - state.lastTime, 16);
        state.vx = ((e.clientX - state.lastX) / dt) * 16;
        state.vy = ((e.clientY - state.lastY) / dt) * 16;
        state.lastX = e.clientX;
        state.lastY = e.clientY;
        state.lastTime = now;
        state.moved = state.moved || Math.hypot(dx, dy) > 6;
        setNavTransform(state.x, state.y, clamp(state.x / 60, -3, 3), 1.005);
      }}
      onMouseMove={(e) => {
        if (dragRef.current.active || returningRef.current) return;
        onMouseMove(e);
      }}
      onPointerUp={(e) => {
        const state = dragRef.current;
        if (state.active) {
          navRef.current?.releasePointerCapture?.(e.pointerId);
          springHome();
        }
      }}
      onPointerCancel={(e) => {
        if (dragRef.current.active) resetNavImmediate();
      }}
      onMouseLeave={(e) => {
        if (!dragRef.current.active && !dragging && !returningRef.current) onMouseLeave(e);
      }}
    >
      {/* Brand — static, wave on hover */}
      <div className="brand-static" tabIndex={0}>
        <span className="brand-name-static name-group">
          {"Rachit Asthana".split("").map((char, i) => (
            <span key={i} className="name-char">{char === " " ? "\u00A0" : char}</span>
          ))}
        </span>
      </div>

      {/* Spacer */}
      <div style={{ flex: 1 }} />

      {/* Nav links — RHS */}
      <div id="primary-navigation" className={`nav-links ${mobileOpen ? "open" : ""}`}>
        {mode === "professional" ? (
          <>
            {professionalItems.map((item) => {
              const target = isHome ? item.href : `/${item.href}`;
              return (
                <a
                  key={item.href}
                  href={target}
                  className="nav-link"
                  onClick={() => setMobileOpen(false)}
                >
                  {item.label}
                </a>
              );
            })}
            <Link
              to="/resume"
              className="nav-link"
              onClick={() => setMobileOpen(false)}
            >
              Resume
            </Link>
            <Link
              to="/cv"
              className="nav-link"
              onClick={() => setMobileOpen(false)}
            >
              CV
            </Link>
          </>
        ) : (
          <>
            {navItems.map((item) => (
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
            <Link
              to="/resume"
              className="nav-link"
              onClick={() => setMobileOpen(false)}
            >
              <WaveText text="Resume" />
            </Link>
            <Link
              to="/cv"
              className="nav-link"
              onClick={() => setMobileOpen(false)}
            >
              <WaveText text="CV" />
            </Link>
          </>
        )}
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

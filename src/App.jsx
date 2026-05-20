import React, { useEffect, useMemo, useState, useRef } from "react";
import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import { ArrowUp, ArrowDown, ChevronsUp, ChevronsDown } from "lucide-react";
import Navbar from "./components/Navbar.jsx";
import BinaryCursor from "./components/BinaryCursor.jsx";
import BinaryRain from "./components/BinaryRain.jsx";
import Footer from "./components/Footer.jsx";
import CommandPalette from "./components/CommandPalette.jsx";
import ResumeAIWidget from "./components/ResumeAIWidget.jsx";
import ErrorBoundary from "./components/ErrorBoundary.jsx";
import HomePage from "./pages/HomePage.jsx";
import ProjectsPage from "./pages/ProjectsPage.jsx";
import ExperiencePage from "./pages/ExperiencePage.jsx";
import ContactPage from "./pages/ContactPage.jsx";
import LabPage from "./pages/LabPage.jsx";
import BlogsPage from "./pages/BlogsPage.jsx";
import StackPage from "./pages/StackPage.jsx";
import ProfessionalPage from "./pages/ProfessionalPage.jsx";
import ProjectDetailPage from "./pages/ProjectDetailPage.jsx";
import ResumeViewPage from "./pages/ResumeViewPage.jsx";
import { languages } from "./data/languages.js";
import { portfolioItems } from "./data/portfolio.js";

function detectAcceleratedGraphics() {
  try {
    const canvas = document.createElement("canvas");
    const gl = canvas.getContext("webgl") || canvas.getContext("experimental-webgl");
    if (!gl) return false;
    const debug = gl.getExtension("WEBGL_debug_renderer_info");
    const renderer = debug ? String(gl.getParameter(debug.UNMASKED_RENDERER_WEBGL)).toLowerCase() : "";
    if (/swiftshader|llvmpipe|software|basic render|mesa offscreen/.test(renderer)) return false;
    return true;
  } catch {
    return false;
  }
}

function getInitialMode() {
  try {
    const requested = new URLSearchParams(window.location.search).get("mode");
    if (requested === "full" || requested === "professional") return requested;
    const saved = window.localStorage.getItem("portfolio-mode");
    if (saved === "full" || saved === "professional") return saved;
  } catch {
    // Storage can be blocked; fall through to capability detection.
  }
  return detectAcceleratedGraphics() ? "full" : "professional";
}

export default function App() {
  const [theme, setTheme] = useState("light");
  const [mode, setMode] = useState(getInitialMode);
  const [activeItemId, setActiveItemId] = useState("profile");
  const [languageIndex, setLanguageIndex] = useState(0);
  const [runToken, setRunToken] = useState(0);
  const [scrollState, setScrollState] = useState({ atTop: true, atBottom: false });
  const [scrollActive, setScrollActive] = useState(false);
  const scrollTimeoutRef = useRef(null);
  const location = useLocation();

  const activeItem = useMemo(
    () => portfolioItems.find((item) => item.id === activeItemId) ?? portfolioItems[0],
    [activeItemId],
  );
  const activeLanguage = languages[languageIndex];

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
  }, [theme]);

  useEffect(() => {
    document.documentElement.dataset.mode = mode;
    try {
      window.localStorage.setItem("portfolio-mode", mode);
    } catch {
      // Non-critical; manual switch still works for the session.
    }
  }, [mode]);

  useEffect(() => {
    let ticking = false;

    function updateScrollState() {
      const scrollMax = document.documentElement.scrollHeight - window.innerHeight;
      setScrollState((prev) => {
        const atTop = window.scrollY <= 12;
        const atBottom = scrollMax <= 0 || window.scrollY >= scrollMax - 12;
        if (prev.atTop === atTop && prev.atBottom === atBottom) {
          return prev;
        }
        return { atTop, atBottom };
      });
      ticking = false;
    }

    function onScroll() {
      setScrollActive(true);
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }
      scrollTimeoutRef.current = setTimeout(() => {
        setScrollActive(false);
      }, 1500);

      if (!ticking) {
        requestAnimationFrame(updateScrollState);
        ticking = true;
      }
    }

    updateScrollState();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", updateScrollState);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", updateScrollState);
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }
    };
  }, [location.pathname]);

  useEffect(() => {
    function onKeyDown(event) {
      if (event.defaultPrevented) return;

      const target = event.target;
      const tagName = target?.tagName;
      const isEditable = target?.isContentEditable || ["INPUT", "TEXTAREA", "SELECT"].includes(tagName);
      if (isEditable) return;
      if (target?.closest?.(".command-panel") || document.querySelector(".command-overlay")) return;
      if (target?.closest?.("button, a, input, textarea, select, summary, [role='button']")) return;

      if (["ArrowDown", "PageDown", " "].includes(event.key)) {
        event.preventDefault();
        scrollToSection("down");
      }

      if (["ArrowUp", "PageUp"].includes(event.key)) {
        event.preventDefault();
        scrollToSection("up");
      }

      if (event.key === "Home") {
        event.preventDefault();
        scrollToSection("top");
      }

      if (event.key === "End") {
        event.preventDefault();
        scrollToSection("bottom");
      }
    }

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [location.pathname]);

  function toggleTheme() {
    setTheme((t) => (t === "dark" ? "light" : "dark"));
  }

  function toggleMode() {
    setMode((value) => (value === "professional" ? "full" : "professional"));
  }

  function nextLanguage(delta) {
    setLanguageIndex((index) => (index + delta + languages.length) % languages.length);
    setRunToken((value) => value + 1);
  }

  function scrollToSection(direction) {
    if (direction === "top" || direction === "bottom") {
      window.scrollTo({
        top: direction === "top" ? 0 : document.documentElement.scrollHeight,
        behavior: "smooth",
      });
      return;
    }

    const sections = Array.from(
      document.querySelectorAll(".hero, .section, .page, .stack-strip"),
    );
    if (!sections.length) {
      window.scrollBy({ top: direction === "down" ? window.innerHeight * 0.85 : -window.innerHeight * 0.85, behavior: "smooth" });
      return;
    }

    const positions = sections.map((el) => el.getBoundingClientRect().top + window.scrollY);
    const current = window.scrollY;

    if (direction === "down") {
      const next = positions.find((pos) => pos > current + 80);
      window.scrollTo({ top: next ?? document.documentElement.scrollHeight, behavior: "smooth" });
    } else {
      const prev = [...positions].reverse().find((pos) => pos < current - 80);
      window.scrollTo({ top: prev ?? 0, behavior: "smooth" });
    }
  }

  return (
    <>
      <a className="skip-link" href="#main-content">Skip to content</a>
      {mode === "full" && <BinaryRain theme={theme} />}
      <Navbar theme={theme} onToggleTheme={toggleTheme} mode={mode} onToggleMode={toggleMode} currentPath={location.pathname} />
      <main className="app-shell" id="main-content">
        <ErrorBoundary key={mode}>
          <Routes>
            <Route
              path="/"
              element={
                mode === "professional" ? (
                  <ProfessionalPage />
                ) : (
                  <HomePage onActivate={setActiveItemId} />
                )
              }
            />
            <Route path="/projects" element={<ProjectsPage onActivate={setActiveItemId} />} />
            <Route path="/projects/:id" element={<ProjectDetailPage />} />
            <Route path="/experience" element={<ExperiencePage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/blogs" element={<BlogsPage />} />
            <Route path="/stack/:slug" element={<StackPage />} />
            <Route
              path="/lab"
              element={
                <LabPage
                  item={activeItem}
                  language={activeLanguage}
                  onActivate={setActiveItemId}
                  onPrevLanguage={() => nextLanguage(-1)}
                  onNextLanguage={() => nextLanguage(1)}
                  onRun={() => setRunToken((value) => value + 1)}
                  runToken={runToken}
                />
              }
            />
            <Route path="/resume" element={<ResumeViewPage />} />
            <Route path="/cv" element={<Navigate to="/resume" replace />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </ErrorBoundary>
      </main>

      <div className={`scroll-controls ${scrollActive ? "active" : ""}`} aria-label="Page scroll controls">
        {scrollState.atTop ? (
          <>
            <button className="scroll-key" onClick={() => scrollToSection("down")} aria-label="Go to next section" title="Next section">
              <ArrowDown size={18} className="scroll-arrow" />
            </button>
            <button className="scroll-key" onClick={() => scrollToSection("bottom")} aria-label="Go to bottom" title="Bottom">
              <ChevronsDown size={18} className="scroll-arrow" />
            </button>
          </>
        ) : scrollState.atBottom ? (
          <>
            <button className="scroll-key" onClick={() => scrollToSection("up")} aria-label="Go to previous section" title="Previous section">
              <ArrowUp size={18} className="scroll-arrow" />
            </button>
            <button className="scroll-key" onClick={() => scrollToSection("top")} aria-label="Go to top" title="Top">
              <ChevronsUp size={18} className="scroll-arrow" />
            </button>
          </>
        ) : (
          <>
            <button className="scroll-key" onClick={() => scrollToSection("up")} aria-label="Scroll up" title="Previous section">
              <ArrowUp size={18} className="scroll-arrow" />
            </button>
            <button className="scroll-key" onClick={() => scrollToSection("down")} aria-label="Scroll down" title="Next section">
              <ArrowDown size={18} className="scroll-arrow" />
            </button>
          </>
        )}
      </div>

      <CommandPalette mode={mode} onToggleMode={toggleMode} />
      {mode === "full" && <ResumeAIWidget />}
      <Footer />
      {mode === "full" && <BinaryCursor theme={theme} />}
    </>
  );
}

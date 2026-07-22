import React, { useEffect, useMemo, useState, useRef } from "react";
import { Navigate, Route, Routes, useLocation, useNavigate } from "react-router-dom";
import { ArrowUp, ArrowDown, ChevronsUp, ChevronsDown } from "lucide-react";
import Navbar from "./components/Navbar.jsx";
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

function getInitialTheme() {
  try {
    const saved = window.localStorage.getItem("portfolio-theme");
    if (saved === "dark" || saved === "light") return saved;
  } catch {}
  if (typeof window !== "undefined" && window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches) {
    return "dark";
  }
  return "light";
}

function KeyboardShortcutsModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  const shortcuts = [
    { key: "M", desc: "Toggle Keyboard Shortcuts Menu" },
    { key: "Q", desc: "Quick Switch (Professional / Full Mode)" },
    { key: "T", desc: "Toggle Theme (Dark / Light)" },
    { key: "A", desc: "Toggle Resume AI Chat (Full Mode)" },
    { key: "↑ / ↓", desc: "Scroll to Previous / Next Section" },
    { key: "H", desc: "Go to Home Page" },
    { key: "P", desc: "Go to Projects Page" },
    { key: "J", desc: "Go to Journey Page" },
    { key: "B", desc: "Go to Blogs Page" },
    { key: "C", desc: "Go to Contact Page" },
    { key: "L", desc: "Go to Dev Lab" },
    { key: "Esc", desc: "Close Modals / Overlays" },
  ];

  return (
    <div
      className="kbd-overlay"
      role="dialog"
      aria-modal="true"
      aria-label="Keyboard shortcuts"
      onClick={onClose}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 99999,
        background: "rgba(0, 0, 0, 0.45)",
        backdropFilter: "blur(8px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "20px"
      }}
    >
      <div
        className="kbd-modal"
        onClick={(e) => e.stopPropagation()}
        style={{
          width: "100%",
          maxWidth: "480px",
          borderRadius: "16px",
          border: "1px solid var(--glass-border)",
          background: "linear-gradient(160deg, var(--panel) 30%, var(--panel-2) 100%)",
          boxShadow: "0 24px 48px rgba(0,0,0,0.4)",
          padding: "24px",
          position: "relative",
          animation: "scaleUp 0.25s cubic-bezier(0.34, 1.56, 0.64, 1)"
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px", borderBottom: "1px solid var(--line)", paddingBottom: "12px" }}>
          <h2 style={{ fontSize: "1.3rem", margin: 0, fontWeight: "700", display: "flex", alignItems: "center", gap: "8px" }}>
            Keyboard Shortcuts
          </h2>
          <button
            onClick={onClose}
            aria-label="Close shortcuts modal"
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              color: "var(--muted)",
              fontSize: "20px"
            }}
          >
            &times;
          </button>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "12px", maxHeight: "60vh", overflowY: "auto", paddingRight: "4px" }}>
          {shortcuts.map((shortcut) => (
            <div key={shortcut.key} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "16px" }}>
              <span style={{ fontSize: "13px", color: "var(--text-dim)" }}>{shortcut.desc}</span>
              <kbd
                style={{
                  background: "var(--panel-2)",
                  border: "1px solid var(--line)",
                  borderRadius: "6px",
                  padding: "4px 8px",
                  fontSize: "11px",
                  fontWeight: "600",
                  fontFamily: "monospace",
                  color: "var(--accent-2)",
                  boxShadow: "0 2px 0 var(--line)"
                }}
              >
                {shortcut.key}
              </kbd>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function App() {
  const [theme, setTheme] = useState(getInitialTheme);
  const [themeSwitching, setThemeSwitching] = useState(false);
  const [mode, setMode] = useState(getInitialMode);
  const [activeItemId, setActiveItemId] = useState("profile");
  const [languageIndex, setLanguageIndex] = useState(0);
  const [runToken, setRunToken] = useState(0);
  const [scrollState, setScrollState] = useState({ atTop: true, atBottom: false });
  const [scrollActive, setScrollActive] = useState(false);
  const scrollTimeoutRef = useRef(null);
  const location = useLocation();
  const navigate = useNavigate();

  const [activeVibrateButton, setActiveVibrateButton] = useState(null);
  const [shortcutModalOpen, setShortcutModalOpen] = useState(false);

  const scrollIntervalRef = useRef(null);
  const scrollTimeoutRef2 = useRef(null);
  const isLongPressActiveRef = useRef(false);
  const keyboardScrollTimeoutRef = useRef(null);
  const isKeyboardScrollingRef = useRef(false);

  const activeItem = useMemo(
    () => portfolioItems.find((item) => item.id === activeItemId) ?? portfolioItems[0],
    [activeItemId],
  );
  const activeLanguage = languages[languageIndex];

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    try {
      window.localStorage.setItem("portfolio-theme", theme);
    } catch {}
  }, [theme]);

  useEffect(() => {
    if (themeSwitching) {
      document.documentElement.dataset.themeSwitching = "true";
      const timer = setTimeout(() => {
        setThemeSwitching(false);
        delete document.documentElement.dataset.themeSwitching;
      }, 600);
      return () => clearTimeout(timer);
    }
  }, [themeSwitching]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  useEffect(() => {
    document.documentElement.dataset.mode = mode;
    try {
      window.localStorage.setItem("portfolio-mode", mode);
    } catch {
      // Non-critical
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

      const key = event.key.toLowerCase();

      // Keyboard arrow keys scroll holds:
      if (key === "arrowdown") {
        event.preventDefault();
        if (event.repeat) return;
        isKeyboardScrollingRef.current = false;
        keyboardScrollTimeoutRef.current = setTimeout(() => {
          isKeyboardScrollingRef.current = true;
          startContinuousScroll("down");
        }, 220);
        return;
      }

      if (key === "arrowup") {
        event.preventDefault();
        if (event.repeat) return;
        isKeyboardScrollingRef.current = false;
        keyboardScrollTimeoutRef.current = setTimeout(() => {
          isKeyboardScrollingRef.current = true;
          startContinuousScroll("up");
        }, 220);
        return;
      }

      // M: toggle mappings popup
      if (key === "m") {
        event.preventDefault();
        setShortcutModalOpen((prev) => !prev);
        return;
      }

      // Escape: close modal
      if (key === "escape") {
        setShortcutModalOpen(false);
        return;
      }

      // Q: toggle mode
      if (key === "q") {
        event.preventDefault();
        toggleMode();
        return;
      }

      // T: toggle theme
      if (key === "t") {
        event.preventDefault();
        toggleTheme();
        return;
      }

      // A: toggle AI widget in full mode
      if (key === "a") {
        event.preventDefault();
        if (mode === "full") {
          const fab = document.querySelector(".resume-ai-fab");
          if (fab) {
            fab.click();
          }
        }
        return;
      }

      // Navigation shortcuts
      if (key === "h") {
        event.preventDefault();
        navigate("/");
        return;
      }
      if (key === "p") {
        event.preventDefault();
        navigate("/projects");
        return;
      }
      if (key === "j") {
        event.preventDefault();
        navigate("/journey");
        return;
      }
      if (key === "b") {
        event.preventDefault();
        navigate("/blogs");
        return;
      }
      if (key === "c") {
        event.preventDefault();
        navigate("/contact");
        return;
      }
      if (key === "l") {
        event.preventDefault();
        navigate("/lab");
        return;
      }

      if (["pagedown", " "].includes(key)) {
        event.preventDefault();
        scrollToSection("down");
      }

      if (["pageup"].includes(key)) {
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

    function onKeyUp(event) {
      const target = event.target;
      const tagName = target?.tagName;
      const isEditable = target?.isContentEditable || ["INPUT", "TEXTAREA", "SELECT"].includes(tagName);
      if (isEditable) return;

      const key = event.key.toLowerCase();
      if (key === "arrowdown") {
        event.preventDefault();
        if (keyboardScrollTimeoutRef.current) {
          clearTimeout(keyboardScrollTimeoutRef.current);
          keyboardScrollTimeoutRef.current = null;
        }
        const wasScrolling = isKeyboardScrollingRef.current;
        stopContinuousScroll();
        if (!wasScrolling) {
          scrollToSection("down");
        }
      }

      if (key === "arrowup") {
        event.preventDefault();
        if (keyboardScrollTimeoutRef.current) {
          clearTimeout(keyboardScrollTimeoutRef.current);
          keyboardScrollTimeoutRef.current = null;
        }
        const wasScrolling = isKeyboardScrollingRef.current;
        stopContinuousScroll();
        if (!wasScrolling) {
          scrollToSection("up");
        }
      }
    }

    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("keyup", onKeyUp);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("keyup", onKeyUp);
      if (keyboardScrollTimeoutRef.current) {
        clearTimeout(keyboardScrollTimeoutRef.current);
      }
    };
  }, [location.pathname, mode, shortcutModalOpen]);

  function toggleTheme() {
    setThemeSwitching(true);
    setTheme((t) => (t === "dark" ? "light" : "dark"));
  }

  function toggleMode() {
    setMode((value) => (value === "professional" ? "full" : "professional"));
  }

  function nextLanguage(delta) {
    setLanguageIndex((index) => (index + delta + languages.length) % languages.length);
    setRunToken((value) => value + 1);
  }

  const startContinuousScroll = (direction) => {
    isLongPressActiveRef.current = true;
    setActiveVibrateButton(direction);

    scrollToSection(direction);

    scrollIntervalRef.current = setInterval(() => {
      scrollToSection(direction);
    }, 650);
  };

  const stopContinuousScroll = () => {
    if (scrollIntervalRef.current) {
      clearInterval(scrollIntervalRef.current);
      scrollIntervalRef.current = null;
    }
    if (scrollTimeoutRef2.current) {
      clearTimeout(scrollTimeoutRef2.current);
      scrollTimeoutRef2.current = null;
    }
    setActiveVibrateButton(null);
  };

  const handleScrollButtonPress = (direction) => {
    stopContinuousScroll();
    isLongPressActiveRef.current = false;
    scrollTimeoutRef2.current = setTimeout(() => {
      startContinuousScroll(direction);
    }, 280);
  };

  const handleScrollButtonRelease = (direction) => {
    const wasLongPress = isLongPressActiveRef.current;
    stopContinuousScroll();
    if (!wasLongPress) {
      scrollToSection(direction);
    }
  };

  function scrollToSection(direction) {
    if (direction === "top" || direction === "bottom") {
      window.scrollTo({
        top: direction === "top" ? 0 : document.documentElement.scrollHeight,
        behavior: "smooth",
      });
      return;
    }

    const sections = Array.from(
      document.querySelectorAll(".hero, .section, .page, .stack-strip, .professional-section"),
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

  const renderScrollKey = (direction, icon, label) => {
    const isVibrating = activeVibrateButton === direction;
    return (
      <button
        className={`scroll-key ${isVibrating ? "vibrating" : ""}`}
        onPointerDown={(e) => {
          e.preventDefault();
          handleScrollButtonPress(direction);
        }}
        onPointerUp={(e) => {
          e.preventDefault();
          handleScrollButtonRelease(direction);
        }}
        onPointerCancel={(e) => {
          e.preventDefault();
          stopContinuousScroll();
        }}
        onMouseLeave={stopContinuousScroll}
        aria-label={label}
        title={label}
      >
        {icon}
      </button>
    );
  };

  return (
    <>
      <a className="skip-link" href="#main-content">Skip to content</a>
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
            <Route path="/journey" element={<ExperiencePage />} />
            <Route path="/contact" element={<ContactPage theme={theme} />} />
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
            <Route
              path="/resume"
              element={
                mode === "professional" ? (
                  <ProfessionalPage defaultHash="#professional-resume" />
                ) : (
                  <ResumeViewPage />
                )
              }
            />
            <Route
              path="/cv"
              element={
                mode === "professional" ? (
                  <ProfessionalPage defaultHash="#professional-cv" />
                ) : (
                  <ResumeViewPage />
                )
              }
            />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </ErrorBoundary>
      </main>

      <div className={`scroll-controls ${scrollActive ? "active" : ""}`} aria-label="Page scroll controls">
        {scrollState.atTop ? (
          <>
            {renderScrollKey("down", <ArrowDown size={18} className="scroll-arrow" />, "Go to next section")}
            {renderScrollKey("bottom", <ChevronsDown size={18} className="scroll-arrow" />, "Go to bottom")}
          </>
        ) : scrollState.atBottom ? (
          <>
            {renderScrollKey("up", <ArrowUp size={18} className="scroll-arrow" />, "Go to previous section")}
            {renderScrollKey("top", <ChevronsUp size={18} className="scroll-arrow" />, "Go to top")}
          </>
        ) : (
          <>
            {renderScrollKey("up", <ArrowUp size={18} className="scroll-arrow" />, "Scroll up")}
            {renderScrollKey("down", <ArrowDown size={18} className="scroll-arrow" />, "Scroll down")}
          </>
        )}
      </div>

      <CommandPalette mode={mode} onToggleMode={toggleMode} />
      {mode === "full" && <ResumeAIWidget />}
      <Footer mode={mode} />

      <KeyboardShortcutsModal isOpen={shortcutModalOpen} onClose={() => setShortcutModalOpen(false)} />
    </>
  );
}

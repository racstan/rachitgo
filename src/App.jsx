import React, { useEffect, useMemo, useState } from "react";
import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import { ArrowUp, ArrowDown } from "lucide-react";
import Navbar from "./components/Navbar.jsx";
import BinaryCursor from "./components/BinaryCursor.jsx";
import BinaryRain from "./components/BinaryRain.jsx";
import Footer from "./components/Footer.jsx";
import HomePage from "./pages/HomePage.jsx";
import ProjectsPage from "./pages/ProjectsPage.jsx";
import ExperiencePage from "./pages/ExperiencePage.jsx";
import ContactPage from "./pages/ContactPage.jsx";
import LabPage from "./pages/LabPage.jsx";
import BlogsPage from "./pages/BlogsPage.jsx";
import StackPage from "./pages/StackPage.jsx";
import { languages } from "./data/languages.js";
import { portfolioItems } from "./data/portfolio.js";

export default function App() {
  const [theme, setTheme] = useState("light");
  const [activeItemId, setActiveItemId] = useState("profile");
  const [languageIndex, setLanguageIndex] = useState(0);
  const [runToken, setRunToken] = useState(0);
  const location = useLocation();

  const activeItem = useMemo(
    () => portfolioItems.find((item) => item.id === activeItemId) ?? portfolioItems[0],
    [activeItemId],
  );
  const activeLanguage = languages[languageIndex];

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
  }, [theme]);

  function toggleTheme() {
    setTheme((t) => (t === "dark" ? "light" : "dark"));
  }

  function nextLanguage(delta) {
    setLanguageIndex((index) => (index + delta + languages.length) % languages.length);
    setRunToken((value) => value + 1);
  }

  function scrollToSection(direction) {
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
      <BinaryRain theme={theme} />
      <Navbar theme={theme} onToggleTheme={toggleTheme} currentPath={location.pathname} />
      <main className="app-shell">
        <Routes>
          <Route path="/" element={<HomePage onActivate={setActiveItemId} />} />
          <Route path="/projects" element={<ProjectsPage onActivate={setActiveItemId} />} />
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
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>

      <div className="scroll-controls" aria-label="Page scroll controls">
        <button className="scroll-key" onClick={() => scrollToSection("up")} aria-label="Scroll up">
          <ArrowUp size={18} className="scroll-arrow" />
        </button>
        <button className="scroll-key" onClick={() => scrollToSection("down")} aria-label="Scroll down">
          <ArrowDown size={18} className="scroll-arrow" />
        </button>
      </div>

      <Footer />
      <BinaryCursor />
    </>
  );
}

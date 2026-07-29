import React, { useEffect, useMemo, useRef, useState } from "react";
import TechScroller from "../components/TechScroller.jsx";
import Timeline from "../components/Timeline.jsx";
import HoverTypingText from "../components/HoverTypingText.jsx";
import WaveText from "../components/WaveText.jsx";
import TiltCard from "../components/TiltCard.jsx";
import GitHubContributions from "../components/GitHubContributions.jsx";
import NewsletterSignup from "../components/NewsletterSignup.jsx";
import Highlights from "../components/Highlights.jsx";
import { fetchContributions } from "../lib/github.js";
import { profile, experienceTimeline } from "../data/profile.js";

const heroModes = [
  { value: "Rachit Asthana", label: "English", color: "var(--text)" },
  { value: "रचित अस्थाना", label: "Hindi", color: "#f9a825" },
  { value: "ラチット・アスタナ", label: "Japanese", color: "#ff4081" },
  { value: "Рачит Астхана", label: "Russian", color: "#40c4ff" },
  { value: "راتشيت أستانا", label: "Arabic", color: "#69f0ae" },
  { value: "रचितः अस्थाना", label: "Sanskrit", color: "#e040fb" },
];

function useHeroModes(modes) {
  const [modeIndex, setModeIndex] = useState(0);
  const [displayText, setDisplayText] = useState("");

  useEffect(() => {
    const mode = modes[modeIndex];
    let charIndex = 0;
    let timer = null;
    let phase = "typing";

    setDisplayText("");

    function tick() {
      if (phase === "typing") {
        charIndex += 1;
        setDisplayText(mode.value.slice(0, charIndex));
        if (charIndex >= mode.value.length) {
          phase = "holding";
          timer = window.setTimeout(tick, 2200);
          return;
        }
        timer = window.setTimeout(tick, 90);
        return;
      }

      if (phase === "holding") {
        phase = "deleting";
        timer = window.setTimeout(tick, 70);
        return;
      }

      charIndex -= 1;
      setDisplayText(mode.value.slice(0, Math.max(charIndex, 0)));
      if (charIndex > 0) {
        timer = window.setTimeout(tick, 50);
        return;
      }

      phase = "typing";
      setModeIndex((prev) => (prev + 1) % modes.length);
    }

    timer = window.setTimeout(tick, 150);

    return () => {
      if (timer) window.clearTimeout(timer);
    };
  }, [modeIndex, modes]);

  return {
    displayText,
    mode: modes[modeIndex],
  };
}

export default function HomePage({ onActivate }) {
  const { displayText, mode } = useHeroModes(heroModes);
  const containerRef = useRef(null);
  const textRef = useRef(null);
  const heroRef = useRef(null);
  const spotlightActiveRef = useRef(false);
  const orbTargetRef = useRef({ x: 0, y: 0 });
  const orbCurrentRef = useRef({ x: 0, y: 0 });
  const orbRafRef = useRef(null);
  const [fontSize, setFontSize] = useState(76);
  const [orbActive, setOrbActive] = useState(false);
  const [spotlightActive, setSpotlightActive] = useState(false);
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
    "Ctrl+Z Enthusiast",
    "npm install Hope",
    "404 Sleep Not Found",
    "Laravel Artisan",
    "React Hook Addict",
    "TypeScript Evangelist",
    "Docker Compose Poet",
    "Postman Collection Curator",
    "Database Schema Designer",
    "Cloud Architect in Training",
    "AI Integration Explorer",
    "Open Source Contributor",
    "Weekend Hackathon Warrior",
    "Documentation Reader (Rare Breed)",
    "Pixel Perfectionist",
    "Keyboard Shortcut Maximizer",
    "sudo rm -rf Fears Collector",
  ];
  const getLouderWordClassName = (word) => {
    const cleaned = word.toLowerCase().replace(/[^a-z]/g, "");
    return cleaned === "louder" ? "word-magnify" : "";
  };
  const [roleIndex, setRoleIndex] = useState(0);
  const [calendar, setCalendar] = useState(null);
  const [repos, setRepos] = useState([]);
  const [loadingCalendar, setLoadingCalendar] = useState(true);
  const [calendarError, setCalendarError] = useState("");

  useEffect(() => {
    onActivate("profile");
  }, [onActivate]);

  useEffect(() => {
    const controller = new AbortController();
    setLoadingCalendar(true);
    setCalendarError("");

    fetchContributions({ signal: controller.signal, username: profile.githubHandle })
      .then(({ calendar: nextCalendar, repos: nextRepos }) => {
        setCalendar(nextCalendar);
        setRepos(nextRepos);
      })
      .catch((error) => {
        if (error?.name === "AbortError") return;
        setCalendar(null);
        setRepos([]);
        setCalendarError(error?.message || "Unable to load GitHub contributions.");
      })
      .finally(() => {
        setLoadingCalendar(false);
      });

    return () => controller.abort();
  }, []);

  const targetText = useMemo(() => mode.value, [mode.value]);
  const roleText = roleOptions[roleIndex % roleOptions.length];

  useEffect(() => {
    function updateScale() {
      const container = containerRef.current;
      const textEl = textRef.current;
      if (!container || !textEl) return;
      const containerWidth = container.clientWidth;
      if (!containerWidth) return;

      const length = targetText.length;
      const estimatedSize = Math.floor(containerWidth / Math.max(length * 0.58, 1));
      const naturalSize = length > 44 ? 34 : length > 28 ? 48 : 76;
      setFontSize(Math.max(14, Math.min(naturalSize, estimatedSize, containerWidth < 560 ? 42 : 76)));
    }

    updateScale();
    window.addEventListener("resize", updateScale);
    return () => window.removeEventListener("resize", updateScale);
  }, [targetText]);

  useEffect(() => {
    function resetOrbToCenter() {
      const hero = heroRef.current;
      if (!hero || spotlightActiveRef.current) return;
      const rect = hero.getBoundingClientRect();
      const center = { x: rect.width / 2, y: rect.height / 2 };
      orbTargetRef.current = center;
      orbCurrentRef.current = { ...center };
    }

    function animateOrb() {
      const hero = heroRef.current;
      if (!hero) {
        orbRafRef.current = requestAnimationFrame(animateOrb);
        return;
      }

      const target = orbTargetRef.current;
      const current = orbCurrentRef.current;
      const ease = 0.14;
      current.x += (target.x - current.x) * ease;
      current.y += (target.y - current.y) * ease;

      hero.style.setProperty("--spot-x", `${current.x}px`);
      hero.style.setProperty("--spot-y", `${current.y}px`);

      const textEl = textRef.current;
      if (textEl) {
        const heroRect = hero.getBoundingClientRect();
        const textRect = textEl.getBoundingClientRect();
        const absoluteX = heroRect.left + current.x;
        const absoluteY = heroRect.top + current.y;
        textEl.style.setProperty("--reveal-x", `${absoluteX - textRect.left}px`);
        textEl.style.setProperty("--reveal-y", `${absoluteY - textRect.top}px`);
      }

      orbRafRef.current = requestAnimationFrame(animateOrb);
    }

    resetOrbToCenter();
    orbRafRef.current = requestAnimationFrame(animateOrb);
    window.addEventListener("resize", resetOrbToCenter);

    return () => {
      window.removeEventListener("resize", resetOrbToCenter);
      if (orbRafRef.current) cancelAnimationFrame(orbRafRef.current);
    };
  }, []);

  function moveHeroSpotlight(event) {
    const hero = heroRef.current;
    const textEl = textRef.current;
    if (!hero) return;
    if (!orbActive) setOrbActive(true);
    const heroRect = hero.getBoundingClientRect();
    const pointerX = event.clientX - heroRect.left;
    const pointerY = event.clientY - heroRect.top;
    const centerX = heroRect.width / 2;
    const centerY = heroRect.height / 2;

    const textRect = textEl?.getBoundingClientRect();
    const nearText = textRect
      ? event.clientX >= textRect.left - 42 &&
        event.clientX <= textRect.right + 42 &&
        event.clientY >= textRect.top - 42 &&
        event.clientY <= textRect.bottom + 42
      : false;

    const magnetFactor = nearText ? 0.9 : 0.7;
    orbTargetRef.current = {
      x: centerX + (pointerX - centerX) * magnetFactor,
      y: centerY + (pointerY - centerY) * magnetFactor,
    };

    if (nearText && !spotlightActiveRef.current) {
      spotlightActiveRef.current = true;
      setSpotlightActive(true);
    } else if (!nearText && spotlightActiveRef.current) {
      spotlightActiveRef.current = false;
      setSpotlightActive(false);
    }
  }

  return (
    <section className="portfolio">
      <section
        className={`hero hero-spotlight-stage ${orbActive ? "orb-active" : ""} ${spotlightActive ? "spotlight-active" : ""}`}
        ref={heroRef}
        onPointerMove={moveHeroSpotlight}
        onPointerEnter={(event) => {
          setOrbActive(true);
          moveHeroSpotlight(event);
        }}
        onPointerLeave={() => {
          setOrbActive(false);
          spotlightActiveRef.current = false;
          setSpotlightActive(false);
          const heroRect = heroRef.current?.getBoundingClientRect();
          if (heroRect) {
            const center = { x: heroRect.width / 2, y: heroRect.height / 2 };
            orbTargetRef.current = center;
          }
        }}
      >
        <svg className="hero-goo-filter" aria-hidden="true" focusable="false">
          <filter id="hero-goo">
            <feGaussianBlur in="SourceGraphic" stdDeviation="9" result="blur" />
            <feColorMatrix
              in="blur"
              mode="matrix"
              values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 18 -7"
            />
          </filter>
        </svg>
        <div className="hero-follow-orb" aria-hidden="true">
          <i />
          <i />
          <i />
        </div>
        <div className="hero-typing-container" ref={containerRef}>
          <div className="hero-typing-stack" ref={textRef}>
            <h1 className="hero-typing hero-typing-base" style={{ fontSize: `${fontSize}px` }}>
              <span className="hero-typing-text" data-full-text={targetText}>
                {displayText}
              </span>
              <span className="hero-cursor" />
            </h1>
            <h1 className="hero-typing hero-typing-reveal" aria-hidden="true" style={{ fontSize: `${fontSize}px` }}>
              <span className="hero-typing-text">{displayText}</span>
              <span className="hero-cursor" />
            </h1>
          </div>
        </div>
        <button
          type="button"
          className="hero-role-line"
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
          {roleText}
        </button>
      </section>

      <TechScroller />

      <section className="section compact-section">
        <div className="section-head">
          <p className="eyebrow">what I build</p>
          <HoverTypingText
            element="h2"
            variants={[
              "Production software that ships and scales.",
              "Systems built for real users, not demos.",
              "Engineering with craft, not just code.",
              "From architecture to deployment — end to end.",
              "Software people actually depend on.",
            ]}
          />
        </div>
        <div className="service-grid">
          {[
            { num: "01", title: "Full-stack products", desc: "Laravel + React applications with clean architecture, real-time features, and production-grade DevOps." },
            { num: "02", title: "AI-powered workflows", desc: "OpenAI integrations, ML pipelines, and intelligent document processing baked into real business tools." },
            { num: "03", title: "High-performance systems", desc: "AWS deployments, Docker orchestration, AI data processing pipelines, and high-performance background job architectures." },
          ].map((s) => (
            <TiltCard key={s.num} element="article" className="service-card">
              <span className="service-num"><WaveText text={s.num} /></span>
              <h3><WaveText text={s.title} /></h3>
              <p><WaveText text={s.desc} /></p>
            </TiltCard>
          ))}
        </div>
      </section>

      <Highlights />

      <section className="section compact-section" style={{ padding: "0 4vw" }}>
        <div className="section-head">
          <p className="eyebrow">experience</p>
          <HoverTypingText
            element="h2"
            variants={[
              "From JPMC's data floors to building my own products.",
              "Real internships. Real engineering. Real deadlines.",
              "JPMorgan Chase, MedTourEasy, and VIT Chennai",
              "Where I learned to ship under pressure.",
              "Industry experience meets independent building.",
            ]}
          />
        </div>
        <Timeline items={experienceTimeline} variant="standard" />
      </section>

      <section className="section compact-section">
        <div className="section-head">
          <p className="eyebrow"><WaveText text="github profile snapshot" /></p>
          <HoverTypingText
            element="h2"
            getWordClassName={getLouderWordClassName}
            variants={[
              "The code speaks louder.",
              "Green squares don't lie.",
              "Commit history is the real resume.",
              "Shipping, not just planning.",
              "Every square is a build day.",
            ]}
          />
        </div>

        <div className="github-snapshot">
          <div className="github-strip">
            {[
              { label: "Open Source", value: "Real projects, public repos" },
              { label: "Consistency", value: "Building every week, not every quarter" },
              { label: "Depth", value: "Full-stack systems, not todo apps" },
              { label: "Focus Areas", value: "Laravel, React, ML, and FinTech AI" },
            ].map((stat) => (
              <TiltCard key={stat.label} element="article" className="github-card">
                <strong><WaveText text={stat.label} /></strong>
                <p><WaveText text={stat.value} /></p>
              </TiltCard>
            ))}
          </div>
          <GitHubContributions
            calendar={calendar}
            loading={loadingCalendar}
            error={calendarError}
            username={profile.githubHandle}
            repos={repos}
          />
        </div>
      </section>

      <NewsletterSignup />
    </section>
  );
}

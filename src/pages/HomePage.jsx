import React, { useEffect, useMemo, useRef, useState } from "react";
import TechScroller from "../components/TechScroller.jsx";
import Timeline from "../components/Timeline.jsx";
import HoverTypingText from "../components/HoverTypingText.jsx";
import WaveText from "../components/WaveText.jsx";
import TiltCard from "../components/TiltCard.jsx";
import GitHubContributions from "../components/GitHubContributions.jsx";
import NewsletterSignup from "../components/NewsletterSignup.jsx";
import { fetchContributions } from "../lib/github.js";
import { profile } from "../data/profile.js";

const heroModes = [
  { value: "Rachit Asthana", label: "english", color: "var(--text)" },
  { value: "52 61 63 68 69 74 20 41 73 74 68 61 6E 61", label: "hexadecimal", color: "var(--accent-2)" },
  { value: "01010010 01100001 01100011 01101000 01101001", label: "binary", color: "var(--accent)" },
  { value: "रचित अस्थाना", label: "hindi", color: "#f9a825" },
  { value: 'print("Rachit Asthana")', label: "python", color: "#4fc3f7" },
  { value: 'println!("Rachit Asthana");', label: "rust", color: "#ff7043" },
  { value: "UmFjaGl0IEFzdGhhbmE=", label: "base64", color: "#69f0ae" },
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
          timer = window.setTimeout(tick, 2300);
          return;
        }
        timer = window.setTimeout(tick, 95);
        return;
      }

      if (phase === "holding") {
        phase = "deleting";
        timer = window.setTimeout(tick, 80);
        return;
      }

      charIndex -= 1;
      setDisplayText(mode.value.slice(0, Math.max(charIndex, 0)));
      if (charIndex > 0) {
        timer = window.setTimeout(tick, 58);
        return;
      }

      setModeIndex((idx) => (idx + 1) % modes.length);
    }

    timer = window.setTimeout(tick, 220);

    return () => {
      if (timer) window.clearTimeout(timer);
    };
  }, [modeIndex, modes]);

  return { displayText, mode: modes[modeIndex] };
}

export default function HomePage({ onActivate }) {
  const { displayText, mode } = useHeroModes(heroModes);
  const containerRef = useRef(null);
  const textRef = useRef(null);
  const [fontSize, setFontSize] = useState(76);
  const roleOptions = [
    "Full Stack Developer",
    "Software Developer",
    "Freelancer",
    "Builder",
    "Citizen of Earth",
    "Clash of Clans player (Yes, I still do upgrades)",
    "Age of Empires lover (Wood please!)",
    "Coffee-to-Code compiler",
    "Bug Creator & Solver",
    "Vim Escaper (Stuck since 2021)",
    "Systems Tinkerer",
    "Binary Art Admirer"
  ];
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

  return (
    <section className="portfolio">
      <section className="hero">
        <div className="hero-typing-container" ref={containerRef}>
          <h1 className="hero-typing" style={{ color: mode.color, fontSize: `${fontSize}px` }}>
            <span ref={textRef} className="hero-typing-text" data-full-text={targetText}>
              {displayText}
            </span>
            <span className="hero-cursor" style={{ background: mode.color }} />
          </h1>
        </div>
        <button
          type="button"
          className="hero-role-line"
          onPointerEnter={() => setRoleIndex((index) => (index + 1) % roleOptions.length)}
          onFocus={() => setRoleIndex((index) => (index + 1) % roleOptions.length)}
          title={roleOptions.join(" / ")}
        >
          {roleText}
        </button>
      </section>

      <section className="section compact-section">
        <div className="section-head">
          <p className="eyebrow"><WaveText text="github profile snapshot" /></p>
          <HoverTypingText
            element="h2"
            variants={[
              "Proof over claims",
              "Signals over slogans",
              "Evidence beats hype",
              "Work, not talk",
              "Show the receipts",
            ]}
          />
        </div>

        <div className="github-snapshot">
          <div className="github-strip">
            {[
              { label: "Repositories", value: "Open-source and personal work" },
              { label: "Signals", value: "Feedback, usage, and reviews" },
              { label: "Community", value: "Consistent learning and sharing" },
              { label: "Pinned Focus", value: "React, systems, tooling" },
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

      <section className="section compact-section">
        <div className="section-head">
          <p className="eyebrow">what I build</p>
          <HoverTypingText
            element="h2"
            variants={[
              "Built for those who care about craft.",
              "Made for teams who care about quality.",
              "Designed for clarity and polish.",
              "Engineered for real-world use.",
              "Crafted for lasting impact.",
            ]}
          />
        </div>
        <div className="service-grid">
          {[
            { num: "01", title: "Clear positioning", desc: "Who I am, what I build, and what roles I take in one quick pass." },
            { num: "02", title: "Projects with impact", desc: "Summaries focused on business context, not just screenshots." },
            { num: "03", title: "Fast contact path", desc: "Direct ways to reach me and discuss work quickly." },
          ].map((s) => (
            <TiltCard key={s.num} element="article" className="service-card">
              <span className="service-num"><WaveText text={s.num} /></span>
              <h3><WaveText text={s.title} /></h3>
              <p><WaveText text={s.desc} /></p>
            </TiltCard>
          ))}
        </div>
      </section>

      <section className="section compact-section" style={{ padding: "0 4vw" }}>
        <div className="section-head">
          <p className="eyebrow">my journey</p>
          <HoverTypingText
            element="h2"
            variants={[
              "My path in technology",
              "The road to shipping",
              "How the story unfolded",
              "Timeline of growth",
              "Building through the years",
            ]}
          />
        </div>
        <Timeline />
      </section>

      <TechScroller />
      <NewsletterSignup />
    </section>
  );
}

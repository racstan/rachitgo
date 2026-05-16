import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import TechScroller from "../components/TechScroller.jsx";
import Timeline from "../components/Timeline.jsx";

// Each "mode" has a display string and a label shown below as subtitle
const heroModes = [
  { value: "Rachit Asthana",                               label: "english",       color: "var(--text)" },
  { value: "52 61 63 68 69 74 20 41 73 74 68 61 6E 61",   label: "hexadecimal",   color: "var(--accent-2)" },
  { value: "01010010 01100001 01100011 01101000 01101001", label: "binary",        color: "var(--accent)" },
  { value: "रचित अस्थाना",                                 label: "hindi",         color: "#f9a825" },
  { value: "రచిత్ అస్థానా",                               label: "telugu",        color: "#e040fb" },
  { value: 'print("Rachit Asthana")',                      label: "python",        color: "#4fc3f7" },
  { value: 'println!("Rachit Asthana");',                  label: "rust",          color: "#ff7043" },
  { value: "UmFjaGl0IEFzdGhhbmE=",                        label: "base64",        color: "#69f0ae" },
];

function useTypingCycle(modes) {
  const [modeIndex, setModeIndex] = useState(0);
  const [displayText, setDisplayText] = useState("");
  const [phase, setPhase] = useState("typing"); // typing | pausing | deleting | switching
  const charRef = useRef(0);
  const timerRef = useRef(null);

  useEffect(() => {
    const target = modes[modeIndex].value;

    function clear() { if (timerRef.current) clearTimeout(timerRef.current); }

    function type() {
      charRef.current += 1;
      setDisplayText(target.slice(0, charRef.current));
      if (charRef.current < target.length) {
        timerRef.current = setTimeout(type, 55 + Math.random() * 35);
      } else {
        setPhase("pausing");
        timerRef.current = setTimeout(startDelete, 1800);
      }
    }

    function startDelete() {
      setPhase("deleting");
      del();
    }

    function del() {
      charRef.current -= 1;
      setDisplayText(target.slice(0, charRef.current));
      if (charRef.current > 0) {
        timerRef.current = setTimeout(del, 28 + Math.random() * 18);
      } else {
        setPhase("switching");
        timerRef.current = setTimeout(() => {
          setModeIndex((i) => (i + 1) % modes.length);
        }, 300);
      }
    }

    setPhase("typing");
    charRef.current = 0;
    setDisplayText("");
    timerRef.current = setTimeout(type, 200);

    return clear;
  }, [modeIndex]); // eslint-disable-line react-hooks/exhaustive-deps

  return { displayText, phase, mode: modes[modeIndex] };
}

export default function HomePage({ onActivate }) {
  const { displayText, phase, mode } = useTypingCycle(heroModes);

  useEffect(() => { onActivate("profile"); }, [onActivate]);

  return (
    <section className="portfolio">
      <section className="hero">
        <p className="eyebrow">software developer / freelancer / builder</p>

        {/* Big h1 types / deletes / cycles through languages */}
        <h1 className="hero-typing" style={{ color: mode.color }}>
          {displayText}
          <span className="hero-cursor" style={{ background: mode.color }} />
        </h1>

        {/* Subtitle shows which language/encoding */}
        <p className="hero-mode-label">
          <span className="hero-mode-tag">{mode.label}</span>
          {phase === "typing" && " ← typing..."}
          {phase === "deleting" && " ← deleting..."}
          {phase === "pausing" && " ← compiled ✓"}
          {phase === "switching" && " ← switching..."}
        </p>

        <p className="hero-desc">
          I build production web software, developer tools, and systems experiments
          with clean UX, maintainable architecture, and measurable outcomes.
        </p>

        <div className="hero-links">
          <Link to="/contact" className="btn btn-accent">Get In Touch →</Link>
        </div>
      </section>

      <section className="section compact-section">
        <div className="section-head">
          <p className="eyebrow">github profile snapshot</p>
          <h2>Proof over claims</h2>
        </div>
        <div className="github-strip">
          {[
            { label: "Repositories", value: "42 public repos" },
            { label: "Total Stars",  value: "180+ stars" },
            { label: "Followers",    value: "95 followers" },
            { label: "Pinned Focus", value: "React, systems, tooling" },
          ].map((stat) => (
            <article key={stat.label} className="tilt-card">
              <strong>{stat.label}</strong>
              <p>{stat.value}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="section compact-section">
        <div className="section-head">
          <p className="eyebrow">what I build</p>
          <h2>Built for those who care about craft.</h2>
        </div>
        <div className="service-grid">
          {[
            { num: "01", title: "Clear positioning",   desc: "Who I am, what I build, and what roles I take in one quick pass." },
            { num: "02", title: "Projects with impact",desc: "Summaries focused on business context, not just screenshots." },
            { num: "03", title: "Fast contact path",   desc: "Direct ways to reach me and discuss work quickly." },
          ].map((s) => (
            <article key={s.num} className="tilt-card service-card">
              <span className="service-num">{s.num}</span>
              <h3>{s.title}</h3>
              <p>{s.desc}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="section compact-section" style={{ padding: "0 4vw" }}>
        <div className="section-head">
          <p className="eyebrow">my journey</p>
          <h2>My path in technology</h2>
        </div>
        <Timeline />
      </section>

      <TechScroller />
    </section>
  );
}

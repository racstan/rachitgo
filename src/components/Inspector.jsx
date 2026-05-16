import React, { useEffect, useMemo, useRef, useState } from "react";
import { languages } from "../data/languages.js";

const units = [
  ["source", "source"],
  ["parser", "parser"],
  ["bytecode", "IR / bytecode"],
  ["runtime", "runtime"],
  ["io", "I/O"],
  ["machine", "machine"],
  ["cpu", "CPU"],
  ["gates", "gates"],
  ["electrons", "electrons"],
  ["screen", "browser"],
];

export default function Inspector({ item, language, onPrevLanguage, onNextLanguage, onRun, runToken }) {
  const [stepIndex, setStepIndex] = useState(0);
  const [running, setRunning] = useState(false);
  const canvasRef = useRef(null);
  const animationRef = useRef(null);

  const text = item.output;
  const steps = language.steps;
  const step = steps[stepIndex];
  const source = language.code(item);
  const fileName = `${item.id}.${language.fileExt}`;
  const artifact = useMemo(
    () => step.artifact({ item, language, text }),
    [item, language, step, text],
  );

  // Reset on language/item/run change — pure visual animation, no real compile
  useEffect(() => {
    setStepIndex(0);
    setRunning(true);
  }, [runToken, language.id, item.id]);

  // Auto-step animation — fast visual progression, never stalls
  useEffect(() => {
    if (!running) return undefined;
    const timer = setInterval(() => {
      setStepIndex((index) => {
        if (index >= steps.length - 1) {
          setRunning(false);
          return index;
        }
        return index + 1;
      });
    }, 280); // Fast and smooth
    return () => clearInterval(timer);
  }, [running, steps.length]);

  // CPU map canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return undefined;
    const ctx = canvas.getContext("2d");
    let frame = 0;

    function resize() {
      const rect = canvas.getBoundingClientRect();
      const scale = window.devicePixelRatio || 1;
      canvas.width = rect.width * scale;
      canvas.height = rect.height * scale;
      ctx.setTransform(scale, 0, 0, scale, 0, 0);
    }

    function draw() {
      const rect = canvas.getBoundingClientRect();
      ctx.clearRect(0, 0, rect.width, rect.height);
      ctx.font = "12px 'JetBrains Mono', monospace";
      ctx.lineWidth = 1;

      const active = Math.max(0, units.findIndex(([key]) => key === step.unit));

      // Draw connections
      ctx.strokeStyle = getComputedStyle(document.documentElement).getPropertyValue("--line");
      for (let i = 0; i < units.length - 1; i++) {
        const a = point(rect, i);
        const b = point(rect, i + 1);
        ctx.beginPath();
        ctx.moveTo(a.x, a.y);
        ctx.lineTo(b.x, b.y);
        ctx.stroke();
      }

      const textColor = getComputedStyle(document.documentElement).getPropertyValue("--text").trim();
      const mutedColor = getComputedStyle(document.documentElement).getPropertyValue("--muted").trim();
      const accentColor = getComputedStyle(document.documentElement).getPropertyValue("--accent").trim();
      const accent2Color = getComputedStyle(document.documentElement).getPropertyValue("--accent-2").trim();

      // Draw nodes
      for (let i = 0; i < units.length; i++) {
        const p = point(rect, i);
        const isActive = i === active;
        ctx.fillStyle = isActive ? `${accent2Color}33` : `${mutedColor}15`;
        ctx.strokeStyle = isActive ? accent2Color : `${mutedColor}40`;
        ctx.lineWidth = isActive ? 2 : 1;
        ctx.beginPath();
        ctx.roundRect(p.x - 38, p.y - 18, 76, 36, 6);
        ctx.fill();
        ctx.stroke();
        ctx.fillStyle = isActive ? textColor : mutedColor;
        ctx.textAlign = "center";
        ctx.fillText(units[i][1], p.x, p.y + 4);
      }

      // Animated pulse when running
      if (running) {
        const from = point(rect, Math.max(0, active - 1));
        const to = point(rect, active);
        const t = (Math.sin(frame / 8) + 1) / 2;
        const x = from.x + (to.x - from.x) * t;
        const y = from.y + (to.y - from.y) * t;
        ctx.fillStyle = frame % 10 < 5 ? accentColor : accent2Color;
        ctx.beginPath();
        ctx.arc(x, y, 5, 0, Math.PI * 2);
        ctx.fill();
        // Glow
        ctx.shadowColor = accentColor;
        ctx.shadowBlur = 12;
        ctx.beginPath();
        ctx.arc(x, y, 3, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;
      }

      frame += 1;
      animationRef.current = requestAnimationFrame(draw);
    }

    resize();
    draw();
    window.addEventListener("resize", resize);
    return () => {
      window.removeEventListener("resize", resize);
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, [step.unit, running]);

  function manualStep(delta) {
    setRunning(false);
    setStepIndex((index) => Math.max(0, Math.min(steps.length - 1, index + delta)));
  }

  return (
    <aside className="inspector">
      <section className="inspector-top">
        <div>
          <p className="eyebrow">interactive code lab</p>
          <h2>{item.title}</h2>
        </div>
        <span style={{ color: running ? "var(--accent)" : "var(--muted)" }}>
          {running ? "● simulating" : "○ paused"}
        </span>
      </section>

      <LanguagePicker language={language} onPrev={onPrevLanguage} onNext={onNextLanguage} />

      <section className="source-window">
        <div className="window-head">
          <span>{fileName}</span>
          <span>{language.name}</span>
        </div>
        <pre>{source}</pre>
      </section>

      <section className="cpu-map" aria-label="CPU and execution path">
        <canvas ref={canvasRef} />
      </section>

      <section className="step-view">
        <div className="step-meter">
          <span>
            Step {stepIndex + 1} / {steps.length}
          </span>
          <progress value={stepIndex + 1} max={steps.length} />
        </div>
        <h3>{step.title}</h3>
        <p>{step.explain}</p>
        <pre>{artifact}</pre>
      </section>

      <section className="console-output">
        <p className="eyebrow">final browser console</p>
        {text.map((line, i) => (
          <code key={`${line}-${i}`}>{line}</code>
        ))}
      </section>

      <div className="inspector-controls">
        <button onClick={() => manualStep(-1)}>← Prev</button>
        <button onClick={() => manualStep(1)}>Next →</button>
        <button
          onClick={() => {
            setStepIndex(0);
            setRunning(true);
            onRun();
          }}
        >
          ▶ Run Simulation
        </button>
      </div>
    </aside>
  );
}

function LanguagePicker({ language, onPrev, onNext }) {
  return (
    <section className="language-picker">
      <button onClick={onPrev} aria-label="Previous language">
        {"‹"}
      </button>
      <div>
        <p className="eyebrow">language selected</p>
        <strong>{language.name}</strong>
        <small>
          {languages.findIndex((entry) => entry.id === language.id) + 1} / {languages.length}
        </small>
      </div>
      <button onClick={onNext} aria-label="Next language">
        {"›"}
      </button>
    </section>
  );
}

function point(rect, index) {
  const cols = 2;
  const col = index % cols;
  const row = Math.floor(index / cols);
  const rows = Math.ceil(units.length / cols);
  return {
    x: rect.width * (0.28 + col * 0.44),
    y: rect.height * ((row + 0.65) / rows),
  };
}

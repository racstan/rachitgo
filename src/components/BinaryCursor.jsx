import React, { useEffect, useRef } from "react";

const CONFIG = {
  dots: 7,
  deltaT: 0.014,
  segLength: 14,
  springK: 8.5,
  mass: 1,
  gravity: 24,
  resistance: 12,
  stopVel: 0.06,
  stopAcc: 0.06,
  dotSize: 12,
  bounce: 0.55,
};

class Vec {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }
}

class Particle {
  constructor(canvas, start) {
    this.position = { x: start.x, y: start.y };
    this.velocity = { x: 0, y: 0 };
    this.canvas = canvas;
  }

  draw(context) {
    context.drawImage(
      this.canvas,
      this.position.x - this.canvas.width / 2,
      this.position.y - this.canvas.height / 2,
      this.canvas.width,
      this.canvas.height,
    );
  }
}

function getThemeColor(variable, fallback) {
  if (typeof window === "undefined") return fallback;
  const value = getComputedStyle(document.documentElement).getPropertyValue(variable).trim();
  return value || fallback;
}

function createGlyphCanvas(glyph, fill, glow) {
  const canvas = document.createElement("canvas");
  const context = canvas.getContext("2d");
  const size = 18;

  if (!context) return canvas;

  canvas.width = size * 2;
  canvas.height = size * 2;

  context.clearRect(0, 0, canvas.width, canvas.height);
  context.font = `600 ${size}px "JetBrains Mono", monospace`;
  context.textAlign = "center";
  context.textBaseline = "middle";
  context.fillStyle = fill;
  context.shadowColor = glow;
  context.shadowBlur = 10;
  context.fillText(glyph, canvas.width / 2, canvas.height / 2);

  return canvas;
}

export default function BinaryCursor({ emoji = "01", theme }) {
  const canvasRef = useRef(null);
  const contextRef = useRef(null);
  const particlesRef = useRef([]);
  const cursorRef = useRef({ x: 0, y: 0, active: false });
  const lastMoveRef = useRef(0);
  const sizeRef = useRef({ width: 0, height: 0 });
  const animationFrameRef = useRef(null);

  useEffect(() => {
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const hoverNone = window.matchMedia("(hover: none)");
    if (reduceMotion.matches || hoverNone.matches) return undefined;

    const canvas = canvasRef.current;
    if (!canvas) return undefined;

    const context = canvas.getContext("2d");
    if (!context) return undefined;
    contextRef.current = context;

    const fill = getThemeColor("--accent-2", "#58a6ff");
    const glow = getThemeColor("--accent", "#3fb950");
    const glyphs = emoji && emoji.length > 1 ? emoji.split("") : [emoji || "0"];
    const glyphCanvases = glyphs.map((glyph) => createGlyphCanvas(glyph, fill, glow));

    function resizeCanvas() {
      const width = window.innerWidth;
      const height = window.innerHeight;
      sizeRef.current = { width, height };
      const dpr = window.devicePixelRatio || 1;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      context.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    resizeCanvas();
    const start = { x: sizeRef.current.width / 2, y: sizeRef.current.height / 2 };
    cursorRef.current = { x: start.x, y: start.y, active: false };
    lastMoveRef.current = performance.now();
    particlesRef.current = Array.from({ length: CONFIG.dots }, (_, index) => (
      new Particle(glyphCanvases[index % glyphCanvases.length], start)
    ));

    function onPointerMove(event) {
      const target = event.target;
      const isOverInteractive = target && (
        target.closest("a, button, input, select, textarea, [role='button'], summary, .nav-dropdown") ||
        target.closest(".resume-ai-panel") ||
        target.closest(".resume-ai-fab")
      );

      if (isOverInteractive) {
        cursorRef.current.active = false;
      } else {
        cursorRef.current.active = true;
        cursorRef.current.x = event.clientX;
        cursorRef.current.y = event.clientY;
        lastMoveRef.current = performance.now();
      }
    }

    function onPointerLeave() {
      cursorRef.current.active = false;
    }

    function springForce(i, j, spring) {
      const dx = particlesRef.current[i].position.x - particlesRef.current[j].position.x;
      const dy = particlesRef.current[i].position.y - particlesRef.current[j].position.y;
      const len = Math.sqrt(dx * dx + dy * dy);
      if (len > CONFIG.segLength) {
        const springF = CONFIG.springK * (len - CONFIG.segLength);
        spring.x += (dx / len) * springF;
        spring.y += (dy / len) * springF;
      }
    }

    function updateParticles() {
      if (!contextRef.current) return;
      const { width, height } = sizeRef.current;
      contextRef.current.clearRect(0, 0, width, height);

      if (!cursorRef.current.active) return;

      const now = performance.now();
      const idleMs = now - lastMoveRef.current;
      const fadeStart = 220;
      const fadeEnd = 900;
      const fadeProgress = Math.min(Math.max((idleMs - fadeStart) / (fadeEnd - fadeStart), 0), 1);
      const trailAlpha = 1 - fadeProgress;
      const headAlpha = Math.max(0.35, trailAlpha);

      particlesRef.current[0].position.x = cursorRef.current.x;
      particlesRef.current[0].position.y = cursorRef.current.y;
      contextRef.current.globalAlpha = headAlpha;
      particlesRef.current[0].draw(contextRef.current);

      for (let i = 1; i < CONFIG.dots; i += 1) {
        const spring = new Vec(0, 0);
        springForce(i - 1, i, spring);
        if (i < CONFIG.dots - 1) springForce(i + 1, i, spring);

        const resist = new Vec(
          -particlesRef.current[i].velocity.x * CONFIG.resistance,
          -particlesRef.current[i].velocity.y * CONFIG.resistance,
        );

        const accel = new Vec(
          (spring.x + resist.x) / CONFIG.mass,
          (spring.y + resist.y) / CONFIG.mass + CONFIG.gravity,
        );

        particlesRef.current[i].velocity.x += CONFIG.deltaT * accel.x;
        particlesRef.current[i].velocity.y += CONFIG.deltaT * accel.y;

        if (
          Math.abs(particlesRef.current[i].velocity.x) < CONFIG.stopVel &&
          Math.abs(particlesRef.current[i].velocity.y) < CONFIG.stopVel &&
          Math.abs(accel.x) < CONFIG.stopAcc &&
          Math.abs(accel.y) < CONFIG.stopAcc
        ) {
          particlesRef.current[i].velocity.x = 0;
          particlesRef.current[i].velocity.y = 0;
        }

        particlesRef.current[i].position.x += particlesRef.current[i].velocity.x;
        particlesRef.current[i].position.y += particlesRef.current[i].velocity.y;

        if (particlesRef.current[i].position.y >= height - CONFIG.dotSize - 1) {
          if (particlesRef.current[i].velocity.y > 0) {
            particlesRef.current[i].velocity.y = CONFIG.bounce * -particlesRef.current[i].velocity.y;
          }
          particlesRef.current[i].position.y = height - CONFIG.dotSize - 1;
        }

        if (particlesRef.current[i].position.x >= width - CONFIG.dotSize) {
          if (particlesRef.current[i].velocity.x > 0) {
            particlesRef.current[i].velocity.x = CONFIG.bounce * -particlesRef.current[i].velocity.x;
          }
          particlesRef.current[i].position.x = width - CONFIG.dotSize - 1;
        }

        if (particlesRef.current[i].position.x < 0) {
          if (particlesRef.current[i].velocity.x < 0) {
            particlesRef.current[i].velocity.x = CONFIG.bounce * -particlesRef.current[i].velocity.x;
          }
          particlesRef.current[i].position.x = 0;
        }

        contextRef.current.globalAlpha = i === 0 ? headAlpha : trailAlpha;
        particlesRef.current[i].draw(contextRef.current);
      }

      contextRef.current.globalAlpha = 1;
    }

    function loop() {
      updateParticles();
      animationFrameRef.current = requestAnimationFrame(loop);
    }

    window.addEventListener("pointermove", onPointerMove, { passive: true });
    window.addEventListener("pointerdown", onPointerMove, { passive: true });
    window.addEventListener("pointerleave", onPointerLeave, { passive: true });
    window.addEventListener("blur", onPointerLeave);
    window.addEventListener("resize", resizeCanvas);

    loop();

    return () => {
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerdown", onPointerMove);
      window.removeEventListener("pointerleave", onPointerLeave);
      window.removeEventListener("blur", onPointerLeave);
      window.removeEventListener("resize", resizeCanvas);
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
    };
  }, [emoji, theme]);

  return <canvas ref={canvasRef} className="binary-cursor" aria-hidden="true" />;
}

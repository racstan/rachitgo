import React, { useEffect, useRef, useCallback } from "react";

// WorldBox-inspired binary digits that fall, react to clicks (change angle/direction)
const PARTICLE_COUNT = 80;
const GRAVITY = 0.08;
const FRICTION = 0.996;
const CLICK_FORCE = 5;

function createParticle(w, h) {
  return {
    x: Math.random() * w,
    y: Math.random() * h,
    vx: (Math.random() - 0.5) * 0.28,
    vy: Math.random() * 0.5 + 0.3,
    char: Math.random() > 0.5 ? "1" : "0",
    size: 11 + Math.random() * 4,
    angle: (Math.random() - 0.5) * 0.4,
    angleV: (Math.random() - 0.5) * 0.02,
    opacity: 0.15 + Math.random() * 0.25,
    colorType: Math.random() > 0.5 ? "green" : "yellow",
  };
}

export default function BinaryRain({ theme }) {
  const canvasRef = useRef(null);
  const particlesRef = useRef([]);
  const mouseRef = useRef({ x: -1000, y: -1000 });
  const animRef = useRef(null);

  const init = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const w = window.innerWidth;
    const h = window.innerHeight;
    canvas.width = w * (window.devicePixelRatio || 1);
    canvas.height = h * (window.devicePixelRatio || 1);
    canvas.style.width = w + "px";
    canvas.style.height = h + "px";

    if (particlesRef.current.length === 0) {
      particlesRef.current = Array.from({ length: PARTICLE_COUNT }, () => createParticle(w, h));
    }
  }, []);

  useEffect(() => {
    init();

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const dpr = window.devicePixelRatio || 1;

    function animate() {
      const w = canvas.width / dpr;
      const h = canvas.height / dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, w, h);

      const isDark = theme === "dark";
      const greenBase = isDark ? "rgba(63, 185, 80," : "rgba(26, 127, 55,";
      const yellowBase = isDark ? "rgba(255, 215, 0," : "rgba(204, 153, 0,";

      for (const p of particlesRef.current) {
        // Gravity
        p.vy += GRAVITY * 0.05;
        p.vx *= FRICTION;
        p.vy *= FRICTION;
        if (p.vy < 0.18) p.vy = 0.18;
        p.x += p.vx;
        p.y += p.vy;
        p.angle += p.angleV;

        // Wrap around
        if (p.y > h + 20) {
          p.y = -Math.random() * 180;
          p.x = Math.random() * w;
          p.vy = Math.random() * 0.5 + 0.3;
          p.char = Math.random() > 0.5 ? "1" : "0";
        }
        if (p.x < -20) p.x = w + 20;
        if (p.x > w + 20) p.x = -20;

        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.angle);
        ctx.font = `${p.size}px "JetBrains Mono", monospace`;
        ctx.fillStyle = `${p.colorType === 'green' ? greenBase : yellowBase}${p.opacity})`;
        ctx.textAlign = "center";
        ctx.fillText(p.char, 0, 0);
        ctx.restore();
      }

      animRef.current = requestAnimationFrame(animate);
    }

    animate();

    function onResize() {
      const w = window.innerWidth;
      const h = window.innerHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      canvas.style.width = w + "px";
      canvas.style.height = h + "px";
    }

    function onClick(e) {
      const mx = e.clientX;
      const my = e.clientY;
      for (const p of particlesRef.current) {
        const dx = p.x - mx;
        const dy = p.y - my;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 120) {
          const force = (1 - dist / 120) * CLICK_FORCE;
          const angle = Math.atan2(dy, dx);
          p.vx += Math.cos(angle) * force;
          p.vy += Math.sin(angle) * force;
          p.angleV += (Math.random() - 0.5) * 0.15;
          // Toggle char on close click
          if (dist < 40) {
            p.char = p.char === "1" ? "0" : "1";
          }
        }
      }
    }

    window.addEventListener("resize", onResize);
    canvas.addEventListener("click", onClick);

    return () => {
      if (animRef.current) cancelAnimationFrame(animRef.current);
      window.removeEventListener("resize", onResize);
      canvas.removeEventListener("click", onClick);
    };
  }, [theme, init]);

  return (
    <canvas
      ref={canvasRef}
      className="binary-rain-canvas interactive"
      aria-hidden="true"
    />
  );
}

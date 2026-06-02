import React, { useEffect, useRef } from "react";

const CONFIG = {
  radius: 9.5,
  ringWidth: 1,
  shadowBlur: 14,
  ease: 0.48,
  snapDistance: 80,
  segments: 26,
  wobbleAmp: 1.6,
  wobbleSpeed: 0.002,
  fillAlpha: 0.22,
  ringAlpha: 0.35,
  sheenAlpha: 0.3,
  blurSize: 32,
};

function getThemeColor(variable, fallback) {
  if (typeof window === "undefined") return fallback;
  const value = getComputedStyle(document.documentElement).getPropertyValue(variable).trim();
  return value || fallback;
}

function getThemeMode() {
  if (typeof document === "undefined") return "dark";
  return document.documentElement.dataset.theme || "dark";
}

export default function BinaryCursor() {
  const canvasRef = useRef(null);
  const blurRef = useRef(null);
  const sizeRef = useRef({ width: 0, height: 0, dpr: 1 });
  const targetRef = useRef({ x: 0, y: 0 });
  const posRef = useRef({ x: 0, y: 0 });
  const activeRef = useRef(false);
  const rafRef = useRef(null);
  const colorsRef = useRef({
    orb: "#000000",
    ring: "rgba(255, 255, 255, 0.12)",
    shadow: "rgba(0, 0, 0, 0.35)",
    highlight: "rgba(255, 255, 255, 0.28)",
  });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return undefined;

    const blur = blurRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return undefined;

    function updateColors() {
      const theme = getThemeMode();
      colorsRef.current = {
        orb: getThemeColor("--orb-bg", theme === "light" ? "#ffffff" : "#000000"),
        ring: getThemeColor("--orb-ring", theme === "light" ? "rgba(0, 0, 0, 0.12)" : "rgba(255, 255, 255, 0.12)"),
        shadow: getThemeColor("--orb-shadow", theme === "light" ? "rgba(0, 0, 0, 0.26)" : "rgba(0, 0, 0, 0.4)"),
        highlight: theme === "light" ? "rgba(0, 0, 0, 0.12)" : "rgba(255, 255, 255, 0.28)",
      };
    }

    function resizeCanvas() {
      const width = window.innerWidth;
      const height = window.innerHeight;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      sizeRef.current = { width, height, dpr };
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      if (blur) {
        blur.style.width = `${CONFIG.blurSize}px`;
        blur.style.height = `${CONFIG.blurSize}px`;
      }
    }

    function onPointerMove(event) {
      if (!activeRef.current) {
        posRef.current.x = event.clientX;
        posRef.current.y = event.clientY;
      }
      targetRef.current.x = event.clientX;
      targetRef.current.y = event.clientY;
      activeRef.current = true;
    }

    function onPointerLeave() {
      activeRef.current = false;
    }

    function drawBlob(ctxLocal, radius, wobbleAmp, time) {
      ctxLocal.beginPath();
      for (let i = 0; i <= CONFIG.segments; i += 1) {
        const angle = (i / CONFIG.segments) * Math.PI * 2;
        const noise = Math.sin(angle * 3 + time * 1.8) + Math.sin(angle * 5 - time * 1.1);
        const wobble = noise * 0.5;
        const r = radius + wobbleAmp * wobble;
        const x = Math.cos(angle) * r;
        const y = Math.sin(angle) * r;
        if (i === 0) {
          ctxLocal.moveTo(x, y);
        } else {
          ctxLocal.lineTo(x, y);
        }
      }
      ctxLocal.closePath();
    }

    function drawOrb() {
      const { width, height } = sizeRef.current;
      ctx.clearRect(0, 0, width, height);

      if (!activeRef.current) {
        if (blur) blur.style.opacity = "0";
        rafRef.current = requestAnimationFrame(drawOrb);
        return;
      }

      const pos = posRef.current;
      const target = targetRef.current;
      const dx = target.x - pos.x;
      const dy = target.y - pos.y;
      const distance = Math.hypot(dx, dy);
      const follow = distance > CONFIG.snapDistance ? 1 : CONFIG.ease;
      pos.x += dx * follow;
      pos.y += dy * follow;

      if (blur) {
        blur.style.opacity = "1";
        blur.style.transform = `translate3d(${pos.x}px, ${pos.y}px, 0) translate(-50%, -50%)`;
      }

      const { orb, ring, shadow, highlight } = colorsRef.current;
      const time = performance.now() * CONFIG.wobbleSpeed;
      const motionBoost = Math.min(distance * 0.035, 1.8);

      ctx.save();
      ctx.translate(pos.x, pos.y);
      ctx.rotate(time * 0.35);

      drawBlob(ctx, CONFIG.radius, CONFIG.wobbleAmp + motionBoost, time);
      const baseGradient = ctx.createRadialGradient(
        0,
        0,
        CONFIG.radius * 0.2,
        0,
        0,
        CONFIG.radius * 1.3,
      );
      baseGradient.addColorStop(0, orb);
      baseGradient.addColorStop(0.65, orb);
      baseGradient.addColorStop(1, "rgba(255, 255, 255, 0)");
      ctx.fillStyle = baseGradient;
      ctx.shadowColor = shadow;
      ctx.shadowBlur = CONFIG.shadowBlur;
      ctx.globalAlpha = CONFIG.fillAlpha;
      ctx.fill();
      ctx.globalAlpha = 1;
      ctx.shadowBlur = 0;

      ctx.globalAlpha = CONFIG.ringAlpha;
      ctx.lineWidth = CONFIG.ringWidth;
      ctx.strokeStyle = ring;
      ctx.stroke();
      ctx.globalAlpha = 1;

      const sheen = ctx.createRadialGradient(0, 0, CONFIG.radius * 0.2, 0, 0, CONFIG.radius * 1.4);
      sheen.addColorStop(0, highlight);
      sheen.addColorStop(1, "rgba(255, 255, 255, 0)");
      ctx.fillStyle = sheen;
      ctx.globalAlpha = CONFIG.sheenAlpha;
      drawBlob(ctx, CONFIG.radius * 0.9, CONFIG.wobbleAmp * 0.6 + motionBoost * 0.4, time + 1.3);
      ctx.fill();
      ctx.globalAlpha = 1;

      ctx.restore();

      rafRef.current = requestAnimationFrame(drawOrb);
    }

    updateColors();
    resizeCanvas();
    drawOrb();

    const themeObserver = new MutationObserver(updateColors);
    themeObserver.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });

    window.addEventListener("pointermove", onPointerMove, { passive: true });
    window.addEventListener("pointerdown", onPointerMove, { passive: true });
    window.addEventListener("pointerleave", onPointerLeave, { passive: true });
    window.addEventListener("blur", onPointerLeave);
    window.addEventListener("resize", resizeCanvas);

    return () => {
      themeObserver.disconnect();
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerdown", onPointerMove);
      window.removeEventListener("pointerleave", onPointerLeave);
      window.removeEventListener("blur", onPointerLeave);
      window.removeEventListener("resize", resizeCanvas);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  return (
    <div className="binary-cursor" aria-hidden="true">
      <div ref={blurRef} className="cursor-orb-blur" />
      <canvas ref={canvasRef} className="cursor-orb-canvas" />
    </div>
  );
}

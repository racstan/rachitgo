import React, { useEffect, useRef, useState } from "react";
import { prepareWithSegments, layoutWithLines } from "@chenglou/pretext";

const BASE_CONFIG = {
  gravity: 0,
  damping: 0.96,
  iterationsPerFrame: 6,
  compressFactor: 0.98,
  stretchFactor: 1.02,
  horizontalCompressFactor: 0.98,
  horizontalStretchFactor: 1.02,
  mouseStrength: 0.8,
  grabRadius: 20,
  returnStrength: 0.08,
};

class Vec2 {
  constructor(x = 0, y = 0) {
    this.x = x;
    this.y = y;
  }

  reset(x = 0, y = 0) {
    this.x = x;
    this.y = y;
  }

  zero() {
    this.x = 0;
    this.y = 0;
  }
}

class Particle {
  constructor({ x, y, pinned, char }) {
    this.pos = new Vec2(x, y);
    this.oldPos = new Vec2(x, y);
    this.acceleration = new Vec2();
    this.home = new Vec2(x, y);
    this.pinned = pinned;
    this.originalPinnedState = pinned;
    this.char = char;
    this.downConstraint = null;
  }

  update(delta, config) {
    if (this.pinned) {
      this.acceleration.zero();
      return;
    }

    const safeDelta = Math.min(32, Math.max(1, delta || 16));
    const dt = safeDelta / 16.666;
    const dtSq = dt * dt;

    const velocityX = (this.pos.x - this.oldPos.x) * config.damping;
    const velocityY = (this.pos.y - this.oldPos.y) * config.damping;

    this.oldPos.x = this.pos.x;
    this.oldPos.y = this.pos.y;

    this.acceleration.y += config.gravity * dt;
    this.acceleration.x += (this.home.x - this.pos.x) * config.returnStrength;
    this.acceleration.y += (this.home.y - this.pos.y) * config.returnStrength;

    this.pos.x += velocityX + this.acceleration.x * dtSq;
    this.pos.y += velocityY + this.acceleration.y * dtSq;

    const dxHome = this.home.x - this.pos.x;
    const dyHome = this.home.y - this.pos.y;
    if (
      Math.abs(dxHome) < 0.2 &&
      Math.abs(dyHome) < 0.2 &&
      Math.abs(velocityX) < 0.08 &&
      Math.abs(velocityY) < 0.08
    ) {
      this.pos.x = this.home.x;
      this.pos.y = this.home.y;
      this.oldPos.x = this.home.x;
      this.oldPos.y = this.home.y;
    }

    this.acceleration.zero();
  }
}

class Constraint {
  constructor({ p1, p2, length, compressFactor, stretchFactor }) {
    this.p1 = p1;
    this.p2 = p2;
    this.length = length;

    this.minLength = length * compressFactor;
    this.maxLength = length * stretchFactor;
    this.minLengthSq = this.minLength * this.minLength;
    this.maxLengthSq = this.maxLength * this.maxLength;
  }

  solve() {
    const dx = this.p2.pos.x - this.p1.pos.x;
    const dy = this.p2.pos.y - this.p1.pos.y;
    const distanceSq = dx * dx + dy * dy;

    if (distanceSq === 0) return;

    let targetLength;

    if (distanceSq < this.minLengthSq) {
      targetLength = this.minLength;
    } else if (distanceSq > this.maxLengthSq) {
      targetLength = this.maxLength;
    } else {
      return;
    }

    const distance = Math.sqrt(distanceSq);
    const percent = (targetLength - distance) / distance / 2;
    const offsetX = dx * percent;
    const offsetY = dy * percent;

    if (!this.p1.pinned) {
      this.p1.pos.x -= offsetX;
      this.p1.pos.y -= offsetY;
    }

    if (!this.p2.pinned) {
      this.p2.pos.x += offsetX;
      this.p2.pos.y += offsetY;
    }
  }
}

class ClothInput {
  constructor({ canvas, particles, config, getOffsets }) {
    this.canvas = canvas;
    this.particles = particles;
    this.config = config;
    this.getOffsets = getOffsets;
    this.mousePos = new Vec2();
    this.grabbedParticle = null;
    this.isActive = false;

    this.pointerdown = this.pointerdown.bind(this);
    this.pointerup = this.pointerup.bind(this);
    this.pointermove = this.pointermove.bind(this);
    this.pointerleave = this.pointerleave.bind(this);
    this.contextmenu = this.contextmenu.bind(this);

    canvas.addEventListener("pointerdown", this.pointerdown);
    canvas.addEventListener("pointerup", this.pointerup);
    canvas.addEventListener("pointercancel", this.pointerup);
    canvas.addEventListener("pointermove", this.pointermove);
    canvas.addEventListener("pointerleave", this.pointerleave);
    canvas.addEventListener("contextmenu", this.contextmenu);
  }

  destroy() {
    this.canvas.removeEventListener("pointerdown", this.pointerdown);
    this.canvas.removeEventListener("pointerup", this.pointerup);
    this.canvas.removeEventListener("pointercancel", this.pointerup);
    this.canvas.removeEventListener("pointermove", this.pointermove);
    this.canvas.removeEventListener("pointerleave", this.pointerleave);
    this.canvas.removeEventListener("contextmenu", this.contextmenu);
  }

  updateLocalPointer(e) {
    const rect = this.canvas.getBoundingClientRect();
    const offsets = this.getOffsets(rect);

    this.mousePos.x = e.clientX - rect.left - offsets.offsetX;
    this.mousePos.y = e.clientY - rect.top - offsets.offsetY;
  }

  pointerdown(e) {
    this.canvas.setPointerCapture?.(e.pointerId);
    this.updateLocalPointer(e);
    this.isActive = true;

    for (const particle of this.particles) {
      const dx = this.mousePos.x - particle.pos.x;
      const dy = this.mousePos.y - particle.pos.y;

      if (dx * dx + dy * dy < this.config.grabRadiusSq) {
        this.grabbedParticle = particle;
        particle.originalPinnedState = particle.pinned;
        particle.pinned = true;
        break;
      }
    }
  }

  pointerup(e) {
    this.canvas.releasePointerCapture?.(e.pointerId);
    this.isActive = false;

    if (!this.grabbedParticle) return;

    this.grabbedParticle.pinned = this.grabbedParticle.originalPinnedState;
    this.grabbedParticle.oldPos.reset(
      this.grabbedParticle.pos.x,
      this.grabbedParticle.pos.y
    );

    this.grabbedParticle = null;
  }

  pointerleave() {
    this.isActive = false;
  }

  pointermove(e) {
    this.updateLocalPointer(e);

    if (!this.isActive && !this.grabbedParticle) {
      return;
    }

    if (this.grabbedParticle) {
      this.grabbedParticle.pos.reset(this.mousePos.x, this.mousePos.y);
      this.grabbedParticle.oldPos.reset(this.mousePos.x, this.mousePos.y);
      return;
    }

    for (const particle of this.particles) {
      const dx = particle.pos.x - this.mousePos.x;
      const dy = particle.pos.y - this.mousePos.y;
      const distanceSq = dx * dx + dy * dy;

      if (distanceSq >= this.config.mouseRadiusSq) continue;

      const angle = Math.atan2(dy, dx) - Math.PI;
      const strength =
        (Math.max(0, 1 - distanceSq / this.config.mouseRadiusSq) *
          this.config.mouseStrength) /
        260;

      particle.acceleration.x += Math.cos(angle) * strength;
      particle.acceleration.y += Math.sin(angle) * strength;
    }
  }

  contextmenu(e) {
    e.preventDefault();
  }
}

function getCanvasFont(size, weight) {
  return `${weight} ${size}px "Inter", ui-sans-serif, system-ui, sans-serif`;
}

function getThemeColor(variable, fallback) {
  if (typeof window === "undefined") return fallback;
  const value = getComputedStyle(document.documentElement).getPropertyValue(variable).trim();
  return value || fallback;
}

export default function ProblemStatementCloth({
  text,
  className = "",
  variant = "panel",
  minHeight,
  padding,
  style,
  as = "div",
  ...rest
}) {
  const containerRef = useRef(null);
  const canvasRef = useRef(null);
  const rafRef = useRef(null);
  const inputRef = useRef(null);
  const stateRef = useRef(null);
  const resizeTimeoutRef = useRef(null);
  const [containerHeight, setContainerHeight] = useState(null);

  useEffect(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    if (!container || !canvas) return undefined;

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
    const context = canvas.getContext("2d", { alpha: true });
    if (!context) return undefined;

    function getOffsets(rect) {
      const config = stateRef.current?.config;
      if (!config) {
        return { offsetX: rect.width / 2, offsetY: rect.height / 2 };
      }
      const availableHeight = rect.height - config.padding * 2;
      const extraY = Math.max(0, (availableHeight - config.textHeight) / 2);
      return {
        offsetX: config.padding,
        offsetY: config.padding + extraY,
      };
    }

    function createClothState(config) {
      const font = getCanvasFont(config.fontSize, config.fontWeight);
      context.font = font;
      const prepared = prepareWithSegments(text, font, { whiteSpace: "normal" });
      const lineHeightPx = config.fontSize * config.lineHeight;
      const layout = layoutWithLines(prepared, config.awidth, lineHeightPx);
      const particles = [];
      const constraints = [];
      const particlesByLine = [];

      layout.lines.forEach((line, lineIndex) => {
        let x = 0;
        let prevWidth = 0;
        const lineParticles = [];
        const chars = [...line.text];

        chars.forEach((char, index) => {
          const sliceWidth = context.measureText(line.text.slice(0, index + 1)).width;
          const width = Math.max(0.1, sliceWidth - prevWidth);
          const centerX = prevWidth + width / 2;
          const centerY = lineIndex * lineHeightPx + lineHeightPx / 2;
          const particle = new Particle({
            x: centerX,
            y: centerY,
            pinned: false,
            char,
          });

          lineParticles.push(particle);
          particles.push(particle);
          x += width;
          prevWidth = sliceWidth;
        });

        for (let i = 1; i < lineParticles.length; i += 1) {
          const left = lineParticles[i - 1];
          const right = lineParticles[i];
          const restLength = Math.max(0.1, right.pos.x - left.pos.x);
          constraints.push(
            new Constraint({
              p1: left,
              p2: right,
              length: restLength,
              compressFactor: config.horizontalCompressFactor,
              stretchFactor: config.horizontalStretchFactor,
            })
          );
        }

        particlesByLine.push(lineParticles);
      });

      for (let lineIndex = 1; lineIndex < particlesByLine.length; lineIndex += 1) {
        const line = particlesByLine[lineIndex];
        const prevLine = particlesByLine[lineIndex - 1];
        if (!prevLine.length || !line.length) continue;

        const denominator = Math.max(line.length - 1, 1);
        for (let i = 0; i < line.length; i += 1) {
          const prevIndex = Math.round((i * (prevLine.length - 1)) / denominator);
          const upper = prevLine[prevIndex];
          const current = line[i];
          const restLength = Math.hypot(upper.pos.x - current.pos.x, upper.pos.y - current.pos.y);
          const constraint = new Constraint({
            p1: upper,
            p2: current,
            length: restLength,
            compressFactor: config.compressFactor,
            stretchFactor: config.stretchFactor,
          });
          if (!current.downConstraint) current.downConstraint = constraint;
          constraints.push(constraint);
        }
      }

      const textHeight = lineHeightPx * layout.lines.length;
      const textWidth = layout.lines.reduce((max, line) => Math.max(max, line.width || 0), 0);

      return { particles, constraints, textHeight, textWidth };
    }

    function drawCloth(state, rect) {
      const { config } = state;
      const offsets = getOffsets(rect);
      const textColor = state.textColor || getThemeColor("--text-dim", "#65707a");

      context.setTransform(dpr, 0, 0, dpr, 0, 0);
      context.clearRect(0, 0, rect.width, rect.height);
      context.font = getCanvasFont(config.fontSize, config.fontWeight);
      context.textAlign = "center";
      context.textBaseline = "middle";
      context.fillStyle = textColor;

      for (const particle of state.particles) {
        const char = particle.char;
        if (!char || char === " ") continue;

        context.setTransform(
          dpr,
          0,
          0,
          dpr,
          Math.round((particle.pos.x + offsets.offsetX) * dpr),
          Math.round((particle.pos.y + offsets.offsetY) * dpr)
        );

        context.fillText(char, 0, 0);
      }

      context.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    function build() {
      const rect = container.getBoundingClientRect();
      const resolvedPadding = typeof padding === "number"
        ? padding
        : variant === "inline"
          ? 0
          : Math.max(16, Math.round(rect.width * 0.04));
      const fontSize = Math.max(14, Math.min(18, Math.round(rect.width / 34)));
      const config = {
        ...BASE_CONFIG,
        padding: resolvedPadding,
        awidth: Math.max(240, rect.width - resolvedPadding * 2),
        mouseRadius: Math.max(120, Math.min(200, rect.width / 3)),
        fontSize,
        fontWeight: 500,
        lineHeight: 1.6,
      };

      config.mouseRadiusSq = config.mouseRadius * config.mouseRadius;
      config.grabRadiusSq = config.grabRadius * config.grabRadius;

      canvas.style.width = "100%";
      canvas.style.height = "100%";
      canvas.width = Math.floor(rect.width * dpr);
      canvas.height = Math.floor(rect.height * dpr);

      const clothState = createClothState(config);
      config.textHeight = clothState.textHeight;
      config.textWidth = clothState.textWidth;

      const resolvedMinHeight = typeof minHeight === "number"
        ? minHeight
        : variant === "panel"
          ? 240
          : 0;
      const nextHeight = Math.max(resolvedMinHeight, Math.ceil(config.textHeight + config.padding * 2));
      if (!Number.isNaN(nextHeight) && Math.abs((containerHeight || 0) - nextHeight) > 1) {
        setContainerHeight(nextHeight);
      }

      stateRef.current = {
        config,
        ...clothState,
      };

      stateRef.current.textColor = getComputedStyle(container).color || getThemeColor("--text-dim", "#65707a");

      inputRef.current?.destroy?.();
      inputRef.current = new ClothInput({
        canvas,
        particles: stateRef.current.particles,
        config,
        getOffsets,
      });

      drawCloth(stateRef.current, rect);
    }

    function tick(delta) {
      const state = stateRef.current;
      if (!state) return;

      for (const particle of state.particles) {
        particle.update(delta, state.config);
      }

      for (let i = 0; i < state.config.iterationsPerFrame; i += 1) {
        for (const constraint of state.constraints) {
          constraint.solve();
        }
      }

      const currentRect = rectRef.current || container.getBoundingClientRect();
      drawCloth(state, currentRect);
    }

    function loop(now) {
      rafRef.current = null;
      const lastTime = loop.lastTime || now;
      const delta = now - lastTime;
      loop.lastTime = now;
      tick(delta);
      if (!reduceMotion.matches) {
        rafRef.current = requestAnimationFrame(loop);
      }
    }

    function scheduleBuild() {
      if (resizeTimeoutRef.current) {
        clearTimeout(resizeTimeoutRef.current);
      }
      resizeTimeoutRef.current = setTimeout(() => {
        resizeTimeoutRef.current = null;
        build();
      }, 120);
    }

    build();

    if (!reduceMotion.matches) {
      rafRef.current = requestAnimationFrame(loop);
    }

    const observer = new ResizeObserver(scheduleBuild);
    observer.observe(container);
    window.addEventListener("resize", scheduleBuild);

    return () => {
      observer.disconnect();
      window.removeEventListener("resize", scheduleBuild);
      inputRef.current?.destroy?.();
      inputRef.current = null;
      if (resizeTimeoutRef.current) {
        clearTimeout(resizeTimeoutRef.current);
      }
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
    };
  }, [text]);

  const classes = `problem-cloth ${variant === "inline" ? "inline" : "panel"} ${className}`.trim();
  const wrapperStyle = {
    ...style,
    padding: typeof padding === "number" ? `${padding}px` : undefined,
    height: containerHeight ? `${containerHeight}px` : undefined,
  };

  const Component = as;

  return (
    <Component className={classes} ref={containerRef} style={wrapperStyle} {...rest}>
      <canvas ref={canvasRef} className="problem-cloth-canvas" aria-hidden="true" />
      <span className="sr-only">{text}</span>
    </Component>
  );
}

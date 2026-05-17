import React, { useEffect, useRef, useState } from "react";

export function useTilt(strength = 8) {
  const ref = useRef(null);

  function onMove(e) {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width - 0.5) * strength;
    const y = ((e.clientY - rect.top) / rect.height - 0.5) * -strength;
    el.style.transform = `perspective(700px) rotateX(${y}deg) rotateY(${x}deg) scale(1.02)`;
  }

  function onLeave() {
    const el = ref.current;
    if (!el) return;
    el.style.transform = "perspective(700px) rotateX(0deg) rotateY(0deg) scale(1)";
  }

  return { ref, onMouseMove: onMove, onMouseLeave: onLeave };
}

export default function TiltCard({ children, className = "", color, element = "div", strength = 8, ...props }) {
  const tilt = useTilt(strength);
  const [throwing, setThrowing] = useState(false);
  const dragRef = useRef({
    active: false,
    moved: false,
    startX: 0,
    startY: 0,
    x: 0,
    y: 0,
    vx: 0,
    vy: 0,
    lastX: 0,
    lastY: 0,
    lastTime: 0,
    frame: null,
  });
  const Component = element;

  useEffect(() => {
    return () => {
      if (dragRef.current.frame) cancelAnimationFrame(dragRef.current.frame);
    };
  }, []);

  function setCardTransform(x, y, rotate = 0, scale = 1.02) {
    const el = tilt.ref.current;
    if (!el) return;
    el.style.transform = `translate3d(${x}px, ${y}px, 0) rotate(${rotate}deg) scale(${scale})`;
  }

  function animateHome() {
    const state = dragRef.current;
    state.x *= 0.82;
    state.y *= 0.82;
    state.vx *= 0.65;
    state.vy *= 0.65;

    const rotate = Math.max(-7, Math.min(7, state.x / 24));
    setCardTransform(state.x, state.y, rotate, 1.01);

    if (Math.abs(state.x) < 0.5 && Math.abs(state.y) < 0.5) {
      state.x = 0;
      state.y = 0;
      setThrowing(false);
      setCardTransform(0, 0, 0, 1);
      return;
    }

    state.frame = requestAnimationFrame(animateHome);
  }

  function animateThrow(startTime) {
    const state = dragRef.current;
    const el = tilt.ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const viewportW = window.innerWidth;
    const viewportH = window.innerHeight;

    state.x += state.vx;
    state.y += state.vy;
    state.vx *= 0.965;
    state.vy *= 0.965;

    const nextLeft = rect.left + state.vx;
    const nextRight = rect.right + state.vx;
    const nextTop = rect.top + state.vy;
    const nextBottom = rect.bottom + state.vy;

    if (nextLeft < 8 || nextRight > viewportW - 8) {
      state.vx *= -0.62;
      state.x += state.vx * 2;
      el.classList.add("has-crashed");
      window.setTimeout(() => el.classList.remove("has-crashed"), 160);
    }

    if (nextTop < 72 || nextBottom > viewportH - 8) {
      state.vy *= -0.62;
      state.y += state.vy * 2;
      el.classList.add("has-crashed");
      window.setTimeout(() => el.classList.remove("has-crashed"), 160);
    }

    const rotate = Math.max(-14, Math.min(14, state.vx * 0.8));
    setCardTransform(state.x, state.y, rotate, 1.035);

    if (performance.now() - startTime > 650 || Math.abs(state.vx) + Math.abs(state.vy) < 1.2) {
      state.frame = requestAnimationFrame(animateHome);
      return;
    }

    state.frame = requestAnimationFrame(() => animateThrow(startTime));
  }

  function startThrow() {
    const state = dragRef.current;
    state.active = false;
    if (state.frame) cancelAnimationFrame(state.frame);
    setThrowing(true);
    state.frame = requestAnimationFrame(() => animateThrow(performance.now()));
  }

  return (
    <Component
      {...tilt}
      {...props}
      onPointerDown={(e) => {
        if (e.button !== undefined && e.button !== 0) return;
        const state = dragRef.current;
        state.active = true;
        state.moved = false;
        state.startX = e.clientX;
        state.startY = e.clientY;
        state.lastX = e.clientX;
        state.lastY = e.clientY;
        state.lastTime = performance.now();
        state.vx = 0;
        state.vy = 0;
        tilt.ref.current?.setPointerCapture?.(e.pointerId);
        props.onPointerDown?.(e);
      }}
      onPointerMove={(e) => {
        const state = dragRef.current;
        if (!state.active) {
          tilt.onMouseMove?.(e);
          props.onPointerMove?.(e);
          return;
        }

        const now = performance.now();
        const dt = Math.max(now - state.lastTime, 16);
        state.x += e.clientX - state.lastX;
        state.y += e.clientY - state.lastY;
        state.vx = ((e.clientX - state.lastX) / dt) * 16;
        state.vy = ((e.clientY - state.lastY) / dt) * 16;
        state.lastX = e.clientX;
        state.lastY = e.clientY;
        state.lastTime = now;
        state.moved = state.moved || Math.hypot(e.clientX - state.startX, e.clientY - state.startY) > 6;
        setThrowing(true);
        setCardTransform(state.x, state.y, Math.max(-10, Math.min(10, state.x / 28)), 1.03);
        props.onPointerMove?.(e);
      }}
      onPointerUp={(e) => {
        const state = dragRef.current;
        if (state.active) {
          tilt.ref.current?.releasePointerCapture?.(e.pointerId);
          startThrow();
        }
        props.onPointerUp?.(e);
      }}
      onPointerCancel={(e) => {
        const state = dragRef.current;
        if (state.active) startThrow();
        props.onPointerCancel?.(e);
      }}
      onMouseLeave={(e) => {
        if (!dragRef.current.active && !throwing) tilt.onMouseLeave?.(e);
        props.onMouseLeave?.(e);
      }}
      onClick={(e) => {
        if (dragRef.current.moved) {
          e.preventDefault();
          e.stopPropagation();
          dragRef.current.moved = false;
          return;
        }
        props.onClick?.(e);
      }}
      className={`tilt-card ${throwing ? "is-throwing" : ""} ${className}`.trim()}
      style={{ "--card-accent": color, ...props.style }}
    >
      {children}
    </Component>
  );
}

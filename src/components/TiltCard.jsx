import React, { useCallback, useEffect, useRef, useState } from "react";

export function useTilt(strength = 8) {
  const ref = useRef(null);
  const frameRef = useRef(null);
  const nextRef = useRef({ x: 0, y: 0 });

  function onMove(e) {
    if (document.documentElement.dataset.themeSwitching === "true") return;
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width - 0.5) * strength;
    const y = ((e.clientY - rect.top) / rect.height - 0.5) * -strength;
    nextRef.current = { x, y };
    if (frameRef.current) return;
    frameRef.current = requestAnimationFrame(() => {
      frameRef.current = null;
      el.style.transform = `perspective(700px) rotateX(${nextRef.current.y}deg) rotateY(${nextRef.current.x}deg) scale(1.015)`;
    });
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
  const [dragging, setDragging] = useState(false);
  const [returning, setReturning] = useState(false);
  const returningRef = useRef(false);
  const returningTimerRef = useRef(null);
  const isNativeInteractive = typeof element === "string" && ["a", "button", "input", "textarea", "select", "summary"].includes(element);
  const resolvedTabIndex = props.tabIndex ?? (isNativeInteractive ? undefined : 0);
  const dragRef = useRef({
    active: false,
    moved: false,
    startX: 0,
    startY: 0,
    lastX: 0,
    lastY: 0,
    lastTime: 0,
    vx: 0,
    vy: 0,
    x: 0,
    y: 0,
    targetX: 0,
    targetY: 0,
    frame: null,
  });
  const Component = element;

  useEffect(() => {
    return () => {
      if (dragRef.current.frame) cancelAnimationFrame(dragRef.current.frame);
      if (returningTimerRef.current) window.clearTimeout(returningTimerRef.current);
    };
  }, []);

  function clamp(value, min, max) {
    return Math.min(max, Math.max(min, value));
  }

  function isInteractiveTarget(target) {
    return target.closest?.("a, button, input, textarea, select, summary, [data-no-card-drag]");
  }

  function setCardTransform(x, y, rotate = 0, scale = 1.015) {
    const el = tilt.ref.current;
    if (!el) return;
    el.style.transform = `translate3d(${x}px, ${y}px, 0) rotate(${rotate}deg) scale(${scale})`;
  }

  function animateHome() {
    const state = dragRef.current;
    const spring = 0.035;
    const damping = 0.92;
    state.vx += -state.x * spring;
    state.vy += -state.y * spring;
    state.vx *= damping;
    state.vy *= damping;
    state.x += state.vx;
    state.y += state.vy;

    setCardTransform(state.x, state.y, clamp(state.x / 60, -6, 6), 1.004);

    if (
      Math.abs(state.x) < 0.5 &&
      Math.abs(state.y) < 0.5 &&
      Math.abs(state.vx) < 0.08 &&
      Math.abs(state.vy) < 0.08
    ) {
      state.x = 0;
      state.y = 0;
      state.vx = 0;
      state.vy = 0;
      setCardTransform(0, 0, 0, 1);
      setDragging(false);
      if (returningTimerRef.current) window.clearTimeout(returningTimerRef.current);
      returningTimerRef.current = window.setTimeout(() => {
        returningRef.current = false;
        setReturning(false);
      }, 1500);
      return;
    }

    state.frame = requestAnimationFrame(animateHome);
  }

  function springHome() {
    const state = dragRef.current;
    state.active = false;
    if (state.frame) cancelAnimationFrame(state.frame);
    returningRef.current = true;
    setReturning(true);
    state.frame = requestAnimationFrame(animateHome);
  }

  const resetCardImmediate = useCallback(() => {
    const state = dragRef.current;
    state.active = false;
    state.moved = false;
    state.x = 0;
    state.y = 0;
    state.vx = 0;
    state.vy = 0;
    state.targetX = 0;
    state.targetY = 0;
    if (state.frame) cancelAnimationFrame(state.frame);
    if (returningTimerRef.current) window.clearTimeout(returningTimerRef.current);
    returningRef.current = false;
    setReturning(false);
    setCardTransform(0, 0, 0, 1);
    setDragging(false);
  }, []);

  useEffect(() => {
    function handleInterrupt() {
      resetCardImmediate();
    }

    function handleVisibilityChange() {
      if (document.hidden) resetCardImmediate();
    }

    window.addEventListener("scroll", handleInterrupt, { passive: true });
    window.addEventListener("resize", handleInterrupt);
    window.addEventListener("blur", handleInterrupt);
    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      window.removeEventListener("scroll", handleInterrupt);
      window.removeEventListener("resize", handleInterrupt);
      window.removeEventListener("blur", handleInterrupt);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [resetCardImmediate]);

  return (
    <Component
      {...tilt}
      {...props}
      onPointerDown={(e) => {
        if (e.button !== undefined && e.button !== 0) return;
        if (isInteractiveTarget(e.target)) {
          tilt.onMouseLeave?.(e);
          props.onPointerDown?.(e);
          return;
        }
        const state = dragRef.current;
        if (returningTimerRef.current) window.clearTimeout(returningTimerRef.current);
        returningRef.current = false;
        setReturning(false);
        state.active = true;
        state.moved = false;
        state.startX = e.clientX;
        state.startY = e.clientY;
        state.lastX = e.clientX;
        state.lastY = e.clientY;
        state.lastTime = performance.now();
        state.vx = 0;
        state.vy = 0;
        state.x = 0;
        state.y = 0;
        state.targetX = 0;
        state.targetY = 0;
        if (state.frame) cancelAnimationFrame(state.frame);
        setDragging(true);
        tilt.ref.current?.setPointerCapture?.(e.pointerId);
        props.onPointerDown?.(e);
      }}
      onPointerMove={(e) => {
        const state = dragRef.current;
        if (!state.active) {
          if (!dragging && !returningRef.current) {
            tilt.onMouseMove?.(e);
          }
          props.onPointerMove?.(e);
          return;
        }

        const dx = e.clientX - state.startX;
        const dy = e.clientY - state.startY;
        const maxX = Math.max(420, window.innerWidth * 0.85);
        const maxY = Math.max(320, window.innerHeight * 0.75);
        state.targetX = clamp(dx, -maxX, maxX);
        state.targetY = clamp(dy, -maxY, maxY);
        state.x = state.targetX;
        state.y = state.targetY;
        const now = performance.now();
        const dt = Math.max(now - state.lastTime, 16);
        state.vx = ((e.clientX - state.lastX) / dt) * 16;
        state.vy = ((e.clientY - state.lastY) / dt) * 16;
        state.lastX = e.clientX;
        state.lastY = e.clientY;
        state.lastTime = now;
        state.moved = state.moved || Math.hypot(dx, dy) > 6;
        setCardTransform(state.x, state.y, clamp(state.x / 60, -6, 6), 1.02);
        props.onPointerMove?.(e);
      }}
      onMouseMove={(e) => {
        if (dragRef.current.active || returningRef.current) {
          props.onMouseMove?.(e);
          return;
        }
        tilt.onMouseMove?.(e);
        props.onMouseMove?.(e);
      }}
      onPointerUp={(e) => {
        const state = dragRef.current;
        if (state.active) {
          tilt.ref.current?.releasePointerCapture?.(e.pointerId);
          springHome();
        }
        props.onPointerUp?.(e);
      }}
      onPointerCancel={(e) => {
        if (dragRef.current.active) resetCardImmediate();
        props.onPointerCancel?.(e);
      }}
      onKeyDown={(e) => {
        if (!isNativeInteractive && props.onClick && (e.key === "Enter" || e.key === " ")) {
          e.preventDefault();
          props.onClick?.(e);
          return;
        }
        props.onKeyDown?.(e);
      }}
      onMouseLeave={(e) => {
        if (!dragRef.current.active && !dragging && !returningRef.current) tilt.onMouseLeave?.(e);
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
      tabIndex={resolvedTabIndex}
      className={`tilt-card ${dragging ? "is-dragging" : ""} ${returning ? "is-returning" : ""} ${className}`.trim()}
      style={{ "--card-accent": color, ...props.style }}
    >
      {children}
    </Component>
  );
}

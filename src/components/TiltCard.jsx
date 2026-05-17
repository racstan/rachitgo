import React, { useEffect, useRef, useState } from "react";

export function useTilt(strength = 8) {
  const ref = useRef(null);
  const frameRef = useRef(null);
  const nextRef = useRef({ x: 0, y: 0 });

  function onMove(e) {
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
  const dragRef = useRef({
    active: false,
    moved: false,
    startX: 0,
    startY: 0,
    x: 0,
    y: 0,
    frame: null,
  });
  const Component = element;

  useEffect(() => {
    return () => {
      if (dragRef.current.frame) cancelAnimationFrame(dragRef.current.frame);
    };
  }, []);

  function clamp(value, min, max) {
    return Math.min(max, Math.max(min, value));
  }

  function setCardTransform(x, y, rotate = 0, scale = 1.015) {
    const el = tilt.ref.current;
    if (!el) return;
    el.style.transform = `translate3d(${x}px, ${y}px, 0) rotate(${rotate}deg) scale(${scale})`;
  }

  function animateHome() {
    const state = dragRef.current;
    state.x *= 0.72;
    state.y *= 0.72;

    setCardTransform(state.x, state.y, clamp(state.x / 18, -3, 3), 1.006);

    if (Math.abs(state.x) < 0.5 && Math.abs(state.y) < 0.5) {
      state.x = 0;
      state.y = 0;
      setCardTransform(0, 0, 0, 1);
      setDragging(false);
      return;
    }

    state.frame = requestAnimationFrame(animateHome);
  }

  function springHome() {
    const state = dragRef.current;
    state.active = false;
    if (state.frame) cancelAnimationFrame(state.frame);
    state.frame = requestAnimationFrame(animateHome);
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
        state.x = 0;
        state.y = 0;
        if (state.frame) cancelAnimationFrame(state.frame);
        setDragging(true);
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

        const dx = e.clientX - state.startX;
        const dy = e.clientY - state.startY;
        state.x = clamp(dx * 0.42, -34, 34);
        state.y = clamp(dy * 0.42, -26, 26);
        state.moved = state.moved || Math.hypot(dx, dy) > 6;
        setCardTransform(state.x, state.y, clamp(state.x / 16, -4, 4), 1.018);
        props.onPointerMove?.(e);
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
        const state = dragRef.current;
        if (state.active) springHome();
        props.onPointerCancel?.(e);
      }}
      onMouseLeave={(e) => {
        if (!dragRef.current.active && !dragging) tilt.onMouseLeave?.(e);
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
      className={`tilt-card ${dragging ? "is-dragging" : ""} ${className}`.trim()}
      style={{ "--card-accent": color, ...props.style }}
    >
      {children}
    </Component>
  );
}

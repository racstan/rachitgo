import React, { useRef } from "react";

export function useTilt(strength = 12) {
  const ref = useRef(null);
  function onMove(e) {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width  - 0.5) * strength;
    const y = ((e.clientY - rect.top)  / rect.height - 0.5) * -strength;
    el.style.transform = `perspective(600px) rotateX(${y}deg) rotateY(${x}deg) scale(1.03)`;
  }
  function onLeave() {
    const el = ref.current;
    if (!el) return;
    el.style.transform = "perspective(600px) rotateX(0deg) rotateY(0deg) scale(1)";
  }
  return { ref, onMouseMove: onMove, onMouseLeave: onLeave };
}

export default function TiltCard({ children, className = "", color, element = "div", strength = 8, ...props }) {
  const tilt = useTilt(strength);
  const Component = element;
  return (
    <Component
      {...tilt}
      {...props}
      className={`tilt-card ${className}`}
      style={{ "--card-accent": color, ...props.style }}
    >
      {children}
    </Component>
  );
}

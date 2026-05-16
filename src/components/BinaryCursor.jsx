import React, { useEffect, useRef } from "react";

const ORBIT_COUNT = 12;
const ORBIT_RADIUS = 38;

export default function BinaryCursor() {
  const ref = useRef(null);
  const mouseRef = useRef({ x: -200, y: -200 });
  const bitsRef = useRef([]);
  const animRef = useRef(null);

  useEffect(() => {
    const root = ref.current;
    if (!root) return;

    // Create orbit bits
    bitsRef.current = Array.from({ length: ORBIT_COUNT }, (_, i) => {
      const span = document.createElement("span");
      span.className = "orbit-bit";
      span.textContent = Math.random() > 0.5 ? "1" : "0";
      root.appendChild(span);
      return {
        el: span,
        angle: (Math.PI * 2 * i) / ORBIT_COUNT,
        speed: 0.015 + Math.random() * 0.01,
        radius: ORBIT_RADIUS + (Math.random() - 0.5) * 12,
      };
    });

    function move(event) {
      mouseRef.current.x = event.clientX;
      mouseRef.current.y = event.clientY;
    }

    function animate() {
      const { x, y } = mouseRef.current;
      for (const bit of bitsRef.current) {
        bit.angle += bit.speed;
        const bx = x + Math.cos(bit.angle) * bit.radius;
        const by = y + Math.sin(bit.angle) * bit.radius;
        bit.el.style.left = `${bx}px`;
        bit.el.style.top = `${by}px`;
      }
      animRef.current = requestAnimationFrame(animate);
    }

    animate();
    window.addEventListener("pointermove", move, { passive: true });

    return () => {
      window.removeEventListener("pointermove", move);
      if (animRef.current) cancelAnimationFrame(animRef.current);
      for (const bit of bitsRef.current) bit.el.remove();
    };
  }, []);

  return <div className="binary-cursor" ref={ref} aria-hidden="true" />;
}

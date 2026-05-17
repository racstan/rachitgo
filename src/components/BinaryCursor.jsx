import React, { useEffect, useRef } from "react";

const START_POS = -200;

function lerp(current, target, amount) {
  return current + (target - current) * amount;
}

export default function BinaryCursor() {
  const coreRef = useRef(null);
  const ringRef = useRef(null);
  const glowRef = useRef(null);
  const targetRef = useRef({ x: START_POS, y: START_POS });
  const corePos = useRef({ x: START_POS, y: START_POS });
  const ringPos = useRef({ x: START_POS, y: START_POS });
  const glowPos = useRef({ x: START_POS, y: START_POS });
  const animRef = useRef(null);

  useEffect(() => {
    function move(event) {
      targetRef.current.x = event.clientX;
      targetRef.current.y = event.clientY;
    }

    function setPos(el, pos) {
      if (!el) return;
      el.style.left = `${pos.x}px`;
      el.style.top = `${pos.y}px`;
    }

    function animate() {
      const target = targetRef.current;
      corePos.current.x = lerp(corePos.current.x, target.x, 0.28);
      corePos.current.y = lerp(corePos.current.y, target.y, 0.28);
      ringPos.current.x = lerp(ringPos.current.x, target.x, 0.16);
      ringPos.current.y = lerp(ringPos.current.y, target.y, 0.16);
      glowPos.current.x = lerp(glowPos.current.x, target.x, 0.1);
      glowPos.current.y = lerp(glowPos.current.y, target.y, 0.1);

      setPos(coreRef.current, corePos.current);
      setPos(ringRef.current, ringPos.current);
      setPos(glowRef.current, glowPos.current);

      animRef.current = requestAnimationFrame(animate);
    }

    animate();
    window.addEventListener("pointermove", move, { passive: true });

    return () => {
      window.removeEventListener("pointermove", move);
      if (animRef.current) cancelAnimationFrame(animRef.current);
    };
  }, []);

  return (
    <div className="binary-cursor" aria-hidden="true">
      <div className="cursor-glow" ref={glowRef} />
      <div className="cursor-ring" ref={ringRef} />
      <div className="cursor-core" ref={coreRef} />
    </div>
  );
}

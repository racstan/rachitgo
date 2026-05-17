import React, { useEffect, useRef } from "react";

const START_POS = -200;

function lerp(current, target, amount) {
  return current + (target - current) * amount;
}

export default function BinaryCursor() {
  const atomRef = useRef(null);
  const targetRef = useRef({ x: START_POS, y: START_POS });
  const atomPos = useRef({ x: START_POS, y: START_POS });
  const animRef = useRef(null);

  useEffect(() => {
    function move(event) {
      targetRef.current.x = event.clientX;
      targetRef.current.y = event.clientY;
    }

    function animate() {
      const target = targetRef.current;
      atomPos.current.x = lerp(atomPos.current.x, target.x, 0.22);
      atomPos.current.y = lerp(atomPos.current.y, target.y, 0.22);

      if (atomRef.current) {
        atomRef.current.style.left = `${atomPos.current.x}px`;
        atomRef.current.style.top = `${atomPos.current.y}px`;
      }

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
      <div className="atom-cursor" ref={atomRef}>
        <div className="atom-core" />
        <div className="atom-orbit orbit-one">
          <span className="atom-electron" />
        </div>
        <div className="atom-orbit orbit-two">
          <span className="atom-electron" />
        </div>
        <div className="atom-orbit orbit-three">
          <span className="atom-electron" />
        </div>
      </div>
    </div>
  );
}

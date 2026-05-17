import React, { useEffect, useMemo, useRef } from "react";

const START_POS = -200;
const TRAIL_COUNT = 12;

function lerp(current, target, amount) {
  return current + (target - current) * amount;
}

function AtomSvg() {
  return (
    <svg className="cursor-atom-svg" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120">
      <defs>
        <linearGradient id="cursor-rainbow" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#ff3b30" />
          <stop offset="22%" stopColor="#ffcc00" />
          <stop offset="44%" stopColor="#34c759" />
          <stop offset="66%" stopColor="#00c7ff" />
          <stop offset="84%" stopColor="#5856d6" />
          <stop offset="100%" stopColor="#ff2d55" />
        </linearGradient>
      </defs>
      <g className="cursor-eins">
        <g className="cursor-all">
          <mask id="cursor-mask-one">
            <circle cx="60" cy="60" r="100" fill="#fff" />
            <circle cx="60" cy="60" r="50" fill="#000" />
          </mask>
          <g className="cursor-group" mask="url(#cursor-mask-one)">
            <circle className="cursor-go" cx="60" cy="65" r="48" />
            <circle className="cursor-go" cx="60" cy="55" r="48" />
          </g>
        </g>
      </g>
      <g className="cursor-zwei">
        <g className="cursor-all">
          <mask id="cursor-mask-two">
            <circle cx="60" cy="60" r="100" fill="#fff" />
            <circle cx="60" cy="60" r="50" fill="#000" />
          </mask>
          <g className="cursor-group cursor-delay-one" mask="url(#cursor-mask-two)">
            <circle className="cursor-go" cx="60" cy="65" r="48" />
            <circle className="cursor-go" cx="60" cy="55" r="48" />
          </g>
        </g>
      </g>
      <g>
        <g className="cursor-all">
          <mask id="cursor-mask-three">
            <circle cx="60" cy="60" r="100" fill="#fff" />
            <circle cx="60" cy="60" r="50" fill="#000" />
          </mask>
          <g className="cursor-group cursor-delay-two" mask="url(#cursor-mask-three)">
            <circle className="cursor-go" cx="60" cy="65" r="48" />
            <circle className="cursor-go" cx="60" cy="55" r="48" />
          </g>
        </g>
      </g>
      <circle className="cursor-go cursor-core-dot" cx="60" cy="60" r="4" />
    </svg>
  );
}

function TrailDot() {
  return (
    <svg className="cursor-dot-svg" viewBox="0 0 120 120" aria-hidden="true">
      <defs>
        <linearGradient id="cursor-dot-rainbow" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#ff3b30" />
          <stop offset="35%" stopColor="#34c759" />
          <stop offset="70%" stopColor="#00c7ff" />
          <stop offset="100%" stopColor="#ff2d55" />
        </linearGradient>
      </defs>
      <circle cx="60" cy="60" r="8" />
    </svg>
  );
}

export default function BinaryCursor() {
  const itemRefs = useRef([]);
  const targetRef = useRef({ x: START_POS, y: START_POS });
  const trailRef = useRef(
    Array.from({ length: TRAIL_COUNT }, (_, index) => ({
      x: START_POS,
      y: START_POS,
      scale: 1 - (index / TRAIL_COUNT) * 0.8,
      opacity: 1 - (index / TRAIL_COUNT) * 0.7,
    })),
  );
  const animRef = useRef(null);
  const trailItems = useMemo(() => Array.from({ length: TRAIL_COUNT }, (_, index) => index), []);

  useEffect(() => {
    function move(event) {
      targetRef.current.x = event.clientX;
      targetRef.current.y = event.clientY;
    }

    function animate() {
      let targetX = targetRef.current.x;
      let targetY = targetRef.current.y;

      trailRef.current.forEach((point, index) => {
        point.x = lerp(point.x, targetX, 0.35);
        point.y = lerp(point.y, targetY, 0.35);

        const element = itemRefs.current[index];
        if (element) {
          element.style.opacity = point.opacity;
          element.style.transform = `translate3d(calc(${point.x}px - 50%), calc(${point.y}px - 50%), 0) scale(${point.scale})`;
        }

        targetX = point.x;
        targetY = point.y;
      });

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
      {trailItems.map((index) => (
        <div
          key={index}
          ref={(node) => {
            itemRefs.current[index] = node;
          }}
          className={`cursor-trail-item ${index === 0 ? "cursor-trail-head" : ""}`}
        >
          {index === 0 ? <AtomSvg /> : <TrailDot />}
        </div>
      ))}
    </div>
  );
}

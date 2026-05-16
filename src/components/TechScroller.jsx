import React, { useEffect, useRef, useState, useCallback } from "react";

// Tech items with emoji logos (SVG logos would need external files)
const stackItems = [
  { name: "React",      icon: "⚛️",  color: "#61DAFB" },
  { name: "TypeScript", icon: "📘",  color: "#3178C6" },
  { name: "Node.js",    icon: "🟩",  color: "#339933" },
  { name: "Next.js",    icon: "▲",   color: "#ffffff" },
  { name: "Vite",       icon: "⚡",   color: "#646CFF" },
  { name: "Python",     icon: "🐍",  color: "#3776AB" },
  { name: "Rust",       icon: "🦀",  color: "#FF7043" },
  { name: "Go",         icon: "🐹",  color: "#00ADD8" },
  { name: "Docker",     icon: "🐳",  color: "#2496ED" },
  { name: "AWS",        icon: "☁️",  color: "#FF9900" },
  { name: "PostgreSQL", icon: "🐘",  color: "#336791" },
  { name: "Redis",      icon: "🔴",  color: "#DC382D" },
  { name: "GraphQL",    icon: "◈",   color: "#E10098" },
  { name: "C++",        icon: "⚙️",  color: "#00599C" },
  { name: "Java",       icon: "☕",  color: "#ED8B00" },
  { name: "Linux",      icon: "🐧",  color: "#FCC624" },
];

export default function TechScroller() {
  const trackRef = useRef(null);
  const animRef = useRef(null);
  const stateRef = useRef({
    offset: 0,
    velocity: -1.2,          // negative = left scroll
    paused: false,
    dragging: false,
    dragStartX: 0,
    dragStartOffset: 0,
    collapsed: false,
    collapseProgress: 0,
    positions: [],            // for collapse animation
  });
  const [collapsed, setCollapsed] = useState(false);
  const holdTimerRef = useRef(null);

  const items = [...stackItems, ...stackItems, ...stackItems]; // triple for seamless loop

  // Main animation loop
  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    const ITEM_W = 160; // approximate width of each item
    const TOTAL = stackItems.length * ITEM_W;

    function loop() {
      const s = stateRef.current;

      if (!s.paused && !s.dragging && !s.collapsed) {
        // Rubber-band decay: velocity drifts toward -1.2 (left)
        s.velocity += (-1.2 - s.velocity) * 0.04;
        s.offset += s.velocity;

        // Seamless wrap
        if (Math.abs(s.offset) >= TOTAL) {
          s.offset = s.offset % TOTAL;
        }
      }

      if (!s.collapsed) {
        track.style.transform = `translateX(${s.offset}px)`;
      }

      animRef.current = requestAnimationFrame(loop);
    }

    animRef.current = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(animRef.current);
  }, []);

  // Pause on hover
  const onMouseEnter = () => { stateRef.current.paused = true; };
  const onMouseLeave = () => {
    stateRef.current.paused = false;
    // Give it a push back to normal speed
    stateRef.current.velocity = -1.2;
  };

  // Drag (rubber-band push)
  const onPointerDown = useCallback((e) => {
    const s = stateRef.current;
    s.dragging = true;
    s.dragStartX = e.clientX;
    s.dragStartOffset = s.offset;
    trackRef.current?.setPointerCapture(e.pointerId);

    // Hold timer for collapse
    holdTimerRef.current = setTimeout(() => {
      s.collapsed = true;
      setCollapsed(true);
    }, 600);
  }, []);

  const onPointerMove = useCallback((e) => {
    const s = stateRef.current;
    if (!s.dragging) return;
    const delta = e.clientX - s.dragStartX;
    s.offset = s.dragStartOffset + delta;
    s.velocity = delta * 0.05; // carry momentum from drag speed
  }, []);

  const onPointerUp = useCallback((e) => {
    const s = stateRef.current;
    s.dragging = false;
    clearTimeout(holdTimerRef.current);

    if (s.collapsed) {
      s.collapsed = false;
      setCollapsed(false);
    }
  }, []);

  return (
    <section className="stack-strip">
      <div className="stack-strip-head">
        <p className="eyebrow">tech stack</p>
        <span className="stack-hint">hover to pause · drag to push · hold to collect</span>
      </div>

      <div className="stack-track-wrapper">
        <div
          className={`stack-track-inner ${collapsed ? "collapsed" : ""}`}
          onMouseEnter={onMouseEnter}
          onMouseLeave={onMouseLeave}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onPointerCancel={onPointerUp}
          style={{ cursor: "grab" }}
        >
          <div ref={trackRef} className="stack-track-moving">
            {items.map((item, idx) => (
              <div
                key={`${item.name}-${idx}`}
                className="stack-chip"
                style={{ 
                  "--chip-color": item.color,
                  "--angle": `${(idx % stackItems.length) * (360 / stackItems.length)}deg`
                }}
              >
                <span className="chip-icon">{item.icon}</span>
                <span className="chip-name">{item.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

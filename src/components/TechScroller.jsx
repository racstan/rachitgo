import React, { useEffect, useRef, useState, useCallback } from "react";

const stackItems = [
  { name: "React",      iconUrl: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/react/react-original.svg", color: "#61DAFB" },
  { name: "TypeScript", iconUrl: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/typescript/typescript-original.svg", color: "#3178C6" },
  { name: "Node.js",    iconUrl: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/nodejs/nodejs-original.svg", color: "#339933" },
  { name: "Next.js",    iconUrl: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/nextjs/nextjs-original.svg", color: "#ffffff" },
  { name: "Vite",       iconUrl: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/vitejs/vitejs-original.svg", color: "#646CFF" },
  { name: "Python",     iconUrl: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/python/python-original.svg", color: "#3776AB" },
  { name: "Rust",       iconUrl: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/rust/rust-original.svg", color: "#FF7043" },
  { name: "Go",         iconUrl: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/go/go-original.svg", color: "#00ADD8" },
  { name: "Docker",     iconUrl: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/docker/docker-original.svg", color: "#2496ED" },
  { name: "AWS",        iconUrl: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/amazonwebservices/amazonwebservices-original-wordmark.svg", color: "#FF9900" },
  { name: "PostgreSQL", iconUrl: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/postgresql/postgresql-original.svg", color: "#336791" },
  { name: "Redis",      iconUrl: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/redis/redis-original.svg", color: "#DC382D" },
  { name: "GraphQL",    iconUrl: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/graphql/graphql-plain.svg", color: "#E10098" },
  { name: "C++",        iconUrl: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/cplusplus/cplusplus-original.svg", color: "#00599C" },
  { name: "Java",       iconUrl: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/java/java-original.svg", color: "#ED8B00" },
  { name: "Linux",      iconUrl: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/linux/linux-original.svg", color: "#FCC624" },
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

    // Dynamically calculate exact width of one set of items
    const TOTAL = track.scrollWidth / 3;

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
                <img src={item.iconUrl} alt={item.name} className="chip-icon-img" />
                <span className="chip-name">{item.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

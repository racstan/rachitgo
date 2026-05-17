import React, { useEffect, useRef, useCallback } from "react";

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
    velocity: -0.7,          // negative = left scroll
    targetSpeed: -0.7,
    dragging: false,
    lastX: 0,
    lastTime: 0,
  });

  const items = [...stackItems, ...stackItems]; // double for seamless loop

  // Main animation loop
  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    // Dynamically calculate exact width of one set of items
    const TOTAL = track.scrollWidth / 2;

    function loop() {
      const s = stateRef.current;

      if (!s.dragging) {
        // Elastic drift back to target speed
        s.velocity += (s.targetSpeed - s.velocity) * 0.05;
        s.offset += s.velocity;
      }

      // Seamless wrap
      if (s.offset <= -TOTAL) s.offset += TOTAL;
      if (s.offset > 0) s.offset -= TOTAL;

      track.style.transform = `translateX(${s.offset}px)`;

      animRef.current = requestAnimationFrame(loop);
    }

    animRef.current = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(animRef.current);
  }, []);

  // Slow on hover
  const onMouseEnter = () => {
    stateRef.current.targetSpeed = -0.18;
  };
  const onMouseLeave = () => {
    stateRef.current.targetSpeed = -0.7;
  };

  // Drag (rubber-band push)
  const onPointerDown = useCallback((e) => {
    const s = stateRef.current;
    s.dragging = true;
    s.lastX = e.clientX;
    s.lastTime = performance.now();
    trackRef.current?.setPointerCapture(e.pointerId);
  }, []);

  const onPointerMove = useCallback((e) => {
    const s = stateRef.current;
    if (!s.dragging) return;
    const now = performance.now();
    const delta = e.clientX - s.lastX;
    const dt = Math.max(now - s.lastTime, 16);
    s.offset += delta;
    s.velocity = (delta / dt) * 16;
    s.lastX = e.clientX;
    s.lastTime = now;
  }, []);

  const onPointerUp = useCallback((e) => {
    const s = stateRef.current;
    s.dragging = false;
    trackRef.current?.releasePointerCapture(e.pointerId);
  }, []);

  return (
    <section className="stack-strip">
      <div className="stack-strip-head">
        <p className="eyebrow">tech stack</p>
      </div>

      <div className="stack-track-wrapper">
        <div
          className="stack-track-inner"
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
                title={item.name}
                style={{ 
                  "--chip-color": item.color,
                  "--angle": `${(idx % stackItems.length) * (360 / stackItems.length)}deg`
                }}
              >
                <img src={item.iconUrl} alt={item.name} className="chip-icon-img" draggable="false" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

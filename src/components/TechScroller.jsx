import React, { useEffect, useRef, useCallback, useState } from "react";
import { Link } from "react-router-dom";

export const stackItems = [
  {
    name: "Laravel",
    iconUrl: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/laravel/laravel-original.svg",
    color: "#FF2D20",
    summary: "The backbone of everything I ship.",
    experience: "DoctlySuite runs on Laravel — multi-tenant workspaces, HIPAA-compliant audit trails, Eloquent ORM with custom scopes, and queue-driven AI pipelines. It's my most productive framework.",
  },
  {
    name: "PHP",
    iconUrl: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/php/php-original.svg",
    color: "#777BB4",
    summary: "Underrated and battle-tested.",
    experience: "PHP 8.x powers all my backend work — named arguments, enums, fibers, and match expressions. People joke about PHP; I ship products with it.",
  },
  {
    name: "React",
    iconUrl: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/react/react-original.svg",
    color: "#61DAFB",
    summary: "Where interfaces come alive.",
    experience: "This portfolio is built in React 19. I use it for everything from clinical dashboards to interactive data visualizations — component composition, hooks, lazy loading, and canvas integrations.",
  },
  {
    name: "TypeScript",
    iconUrl: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/typescript/typescript-original.svg",
    color: "#3178C6",
    summary: "JavaScript, but you can sleep at night.",
    experience: "Strict typing across frontends and APIs. Generics for reusable components, discriminated unions for state machines, and zod for runtime validation. Fewer bugs, faster refactors.",
  },
  {
    name: "Node.js",
    iconUrl: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/nodejs/nodejs-original.svg",
    color: "#339933",
    summary: "The Swiss Army knife of backends.",
    experience: "API servers, CLI tools, build scripts, and automation pipelines. Node handles the glue work between systems — and it does it fast.",
  },
  {
    name: "Python",
    iconUrl: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/python/python-original.svg",
    color: "#3776AB",
    summary: "From ML pipelines to quick scripts.",
    experience: "Used Python for AFib detection research (PyTorch, Scikit-learn, SciPy), data analytics at JPMC, and everyday automation. It's the first tool I reach for when exploring an idea.",
  },
  {
    name: "Tailwind",
    iconUrl: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/tailwindcss/tailwindcss-original.svg",
    color: "#38BDF8",
    summary: "Design at the speed of thought.",
    experience: "Utility-first CSS for rapid prototyping and production UIs. Combined with CSS custom properties for theming, it lets me go from wireframe to polished interface in hours, not days.",
  },
  {
    name: "Docker",
    iconUrl: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/docker/docker-original.svg",
    color: "#2496ED",
    summary: "Works on my machine — and yours.",
    experience: "Multi-stage builds, docker-compose for local dev stacks, and containerized CI/CD pipelines. Every project I build runs identically from laptop to production.",
  },
  {
    name: "AWS",
    iconUrl: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/amazonwebservices/amazonwebservices-original-wordmark.svg",
    color: "#FF9900",
    summary: "The cloud I deploy to.",
    experience: "EC2, RDS, S3, CloudFront, Lambda — I use AWS for hosting, storage, serverless functions, and CDN delivery. It's the infrastructure behind my production deployments.",
  },
  {
    name: "Azure",
    iconUrl: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/azure/azure-original.svg",
    color: "#0078D4",
    summary: "AI-certified and cloud-fluent.",
    experience: "Certified in Azure AI Fundamentals (AI-900). Comfortable with Azure's cognitive services, identity management, and cloud architecture patterns.",
  },
  {
    name: "GCP",
    iconUrl: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/googlecloud/googlecloud-original.svg",
    color: "#4285F4",
    summary: "ML-first cloud thinking.",
    experience: "Completed GCP ML Fundamentals certification. Familiar with Vertex AI, BigQuery, and cloud-native ML workflows for model training and deployment.",
  },
  {
    name: "MySQL",
    iconUrl: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/mysql/mysql-original.svg",
    color: "#4479A1",
    summary: "The relational workhorse.",
    experience: "Designed schemas for clinical workflows, financial analytics, and telemetry dashboards. Custom indices, query optimization, and MySQL for BI certification under my belt.",
  },
  {
    name: "PostgreSQL",
    iconUrl: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/postgresql/postgresql-original.svg",
    color: "#336791",
    summary: "When MySQL isn't enough.",
    experience: "DoctlySuite uses PostgreSQL for its multi-tenant architecture — JSONB columns, full-text search, row-level security, and advanced indexing for sub-220ms query latency.",
  },
  {
    name: "Firebase",
    iconUrl: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/firebase/firebase-original.svg",
    color: "#FFCA28",
    summary: "Instant backends for experiments.",
    experience: "Firestore, Auth, and Cloud Functions for rapid prototyping. When I need a backend in 30 minutes, Firebase is where I start.",
  },
  {
    name: "Linux",
    iconUrl: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/linux/linux-original.svg",
    color: "#FCC624",
    summary: "My daily operating system.",
    experience: "I develop on Linux every day — Bash scripting, systemd services, SSH tunneling, Nginx configuration, and server administration. It's not just a tool, it's home.",
  },
];

export function stackSlug(name) {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

function getHoverPosition(target, container) {
  const chipRect = target.getBoundingClientRect();
  const containerRect = container.getBoundingClientRect();
  return {
    x: chipRect.left - containerRect.left + chipRect.width / 2,
    y: chipRect.top - containerRect.top,
  };
}

export default function TechScroller() {
  const wrapperRef = useRef(null);
  const trackRef = useRef(null);
  const itemRefs = useRef([]);
  const popoverRef = useRef(null);
  const animRef = useRef(null);
  const [hovered, setHovered] = useState(null);
  const hoveredRef = useRef(null);
  const isHoveringCardRef = useRef(false);
  const stateRef = useRef({
    offset: 0,
    velocity: -0.28,
    targetSpeed: -0.28,
    dragging: false,
    lastX: 0,
    lastTime: 0,
  });

  const items = [...stackItems, ...stackItems];

  function movePopover(idx) {
    const wrapper = wrapperRef.current;
    const popover = popoverRef.current;
    const target = itemRefs.current[idx];
    if (!wrapper || !popover || !target) return;
    const pos = getHoverPosition(target, wrapper);
    popover.style.left = `${pos.x}px`;
    popover.style.top = `${pos.y}px`;
  }

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    const total = track.scrollWidth / 2;

    function loop() {
      const s = stateRef.current;
      const isPaused = isHoveringCardRef.current || s.dragging || hoveredRef.current?.pinned;

      if (!s.dragging && !isPaused) {
        s.velocity += (s.targetSpeed - s.velocity) * 0.04;
        s.offset += s.velocity;
      } else if (isPaused) {
        s.velocity = 0;
      }

      if (s.offset <= -total) s.offset += total;
      if (s.offset > 0) s.offset -= total;

      track.style.transform = `translateX(${s.offset}px)`;
      if (hoveredRef.current) movePopover(hoveredRef.current.idx);
      animRef.current = requestAnimationFrame(loop);
    }

    animRef.current = requestAnimationFrame(loop);

    function handleDocumentClick(e) {
      if (hoveredRef.current?.pinned) {
        const clickedInsideTrack = trackRef.current?.contains(e.target);
        const clickedInsidePopover = popoverRef.current?.contains(e.target);
        if (!clickedInsideTrack && !clickedInsidePopover) {
          isHoveringCardRef.current = false;
          hoveredRef.current = null;
          setHovered(null);
        }
      }
    }
    document.addEventListener("click", handleDocumentClick);

    return () => {
      cancelAnimationFrame(animRef.current);
      document.removeEventListener("click", handleDocumentClick);
    };
  }, []);

  const onMouseEnter = () => {
    // Keep moving at normal target speed instead of pausing
    stateRef.current.targetSpeed = -0.28;
  };

  const onMouseLeave = () => {
    stateRef.current.targetSpeed = -0.28;
  };

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

  function showChipCard(idx, item, pinned = false) {
    const next = { ...item, idx, pinned };
    hoveredRef.current = next;
    setHovered(next);
    requestAnimationFrame(() => movePopover(idx));
  }

  function togglePinnedCard(idx, item) {
    if (hoveredRef.current?.idx === idx && hoveredRef.current?.pinned) {
      isHoveringCardRef.current = false;
      hoveredRef.current = null;
      setHovered(null);
      return;
    }
    showChipCard(idx, item, true);
  }

  return (
    <section
      id="tech-stack"
      className="stack-strip"
    >
      <div className="stack-strip-head">
        <p className="eyebrow">tech stack</p>
      </div>

      <div 
        className="stack-track-wrapper" 
        ref={wrapperRef}
        onMouseLeave={() => {
          setTimeout(() => {
            if (!isHoveringCardRef.current && !hoveredRef.current?.pinned) {
              hoveredRef.current = null;
              setHovered(null);
            }
          }, 80);
        }}
      >
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
              <button
                key={`${item.name}-${idx}`}
                ref={(node) => {
                  itemRefs.current[idx] = node;
                }}
                className="stack-chip"
                type="button"
                title={item.name}
                onMouseEnter={() => showChipCard(idx, item, false)}
                onFocus={() => showChipCard(idx, item, false)}
                onClick={(event) => {
                  event.stopPropagation();
                  togglePinnedCard(idx, item);
                }}
                onBlur={() => {
                  if (!hoveredRef.current?.pinned && !isHoveringCardRef.current) setHovered(null);
                }}
                aria-expanded={hovered?.idx === idx}
                aria-controls="stack-hover-card"
                style={{ "--chip-color": item.color }}
              >
                <img src={item.iconUrl} alt={item.name} className="chip-icon-img" draggable="false" />
              </button>
            ))}
          </div>
        </div>

        {hovered && (
          <article
            ref={popoverRef}
            id="stack-hover-card"
            className={`stack-hover-card ${hovered.pinned ? "is-pinned" : ""}`}
            style={{ "--chip-color": hovered.color }}
            onMouseEnter={() => {
              isHoveringCardRef.current = true;
            }}
            onMouseLeave={() => {
              isHoveringCardRef.current = false;
              if (!hoveredRef.current?.pinned) {
                hoveredRef.current = null;
                setHovered(null);
              }
            }}
          >
            <strong style={{ color: hovered.color }}>{hovered.name}</strong>
            <p>{hovered.summary}</p>
            <span>{hovered.experience}</span>
            <Link className="stack-expand-link" to={`/stack/${stackSlug(hovered.name)}`}>
              Expand page
            </Link>
          </article>
        )}
      </div>
    </section>
  );
}

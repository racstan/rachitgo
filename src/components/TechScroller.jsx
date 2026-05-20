import React, { useEffect, useRef, useCallback, useState } from "react";
import { Link } from "react-router-dom";

export const stackItems = [
  {
    name: "Laravel",
    iconUrl: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/laravel/laravel-original.svg",
    color: "#FF2D20",
    summary: "Backend product architecture.",
    experience: "Used Laravel for DoctlySuite, building scalable clinical workflows and backend application structure.",
  },
  {
    name: "PHP",
    iconUrl: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/php/php-original.svg",
    color: "#777BB4",
    summary: "Backend application development.",
    experience: "Built server-side features and REST-oriented workflows with PHP and Laravel.",
  },
  {
    name: "React",
    iconUrl: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/react/react-original.svg",
    color: "#61DAFB",
    summary: "Component systems and UI architecture.",
    experience: "Built production React interfaces with reusable components, page-level state, and performance-focused rendering.",
  },
  {
    name: "TypeScript",
    iconUrl: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/typescript/typescript-original.svg",
    color: "#3178C6",
    summary: "Typed UI and API contracts.",
    experience: "Use strict typing for frontends and APIs to reduce runtime bugs and improve developer velocity.",
  },
  {
    name: "Node.js",
    iconUrl: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/nodejs/nodejs-original.svg",
    color: "#339933",
    summary: "APIs, tooling, and automation.",
    experience: "Designed backend services, automation scripts, and build tooling for day-to-day product delivery.",
  },
  {
    name: "Python",
    iconUrl: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/python/python-original.svg",
    color: "#3776AB",
    summary: "Automation and data workflows.",
    experience: "Built scripting and automation utilities for workflows, data handling, and backend prototyping.",
  },
  {
    name: "Tailwind",
    iconUrl: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/tailwindcss/tailwindcss-original.svg",
    color: "#38BDF8",
    summary: "Utility-first UI styling.",
    experience: "Used Tailwind CSS for fast, consistent frontend styling in full-stack projects.",
  },
  {
    name: "Docker",
    iconUrl: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/docker/docker-original.svg",
    color: "#2496ED",
    summary: "Containerized builds and deploys.",
    experience: "Containerized local and production workflows for consistent environments and smoother deployments.",
  },
  {
    name: "AWS",
    iconUrl: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/amazonwebservices/amazonwebservices-original-wordmark.svg",
    color: "#FF9900",
    summary: "Infra, hosting, and cloud tooling.",
    experience: "Worked with AWS as part of cloud-focused full-stack and DevOps practice.",
  },
  {
    name: "Azure",
    iconUrl: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/azure/azure-original.svg",
    color: "#0078D4",
    summary: "Cloud and AI fundamentals.",
    experience: "Certified in Azure AI Fundamentals and comfortable with cloud-backed AI workflows.",
  },
  {
    name: "GCP",
    iconUrl: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/googlecloud/googlecloud-original.svg",
    color: "#4285F4",
    summary: "Cloud and ML fundamentals.",
    experience: "Completed GCP ML Fundamentals and use cloud concepts across product and AI work.",
  },
  {
    name: "MySQL",
    iconUrl: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/mysql/mysql-original.svg",
    color: "#4479A1",
    summary: "Structured relational data.",
    experience: "Used MySQL in data analytics workflows and backend systems; completed MySQL for BI coursework.",
  },
  {
    name: "PostgreSQL",
    iconUrl: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/postgresql/postgresql-original.svg",
    color: "#336791",
    summary: "Relational data and queries.",
    experience: "Comfortable designing relational data flows for backend applications.",
  },
  {
    name: "Firebase",
    iconUrl: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/firebase/firebase-original.svg",
    color: "#FFCA28",
    summary: "App backend services.",
    experience: "Used Firebase as part of database and application backend exploration.",
  },
  {
    name: "Linux",
    iconUrl: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/linux/linux-original.svg",
    color: "#FCC624",
    summary: "Dev environments and servers.",
    experience: "Daily Linux usage across development, server operations, shell automation, and debugging workflows.",
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
    y: chipRect.bottom - containerRect.top,
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
  const isHoveredTrackRef = useRef(false);
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
      const isPaused = hoveredRef.current !== null;

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
    isHoveredTrackRef.current = true;
    stateRef.current.targetSpeed = 0;
  };

  const onMouseLeave = () => {
    isHoveredTrackRef.current = false;
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
      onMouseLeave={() => {
        if (!hoveredRef.current?.pinned) {
          hoveredRef.current = null;
          setHovered(null);
        }
      }}
    >
      <div className="stack-strip-head">
        <p className="eyebrow">tech stack</p>
      </div>

      <div className="stack-track-wrapper" ref={wrapperRef}>
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
                  if (!hoveredRef.current?.pinned) setHovered(null);
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
            onMouseLeave={() => {
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

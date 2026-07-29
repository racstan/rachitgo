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
  {
    name: "vLLM",
    iconUrl: "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%239933FF' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'><rect x='2' y='2' width='20' height='8' rx='2'/><rect x='2' y='14' width='20' height='8' rx='2'/><line x1='6' y1='6' x2='6.01' y2='6'/><line x1='6' y1='18' x2='6.01' y2='18'/><polygon points='13 6 11 10 15 10 13 14 17 14'/></svg>",
    color: "#9933FF",
    summary: "High-throughput LLM serving engine.",
    experience: "Deploys vLLM for high-throughput LLM inference with PagedAttention, batching requests for low-latency production AI execution.",
  },
  {
    name: "LangGraph",
    iconUrl: "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%2300C853' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'><circle cx='18' cy='5' r='3'/><circle cx='6' cy='12' r='3'/><circle cx='18' cy='19' r='3'/><line x1='8.59' y1='13.51' x2='15.42' y2='17.49'/><line x1='15.41' y1='6.51' x2='8.59' y2='10.49'/></svg>",
    color: "#00C853",
    summary: "Cyclic multi-agent workflow orchestration.",
    experience: "Builds stateful, multi-agent AI workflows with LangGraph loops, human-in-the-loop checkpoints, and complex agent graph routing.",
  },
  {
    name: "DSPy",
    iconUrl: "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%23FF6D00' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'><polygon points='12 2 2 7 12 12 22 7 12 2'/><polyline points='2 17 12 22 22 17'/><polyline points='2 12 12 17 22 12'/></svg>",
    color: "#FF6D00",
    summary: "Declarative prompt optimization & compilation.",
    experience: "Uses DSPy to replace manual prompt engineering with compiled, declarative LLM modules and automated teleprompter optimizers.",
  },
  {
    name: "Pydantic",
    iconUrl: "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%23E92063' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'><path d='M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z'/><path d='m9 12 2 2 4-4'/></svg>",
    color: "#E92063",
    summary: "Strict type validation for LLM outputs & schemas.",
    experience: "Enforces structured JSON output parsing, environment settings, and API request payload validation across AI backend services.",
  },
  {
    name: "LlamaIndex",
    iconUrl: "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%23304FFE' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'><path d='M4 19.5A2.5 2.5 0 0 1 6.5 17H20'/><path d='M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z'/><path d='m9 10 2 2 4-4'/></svg>",
    color: "#304FFE",
    summary: "Data framework for LLMs & RAG pipelines.",
    experience: "Connects custom data sources to LLMs using LlamaIndex data connectors, node parsers, and multi-document index retrievers.",
  },
  {
    name: "Docling",
    iconUrl: "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%2300B0FF' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'><path d='M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z'/><polyline points='14 2 14 8 20 8'/><line x1='16' y1='13' x2='8' y2='13'/><line x1='16' y1='17' x2='8' y2='17'/></svg>",
    color: "#00B0FF",
    summary: "Document parsing & structured LLM ingestion.",
    experience: "Parses complex PDFs, tables, and multi-format documents into structured JSON/Markdown for high-precision RAG chunking.",
  },
  {
    name: "BGE-M3",
    iconUrl: "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%23AA00FF' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'><circle cx='12' cy='12' r='10'/><path d='M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20'/><line x1='2' y1='12' x2='22' y2='12'/></svg>",
    color: "#AA00FF",
    summary: "Multi-lingual & multi-functionality vector embeddings.",
    experience: "Leverages BGE-M3 for dense, sparse, and multi-vector representations across long-context retrieval architectures.",
  },
  {
    name: "Qdrant",
    iconUrl: "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%23D50000' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'><rect x='2' y='2' width='20' height='20' rx='5'/><path d='M8 12h8'/><path d='M12 8v8'/></svg>",
    color: "#D50000",
    summary: "High-performance vector search engine & database.",
    experience: "Deploys Qdrant vector databases for fast similarity search, payload filtering, and high-dimensional embedding storage.",
  },
  {
    name: "BGE Reranker",
    iconUrl: "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%23FFAB00' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'><line x1='12' y1='20' x2='12' y2='4'/><polyline points='6 10 12 4 18 10'/></svg>",
    color: "#FFAB00",
    summary: "Cross-encoder re-ranking for RAG context accuracy.",
    experience: "Implements BGE Reranker cross-encoder models to re-order top-k retrieved contexts, drastically boosting RAG precision.",
  },
  {
    name: "Mem0",
    iconUrl: "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%2300E676' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'><path d='M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2zm0 18a8 8 0 1 1 8-8 8 8 0 0 1-8 8z'/><circle cx='12' cy='12' r='3'/></svg>",
    color: "#00E676",
    summary: "Long-term memory layer for AI agents.",
    experience: "Integrates Mem0 for persistent user memory, storing historical preferences and conversation context across LLM sessions.",
  },
  {
    name: "Neo4j",
    iconUrl: "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%23008CC1' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'><circle cx='6' cy='6' r='3'/><circle cx='18' cy='6' r='3'/><circle cx='12' cy='18' r='3'/><line x1='8.5' y1='7.5' x2='10.5' y2='15.5'/><line x1='15.5' y1='7.5' x2='13.5' y2='15.5'/></svg>",
    color: "#008CC1",
    summary: "Graph database for Knowledge Graphs & GraphRAG.",
    experience: "Architects Cypher queries and Neo4j graph schemas to combine graph relationships with vector embeddings in GraphRAG pipelines.",
  },
  {
    name: "Langfuse",
    iconUrl: "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%23FF1744' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'><path d='M22 12h-4l-3 9L9 3l-3 9H2'/></svg>",
    color: "#FF1744",
    summary: "LLM observability, analytics & prompt tracing.",
    experience: "Instruments LLM applications with Langfuse for real-time latency tracing, token cost tracking, and prompt versioning.",
  },
  {
    name: "Redis Semantic Cache",
    iconUrl: "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%23DC382D' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'><ellipse cx='12' cy='5' rx='9' ry='3'/><path d='M21 12c0 1.66-4 3-9 3s-9-1.34-9-3'/><path d='M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5'/></svg>",
    color: "#DC382D",
    summary: "Sub-millisecond vector similarity cache for LLMs.",
    experience: "Uses Redis Vector Similarity Search (VSS) as a semantic cache, bypassing expensive LLM calls for recurring prompt queries.",
  },
  {
    name: "Ragas",
    iconUrl: "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%23651FFF' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'><path d='M3 3v18h18'/><path d='m19 9-5 5-4-4-3 3'/></svg>",
    color: "#651FFF",
    summary: "Evaluation framework for RAG pipelines & LLMs.",
    experience: "Evaluates RAG context precision, faithfulness, context recall, and answer relevancy using Ragas metric test suites.",
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
      const isSwitching = document.documentElement.dataset.themeSwitching === "true";
      if (isSwitching && hoveredRef.current) {
        isHoveringCardRef.current = false;
        hoveredRef.current = null;
        setHovered(null);
      }
      const isPaused = isHoveringCardRef.current || s.dragging || hoveredRef.current?.pinned || isSwitching;

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

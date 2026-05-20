import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import TiltCard from "./TiltCard.jsx";
import WaveText from "./WaveText.jsx";
import { journeyTimeline } from "../data/profile.js";
import { stackItems, stackSlug } from "./TechScroller.jsx";

export const timelineData = journeyTimeline;

function getMatchedStackItem(tag) {
  const slug = tag.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
  // Try exact name or slug matches
  let matched = stackItems.find(s => stackSlug(s.name) === slug || s.name.toLowerCase() === tag.toLowerCase());
  if (matched) return matched;
  
  // Custom mappings for other common forms
  if (slug === "react-js" || slug === "react") return stackItems.find(s => s.name === "React");
  if (slug === "tailwind-css" || slug === "tailwind") return stackItems.find(s => s.name === "Tailwind");
  if (slug === "node-js" || slug === "node") return stackItems.find(s => s.name === "Node.js");
  if (slug === "mysql") return stackItems.find(s => s.name === "MySQL");
  if (slug === "postgresql" || slug === "postgres") return stackItems.find(s => s.name === "PostgreSQL");
  if (slug === "firebase") return stackItems.find(s => s.name === "Firebase");
  if (slug === "linux") return stackItems.find(s => s.name === "Linux");
  if (slug === "aws" || slug === "cloud") return stackItems.find(s => s.name === "AWS");
  if (slug === "azure" || slug === "ai") return stackItems.find(s => s.name === "Azure");
  if (slug === "gcp") return stackItems.find(s => s.name === "GCP");
  
  return null;
}

export default function Timeline({ items }) {
  const data = items || timelineData;
  const rowRefs = useRef([]);
  const containerRef = useRef(null);
  const branchRef = useRef(null);
  const [expanded, setExpanded] = useState(null);
  const [activeTag, setActiveTag] = useState(null); // { rowIndex: number, tagName: string, item: any }
  const digits = Math.max(5, data.length.toString(2).length);

  useEffect(() => {
    function handleDocClick(e) {
      if (activeTag) {
        const clickedInsideTags = e.target.closest(".timeline-tags");
        if (!clickedInsideTags) {
          setActiveTag(null);
        }
      }
    }
    document.addEventListener("click", handleDocClick);
    return () => document.removeEventListener("click", handleDocClick);
  }, [activeTag]);

  useEffect(() => {
    const rows = rowRefs.current.filter(Boolean);
    if (!rows.length) return undefined;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
          } else {
            entry.target.classList.remove("is-visible");
          }
        });
      },
      { threshold: 0.2, rootMargin: "0px 0px -10% 0px" },
    );

    rows.forEach((row) => observer.observe(row));
    return () => observer.disconnect();
  }, [data.length]);

  useEffect(() => {
    const container = containerRef.current;
    const branch = branchRef.current;
    if (!container || !branch) return undefined;
    let frame = null;

    const updateBranch = () => {
      const rect = container.getBoundingClientRect();
      const total = rect.height;
      const visible = Math.min(Math.max(window.innerHeight - rect.top, 0), total);
      const progress = total > 0 ? visible / total : 0;
      branch.style.transform = `scaleY(${progress})`;
    };

    const onScroll = () => {
      if (frame) return;
      frame = requestAnimationFrame(() => {
        frame = null;
        updateBranch();
      });
    };

    updateBranch();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (frame) cancelAnimationFrame(frame);
    };
  }, [data.length]);
  return (
    <div className="timeline-container" ref={containerRef}>
      <div className="timeline-branch" ref={branchRef} />
      {data.map((item, i) => {
        const canExpand = item.desc.length > 160;
        const indexLabel = (i + 1).toString(2).padStart(digits, "0");
        return (
          <div
            key={i}
            className="timeline-row"
            ref={(el) => {
              rowRefs.current[i] = el;
            }}
          >
            <div className="timeline-node">
              <span className="timeline-index" aria-hidden="true">{indexLabel}</span>
              <div className="timeline-dot-inner" style={{ borderColor: item.color, background: `${item.color}22` }} />
            </div>
            <TiltCard className={`timeline-content ${expanded === i ? "is-expanded" : ""}`} color={item.color}>
              <div className="timeline-header">
                <span className="timeline-role"><WaveText text={item.role} /></span>
                <span className="timeline-year">{item.year}</span>
              </div>
              <div className="timeline-company">{item.company}</div>
              <p className={`timeline-desc ${canExpand ? "expandable-text" : ""}`}>{item.desc}</p>
              
              <div className="timeline-tags" style={{ position: "relative" }}>
                {item.tags.map((t) => {
                  const matched = getMatchedStackItem(t);
                  if (matched) {
                    return (
                      <button
                        key={t}
                        type="button"
                        className="timeline-tag is-interactive"
                        style={{
                          borderColor: `${item.color}88`,
                          color: item.color,
                          cursor: "pointer",
                          background: "var(--panel-2)",
                          borderStyle: "dashed"
                        }}
                        onClick={(event) => {
                          event.stopPropagation();
                          if (activeTag && activeTag.rowIndex === i && activeTag.tagName === t) {
                            setActiveTag(null);
                          } else {
                            setActiveTag({ rowIndex: i, tagName: t, item: matched });
                          }
                        }}
                      >
                        {t}
                      </button>
                    );
                  }
                  return (
                    <span key={t} className="timeline-tag" style={{ borderColor: `${item.color}55`, color: item.color }}>
                      {t}
                    </span>
                  );
                })}

                {/* Popover Card for this specific tag/Row */}
                {activeTag && activeTag.rowIndex === i && (
                  <article
                    className="stack-hover-card is-pinned"
                    style={{
                      "--chip-color": activeTag.item.color,
                      position: "absolute",
                      left: "50%",
                      top: "calc(100% + 4px)",
                      transform: "translateX(-50%)",
                      zIndex: 100,
                      pointerEvents: "auto",
                      display: "block"
                    }}
                  >
                    <div style={{
                      position: "absolute",
                      top: "-8px",
                      left: "50%",
                      transform: "translateX(-50%) rotate(45deg)",
                      width: "16px",
                      height: "16px",
                      borderLeft: "1px solid var(--glass-border)",
                      borderTop: "1px solid var(--glass-border)",
                      background: "var(--glass-body)",
                      boxShadow: "inset 0 1px 0 var(--glass-highlight)"
                    }} />

                    <strong style={{ color: activeTag.item.color }}>{activeTag.item.name}</strong>
                    <p>{activeTag.item.summary}</p>
                    <span style={{ fontSize: "12px", color: "var(--text)", marginTop: "6px" }}>{activeTag.item.experience}</span>
                    <Link className="stack-expand-link" to={`/stack/${stackSlug(activeTag.item.name)}`}>
                      Expand page
                    </Link>
                  </article>
                )}
              </div>

              {canExpand && (
                <button
                  type="button"
                  className="timeline-expand"
                  onClick={(event) => {
                    event.stopPropagation();
                    setExpanded((value) => (value === i ? null : i));
                  }}
                >
                  {expanded === i ? "Collapse" : "Click to expand"}
                </button>
              )}
            </TiltCard>
          </div>
        );
      })}
    </div>
  );
}

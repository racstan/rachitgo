import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import TiltCard from "./TiltCard.jsx";
import WaveText from "./WaveText.jsx";
import { journeyTimeline } from "../data/profile.js";
import { stackItems, stackSlug } from "./TechScroller.jsx";

export const timelineData = journeyTimeline;

function getMatchedStackItem(tag) {
  const slug = tag.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
  let matched = stackItems.find(s => stackSlug(s.name) === slug || s.name.toLowerCase() === tag.toLowerCase());
  if (matched) return matched;
  
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
  const [expanded, setExpanded] = useState(null);
  const [activeTag, setActiveTag] = useState(null);
  const [activeIndex, setActiveIndex] = useState(0);
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
    const container = containerRef.current;
    if (!container) return undefined;

    function handleScroll() {
      if (document.documentElement.dataset.themeSwitching === "true") return;

      const rect = container.getBoundingClientRect();
      const containerTop = rect.top + window.scrollY;

      const rows = rowRefs.current.filter(Boolean);
      if (rows.length === 0) return;

      const firstNode = rows[0].querySelector(".timeline-node");
      const lastNode = rows[rows.length - 1].querySelector(".timeline-node");

      if (firstNode && lastNode) {
        const firstNodeRect = firstNode.getBoundingClientRect();
        const lastNodeRect = lastNode.getBoundingClientRect();

        const startY = firstNodeRect.top + window.scrollY + firstNodeRect.height / 2;
        const endY = lastNodeRect.top + window.scrollY + lastNodeRect.height / 2;

        const conduit = container.querySelector(".timeline-conduit");
        if (conduit) {
          conduit.style.top = `${startY - containerTop}px`;
          conduit.style.height = `${endY - startY}px`;
        }

        const sweepY = window.scrollY + window.innerHeight * 0.55;
        let pct = (sweepY - startY) / (endY - startY);
        pct = Math.min(Math.max(pct, 0), 1);

        const fill = container.querySelector(".comet-fill");
        if (fill) {
          fill.style.height = `${pct * 100}%`;
        }

        let closestIdx = 0;
        let minDistance = Infinity;
        rows.forEach((row, idx) => {
          const rowRect = row.getBoundingClientRect();
          const rowCenter = rowRect.top + window.scrollY + rowRect.height / 2;
          const dist = Math.abs(rowCenter - sweepY);
          if (dist < minDistance) {
            minDistance = dist;
            closestIdx = idx;
          }
        });

        setActiveIndex(closestIdx);
      }
    }

    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", handleScroll);
    
    // Trigger layout sync
    const timer = setTimeout(handleScroll, 100);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleScroll);
      clearTimeout(timer);
    };
  }, [data.length]);

  return (
    <div className="timeline-container" ref={containerRef}>
      {/* Central progress track matching Mattaniah-Tantero pen effect */}
      <div className="timeline-conduit">
        <div className="comet-fill">
          <div className="comet-spark" />
        </div>
      </div>

      {data.map((item, i) => {
        const canExpand = item.desc.length > 160;
        const indexLabel = (i + 1).toString(2).padStart(digits, "0");
        const isActive = activeIndex === i;
        const isLeft = i % 2 === 0;

        const cardContent = (
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

              {/* Popover Card for clicked tags */}
              {activeTag && activeTag.rowIndex === i && (
                <article
                  className="stack-hover-card is-pinned"
                  style={{
                    "--chip-color": activeTag.item.color,
                    position: "absolute",
                    left: "50%",
                    top: "calc(100% + 8px)",
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
        );

        return (
          <div
            key={i}
            className={`timeline-row ${isActive ? "active" : ""} ${isLeft ? "row-left" : "row-right"}`}
            ref={(el) => {
              rowRefs.current[i] = el;
            }}
          >
            {/* Left Column (Card for even, empty for odd) */}
            <div className="timeline-col col-left">
              {isLeft && cardContent}
            </div>

            {/* Central Node sphere matching Mattaniah-Tantero pulse ripples */}
            <div className="timeline-node">
              <span className="timeline-index" aria-hidden="true">{indexLabel}</span>
              <div 
                className="timeline-sphere" 
                style={{ 
                  borderColor: item.color,
                  boxShadow: isActive ? `0 0 16px ${item.color}` : "none",
                  backgroundColor: isActive ? `${item.color}22` : "var(--bg)"
                }}
              >
                <div className="sphere-pulse" style={{ borderColor: item.color }} />
              </div>
            </div>

            {/* Right Column (Card for odd, empty for even) */}
            <div className="timeline-col col-right">
              {!isLeft && cardContent}
            </div>
          </div>
        );
      })}
    </div>
  );
}

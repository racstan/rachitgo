import React, { useEffect, useRef, useState } from "react";
import TiltCard from "./TiltCard.jsx";
import WaveText from "./WaveText.jsx";
import { journeyTimeline } from "../data/profile.js";

export const timelineData = journeyTimeline;

export default function Timeline({ items }) {
  const data = items || timelineData;
  const rowRefs = useRef([]);
  const containerRef = useRef(null);
  const branchRef = useRef(null);
  const [expanded, setExpanded] = useState(null);
  const digits = Math.max(5, data.length.toString(2).length);

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
              <div className="timeline-tags">
                {item.tags.map((t) => (
                  <span key={t} className="timeline-tag" style={{ borderColor: `${item.color}55`, color: item.color }}>{t}</span>
                ))}
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

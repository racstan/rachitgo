import React, { useEffect, useRef } from "react";
import TiltCard from "./TiltCard.jsx";
import WaveText from "./WaveText.jsx";
import { journeyTimeline } from "../data/profile.js";

export const timelineData = journeyTimeline;

export default function Timeline({ items }) {
  const data = items || timelineData;
  const rowRefs = useRef([]);

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
  return (
    <div className="timeline-container">
      <div className="timeline-branch" />
      {data.map((item, i) => (
        <div
          key={i}
          className="timeline-row"
          ref={(el) => {
            rowRefs.current[i] = el;
          }}
        >
          <div className="timeline-node">
            <div className="timeline-dot-inner" style={{ borderColor: item.color, background: `${item.color}22` }} />
          </div>
          <TiltCard className="timeline-content" color={item.color}>
            <div className="timeline-header">
              <span className="timeline-role"><WaveText text={item.role} /></span>
              <span className="timeline-year">{item.year}</span>
            </div>
            <div className="timeline-company">{item.company}</div>
            <p className="timeline-desc expandable-text">{item.desc}</p>
            <div className="timeline-tags">
              {item.tags.map((t) => (
                <span key={t} className="timeline-tag" style={{ borderColor: `${item.color}55`, color: item.color }}>{t}</span>
              ))}
            </div>
          </TiltCard>
        </div>
      ))}
    </div>
  );
}

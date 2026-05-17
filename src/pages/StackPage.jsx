import React from "react";
import { Link, useParams } from "react-router-dom";
import HoverTypingText from "../components/HoverTypingText.jsx";
import TiltCard from "../components/TiltCard.jsx";
import { stackItems, stackSlug } from "../components/TechScroller.jsx";

export default function StackPage() {
  const { slug } = useParams();
  const item = stackItems.find((entry) => stackSlug(entry.name) === slug) ?? stackItems[0];

  return (
    <section className="page stack-detail-page">
      <Link className="back-link" to="/">Back to portfolio</Link>
      <div className="section-head">
        <p className="eyebrow">tech stack detail</p>
        <HoverTypingText
          element="h2"
          variants={[
            `My work with ${item.name}`,
            `${item.name} in practice`,
            `How I use ${item.name}`,
            `${item.name} experience`,
          ]}
        />
      </div>

      <TiltCard className="stack-detail-card" color={item.color}>
        <div className="stack-detail-icon" style={{ "--chip-color": item.color }}>
          <img src={item.iconUrl} alt={item.name} draggable="false" />
        </div>
        <div>
          <span className="stack-detail-kicker" style={{ color: item.color }}>{item.summary}</span>
          <h3>{item.name}</h3>
          <p>{item.experience}</p>
          <p>
            This page is intentionally separate so each stack item can grow into a deeper portfolio proof page with
            screenshots, project links, implementation notes, and outcomes.
          </p>
        </div>
      </TiltCard>
    </section>
  );
}

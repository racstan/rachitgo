import React from "react";
import TiltCard from "../components/TiltCard.jsx";
import HoverTypingText from "../components/HoverTypingText.jsx";
import Timeline from "../components/Timeline.jsx";
import { journeyTimeline, skillGroups } from "../data/profile.js";

export default function ExperiencePage() {
  return (
    <section className="page experience-page">
      <div className="section-head">
        <p className="eyebrow">my journey</p>
        <HoverTypingText
          element="h2"
          variants={[
            "My path in technology.",
            "The road to shipping.",
            "How the story unfolded.",
            "Timeline of growth.",
            "Building through the years.",
          ]}
        />
      </div>

      <Timeline items={journeyTimeline} variant="alternating" />
    </section>
  );
}

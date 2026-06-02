import React from "react";

function splitGraphemes(value) {
  if (typeof Intl !== "undefined" && Intl.Segmenter) {
    const segmenter = new Intl.Segmenter(undefined, { granularity: "grapheme" });
    return Array.from(segmenter.segment(value), (part) => part.segment);
  }
  return Array.from(value);
}

export default function WaveText({ text, className = "", getWordClassName }) {
  return (
    <span className={`name-group ${className}`} style={{ display: "inline-flex", flexWrap: "wrap", gap: "0.25em" }}>
      {text.split(" ").map((word, wIdx) => {
        const wordClass = getWordClassName ? getWordClassName(word, wIdx) : "";
        const wordClasses = ["wave-word", wordClass].filter(Boolean).join(" ");
        return (
        <span key={wIdx} className={wordClasses} style={{ display: "inline-flex" }}>
          {splitGraphemes(word).map((char, cIdx) => (
            <span key={cIdx} className="name-char">{char}</span>
          ))}
        </span>
        );
      })}
    </span>
  );
}

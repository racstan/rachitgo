import React from "react";
import WaveText from "./WaveText.jsx";

function splitLines(text) {
  return text.split("\n");
}

export default function HoverTypingText({
  variants,
  className = "",
  element = "span",
  getWordClassName,
}) {
  const texts = variants && variants.length ? variants : [""];
  const maxLines = Math.max(...texts.map((value) => splitLines(value).length));
  const Component = element;
  const displayText = texts[0] ?? "";

  return (
    <Component
      className={`hover-typing ${className}`}
      style={{ minHeight: `${maxLines * 1.22}em` }}
    >
      {splitLines(displayText).map((line, idx) => (
        <span key={`${line}-${idx}`} className="hover-typing-line hover-typing-live">
          <WaveText text={line} getWordClassName={getWordClassName} />
        </span>
      ))}
    </Component>
  );
}

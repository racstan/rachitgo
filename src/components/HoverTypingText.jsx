import React, { useEffect, useRef, useState } from "react";
import WaveText from "./WaveText.jsx";

function splitLines(text) {
  return text.split("\n");
}

export default function HoverTypingText({
  variants,
  className = "",
  element = "span",
}) {
  const texts = variants && variants.length ? variants : [""];
  const maxLines = Math.max(...texts.map((value) => splitLines(value).length));
  const [position, setPosition] = useState(0);
  const [displayIndex, setDisplayIndex] = useState(0);
  const [dragging, setDragging] = useState(false);
  const rootRef = useRef(null);
  const Component = element;

  function updateFromClientX(clientX) {
    const node = rootRef.current;
    if (!node) return;
    const rect = node.getBoundingClientRect();
    const nextPosition = Math.min(1, Math.max(0, (clientX - rect.left) / rect.width));
    const nextIndex = Math.round(nextPosition * (texts.length - 1));
    setPosition(nextPosition);
    setDisplayIndex(nextIndex);
  }

  useEffect(() => {
    if (!dragging) return undefined;

    function onMove(event) {
      updateFromClientX(event.clientX);
    }

    function onUp() {
      const snapped = position >= 0.5 ? 1 : 0;
      setPosition(snapped);
      setDisplayIndex(snapped === 1 ? texts.length - 1 : 0);
      setDragging(false);
    }

    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp, { once: true });
    return () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
    };
  }, [dragging, position, texts.length]);

  const displayText = texts[displayIndex] ?? texts[0];

  return (
    <Component
      ref={rootRef}
      className={`hover-typing heading-scrubber ${dragging ? "is-dragging" : ""} ${className}`}
      style={{ minHeight: `${maxLines * 1.22}em`, "--scrub-x": position }}
    >
      {splitLines(displayText).map((line, idx) => (
        <span key={`${line}-${idx}`} className="hover-typing-line hover-typing-live">
          <WaveText text={line} />
        </span>
      ))}
      <span
        className="heading-scrubber-handle"
        role="slider"
        aria-label="Change heading text"
        aria-valuemin={0}
        aria-valuemax={texts.length - 1}
        aria-valuenow={displayIndex}
        tabIndex={0}
        onPointerDown={(event) => {
          event.preventDefault();
          setDragging(true);
          updateFromClientX(event.clientX);
        }}
        onKeyDown={(event) => {
          if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") return;
          event.preventDefault();
          const delta = event.key === "ArrowRight" ? 1 : -1;
          const nextIndex = Math.min(texts.length - 1, Math.max(0, displayIndex + delta));
          setDisplayIndex(nextIndex);
          setPosition(texts.length <= 1 ? 0 : nextIndex / (texts.length - 1));
        }}
      />
    </Component>
  );
}

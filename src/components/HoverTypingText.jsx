import React, { useEffect, useRef, useState } from "react";

function splitLines(text) {
  return text.split("\n");
}

function splitChars(text) {
  if (typeof Intl !== "undefined" && Intl.Segmenter) {
    const segmenter = new Intl.Segmenter(undefined, { granularity: "grapheme" });
    return Array.from(segmenter.segment(text), (part) => part.segment);
  }
  return Array.from(text);
}

export default function HoverTypingText({
  variants,
  className = "",
  element = "span",
}) {
  const texts = variants && variants.length ? variants : [""];
  const maxLines = Math.max(...texts.map((value) => splitLines(value).length));
  const [position, setPosition] = useState(0);
  const [targetIndex, setTargetIndex] = useState(1);
  const [dragging, setDragging] = useState(false);
  const rootRef = useRef(null);
  const Component = element;

  function updateFromClientX(clientX) {
    const node = rootRef.current;
    if (!node) return;
    const rect = node.getBoundingClientRect();
    const nextPosition = Math.min(1, Math.max(0, (clientX - rect.left) / rect.width));
    const nextTarget = Math.max(1, Math.min(texts.length - 1, Math.ceil(nextPosition * (texts.length - 1))));
    setPosition(nextPosition);
    setTargetIndex(nextTarget);
  }

  useEffect(() => {
    if (!dragging) return undefined;

    function onMove(event) {
      updateFromClientX(event.clientX);
    }

    function onUp() {
      const snapped = position >= 0.5 ? 1 : 0;
      setPosition(snapped);
      setTargetIndex(snapped === 1 ? texts.length - 1 : 1);
      setDragging(false);
    }

    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp, { once: true });
    return () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
    };
  }, [dragging, position, texts.length]);

  const baseText = texts[0] ?? "";
  const targetText = texts[targetIndex] ?? texts[texts.length - 1] ?? baseText;
  const baseLines = splitLines(baseText);
  const targetLines = splitLines(targetText);
  const maxChars = Math.max(baseText.length, targetText.length, 1);
  const revealCount = Math.round(position * maxChars);

  return (
    <Component
      ref={rootRef}
      className={`hover-typing heading-scrubber ${dragging ? "is-dragging" : ""} ${className}`}
      style={{ minHeight: `${maxLines * 1.22}em`, "--scrub-x": position }}
    >
      {Array.from({ length: maxLines }, (_, lineIndex) => {
        const baseChars = splitChars(baseLines[lineIndex] ?? "");
        const targetChars = splitChars(targetLines[lineIndex] ?? "");
        const lineOffset = baseLines.slice(0, lineIndex).join("").length + lineIndex;
        const maxLineChars = Math.max(baseChars.length, targetChars.length);

        return (
          <span key={lineIndex} className="hover-typing-line hover-typing-live">
            {Array.from({ length: maxLineChars }, (_, charIndex) => {
              const globalIndex = lineOffset + charIndex;
              const useTarget = globalIndex < revealCount;
              const char = (useTarget ? targetChars[charIndex] : baseChars[charIndex]) ?? " ";
              return (
                <span key={`${lineIndex}-${charIndex}`} className="heading-scrub-char name-char">
                  {char === " " ? "\u00A0" : char}
                </span>
              );
            })}
          </span>
        );
      })}
      <span
        className="heading-scrubber-handle"
        role="slider"
        aria-label="Change heading text"
        aria-valuemin={0}
        aria-valuemax={texts.length - 1}
        aria-valuenow={targetIndex}
        tabIndex={0}
        onPointerDown={(event) => {
          event.preventDefault();
          setDragging(true);
          updateFromClientX(event.clientX);
        }}
        onKeyDown={(event) => {
          if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") return;
          event.preventDefault();
          const nextPosition = event.key === "ArrowRight" ? 1 : 0;
          setPosition(nextPosition);
          setTargetIndex(nextPosition === 1 ? texts.length - 1 : 1);
        }}
      />
    </Component>
  );
}

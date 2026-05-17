import React, { useEffect, useRef, useState } from "react";
import WaveText from "./WaveText.jsx";

function splitLines(text) {
  return text.split("\n");
}

export default function HoverTypingText({
  variants,
  className = "",
  cursorClassName = "hover-cursor",
  element = "span",
  typingSpeed = 48,
  deletingSpeed = 28,
  pauseMs = 1100,
}) {
  const texts = variants && variants.length ? variants : [""];
  const baseText = texts[0];
  const cycleTexts = texts.length > 1 ? texts.slice(1) : texts;
  const [isHovering, setIsHovering] = useState(false);
  const [cycleIndex, setCycleIndex] = useState(0);
  const [displayText, setDisplayText] = useState(baseText);
  const phaseRef = useRef("idle");
  const charRef = useRef(0);
  const timerRef = useRef(null);
  const Component = element;

  useEffect(() => {
    if (!isHovering) {
      if (timerRef.current) clearTimeout(timerRef.current);
      phaseRef.current = "idle";
      charRef.current = 0;
      setDisplayText(baseText);
      setCycleIndex(0);
      return;
    }

    const target = cycleTexts[cycleIndex] || baseText;

    function clearTimer() {
      if (timerRef.current) clearTimeout(timerRef.current);
    }

    function type() {
      charRef.current += 1;
      setDisplayText(target.slice(0, charRef.current));
      if (charRef.current < target.length) {
        timerRef.current = setTimeout(type, typingSpeed);
      } else {
        phaseRef.current = "pausing";
        timerRef.current = setTimeout(startDelete, pauseMs);
      }
    }

    function startDelete() {
      phaseRef.current = "deleting";
      deleteChars();
    }

    function deleteChars() {
      charRef.current -= 1;
      setDisplayText(target.slice(0, Math.max(charRef.current, 0)));
      if (charRef.current > 0) {
        timerRef.current = setTimeout(deleteChars, deletingSpeed);
      } else {
        phaseRef.current = "switching";
        setCycleIndex((idx) => (idx + 1) % cycleTexts.length);
      }
    }

    if (cycleTexts.length === 1) {
      setDisplayText(target);
      return clearTimer;
    }

    phaseRef.current = "typing";
    charRef.current = 0;
    setDisplayText("");
    timerRef.current = setTimeout(type, 180);

    return clearTimer;
  }, [isHovering, cycleIndex, baseText, cycleTexts, typingSpeed, deletingSpeed, pauseMs]);

  return (
    <Component
      className={`hover-typing ${className}`}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      {splitLines(displayText).map((line, idx) => (
        <span key={`${line}-${idx}`} className="hover-typing-line">
          <WaveText text={line} />
        </span>
      ))}
      <span className={cursorClassName} aria-hidden="true" />
    </Component>
  );
}

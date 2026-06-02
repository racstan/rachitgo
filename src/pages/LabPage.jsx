import React, { useState } from "react";
import Inspector from "../components/Inspector.jsx";
import HoverTypingText from "../components/HoverTypingText.jsx";
import WaveText from "../components/WaveText.jsx";
import ClothParagraph from "../components/ClothParagraph.jsx";

// Maps text to its low-level representation on hover
function textToHex(str) {
  return [...str].map((c) => c.charCodeAt(0).toString(16).padStart(2, "0")).join(" ");
}
function textToBinary(str) {
  return [...str].map((c) => c.charCodeAt(0).toString(2).padStart(8, "0")).join(" ");
}
function textToAscii(str) {
  return [...str].map((c) => c.charCodeAt(0)).join(" ");
}

const hoverableContent = [
  {
    text: "Hello, World!",
    context: "Classic first program — the user types this string and the system converts it through the full pipeline.",
  },
  {
    text: "Rachit Asthana",
    context: "Your name as a user input stream — every character is a byte flowing through stdin.",
  },
  {
    text: "printf(\"output\");",
    context: "A C function call — the compiler lowers this to a syscall that writes bytes to file descriptor 1 (stdout).",
  },
  {
    text: "console.log(data);",
    context: "JavaScript runtime converts this into V8 internal calls that eventually write to the host environment's console API.",
  },
];

function HoverableSpan({ item }) {
  const [hovered, setHovered] = useState(false);

  return (
    <span
      className="hoverable-text"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {item.text}
      {hovered && (
        <div className="hover-conversion">
          <div className="conv-stage">
            <div className="stage-label">user input (stdin)</div>
            <div className="stage-value">{item.text}</div>
          </div>
          <div className="conv-stage">
            <div className="stage-label">ASCII codes</div>
            <div className="stage-value">{textToAscii(item.text)}</div>
          </div>
          <div className="conv-stage">
            <div className="stage-label">Hexadecimal</div>
            <div className="stage-value">{textToHex(item.text)}</div>
          </div>
          <div className="conv-stage">
            <div className="stage-label">Binary (machine)</div>
            <div className="stage-value">{textToBinary(item.text)}</div>
          </div>
          <div className="conv-stage">
            <div className="stage-label">stdout → console</div>
            <div className="stage-value">write(1, buf, {item.text.length}) → terminal display</div>
          </div>
          <div className="conv-stage" style={{ borderBottom: "none" }}>
            <div className="stage-label" style={{ color: "var(--muted)" }}>{item.context}</div>
          </div>
        </div>
      )}
    </span>
  );
}

export default function LabPage({
  item,
  language,
  onActivate,
  onPrevLanguage,
  onNextLanguage,
  onRun,
  runToken,
}) {
  return (
    <section className="section page">
      <div className="section-head">
        <p className="eyebrow">⚡ interactive lab</p>
        <HoverTypingText
          element="h2"
          variants={[
            "Low-Level Execution Lab",
            "See code become signals",
            "From source to machine",
            "Watch bytes come alive",
            "Inspect the runtime flow",
          ]}
        />
      </div>
      <ClothParagraph className="lab-note">
        Hover over any highlighted text below to see how the computer converts user input through the full pipeline —
        from characters to ASCII to hex to binary to stdout.
      </ClothParagraph>

      {/* Hoverable text demo */}
      <div className="lab-hover-demo">
        <h3><WaveText text="Hover to Inspect" /></h3>
        <p style={{ lineHeight: "2.2", fontSize: "15px" }}>
          {hoverableContent.map((item, i) => (
            <React.Fragment key={i}>
              {i > 0 && " → "}
              <HoverableSpan item={item} />
            </React.Fragment>
          ))}
        </p>
      </div>

      <div style={{ marginTop: "28px" }}>
        <Inspector
          item={item}
          language={language}
          onPrevLanguage={onPrevLanguage}
          onNextLanguage={onNextLanguage}
          onRun={onRun}
          runToken={runToken}
        />
      </div>

      <div className="language-band">
        <button className="btn" onClick={() => onActivate("project-os")}>OS Project</button>
        <button className="btn" onClick={() => onActivate("project-tools")}>Tools Project</button>
        <button className="btn" onClick={() => onActivate("project-web")}>Web Project</button>
      </div>
    </section>
  );
}

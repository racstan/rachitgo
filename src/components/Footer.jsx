import React from "react";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-inner">
        <div className="footer-brand">
          <div className="brand-static" tabIndex={0}>
            <span className="brand-name-static name-group">
              {"Rachit Asthana".split("").map((char, i) => (
                <span key={i} className="name-char">{char === " " ? "\u00A0" : char}</span>
              ))}
            </span>
            <span className="brand-sub-static">software engineer</span>
          </div>
        </div>
        <div className="footer-meta">
          <span>&copy; {new Date().getFullYear()} Rachit Asthana</span>
        </div>
      </div>
    </footer>
  );
}

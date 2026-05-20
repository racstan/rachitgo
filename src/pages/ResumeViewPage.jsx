import React from "react";
import { Link } from "react-router-dom";
import HoverTypingText from "../components/HoverTypingText.jsx";

export default function ResumeViewPage() {
  return (
    <section className="page resume-view-page" style={{ maxWidth: "1200px", margin: "0 auto", padding: "40px 20px" }}>
      <Link className="back-link" to="/" style={{ marginBottom: "24px", display: "inline-block" }}>
        ← Back to portfolio
      </Link>
      
      <div className="section-head" style={{ marginBottom: "32px" }}>
        <p className="eyebrow">Document Viewer</p>
        <HoverTypingText element="h2" variants={["Rachit Asthana's CV / Resume", "Curriculum Vitae", "Professional Credentials"]} />
        <p style={{ marginTop: "12px", color: "var(--text-muted)", fontSize: "15px" }}>
          Below is the verified PDF copy. You can also directly <a href="/CV2026.pdf" download="Rachit_Asthana_Resume.pdf" style={{ color: "var(--accent)", textDecoration: "underline", fontWeight: "500" }}>download a local copy</a>.
        </p>
      </div>

      <div style={{ width: "100%", height: "85vh", borderRadius: "16px", overflow: "hidden", border: "1px solid var(--line)", background: "var(--panel)" }}>
        <iframe
          src="/CV2026.pdf"
          width="100%"
          height="100%"
          style={{ border: "none" }}
          title="Rachit Asthana CV"
        />
      </div>
    </section>
  );
}

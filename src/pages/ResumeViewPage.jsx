import React from "react";
import { Link } from "react-router-dom";
import { Download, FileText } from "lucide-react";
import HoverTypingText from "../components/HoverTypingText.jsx";

export default function ResumeViewPage() {
  return (
    <section className="page resume-view-page" style={{ maxWidth: "1200px", margin: "0 auto", padding: "40px 20px" }}>
      <Link className="back-link" to="/" style={{ marginBottom: "24px", display: "inline-block" }}>
        ← Back to portfolio
      </Link>
      
      <div className="section-head" style={{ marginBottom: "32px", display: "flex", flexDirection: "column", gap: "12px" }}>
        <p className="eyebrow">Document Vault</p>
        <HoverTypingText element="h2" variants={["Rachit Asthana's CV / Resume", "Curriculum Vitae", "Professional Credentials"]} />
        <p style={{ color: "var(--text-muted)", fontSize: "15px", maxWidth: "600px", margin: 0 }}>
          Inspect the official documentation of my technical experience, achievements, and qualifications below.
        </p>
        
        {/* Premium Action Buttons */}
        <div style={{ display: "flex", gap: "16px", flexWrap: "wrap", marginTop: "16px" }}>
          <a
            href="/CV2026.pdf"
            download="Rachit_Asthana_Resume.pdf"
            className="action-btn"
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              padding: "12px 20px",
              background: "var(--panel-2)",
              border: "1px solid var(--line)",
              borderRadius: "10px",
              color: "var(--text)",
              fontSize: "14px",
              fontWeight: "600",
              textDecoration: "none",
              transition: "transform 0.2s, border-color 0.2s, background 0.2s"
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "translateY(-2px)";
              e.currentTarget.style.borderColor = "var(--accent)";
              e.currentTarget.style.background = "color-mix(in srgb, var(--accent) 8%, var(--panel-2))";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.borderColor = "var(--line)";
              e.currentTarget.style.background = "var(--panel-2)";
            }}
          >
            <Download size={16} style={{ color: "var(--accent)" }} />
            Download Resume (PDF)
          </a>

          <a
            href="/CV2026.pdf"
            download="Rachit_Asthana_CV.pdf"
            className="action-btn"
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              padding: "12px 20px",
              background: "var(--panel-2)",
              border: "1px solid var(--line)",
              borderRadius: "10px",
              color: "var(--text)",
              fontSize: "14px",
              fontWeight: "600",
              textDecoration: "none",
              transition: "transform 0.2s, border-color 0.2s, background 0.2s"
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "translateY(-2px)";
              e.currentTarget.style.borderColor = "var(--accent-2)";
              e.currentTarget.style.background = "color-mix(in srgb, var(--accent-2) 8%, var(--panel-2))";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.borderColor = "var(--line)";
              e.currentTarget.style.background = "var(--panel-2)";
            }}
          >
            <FileText size={16} style={{ color: "var(--accent-2)" }} />
            Download Complete CV (PDF)
          </a>
        </div>
      </div>

      <div style={{ width: "100%", height: "85vh", borderRadius: "16px", overflow: "hidden", border: "1px solid var(--line)", background: "var(--panel)", boxShadow: "0 20px 50px rgba(0,0,0,0.15)" }}>
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

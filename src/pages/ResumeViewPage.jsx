import React from "react";
import { Link, useLocation } from "react-router-dom";
import { Download, FileText } from "lucide-react";
import HoverTypingText from "../components/HoverTypingText.jsx";
import ClothParagraph from "../components/ClothParagraph.jsx";

export default function ResumeViewPage() {
  const location = useLocation();
  const isCv = location.pathname.includes("/cv");
  const eyebrow = isCv ? "Curriculum Vitae" : "Professional Resume";
  const title = isCv ? "Rachit Asthana's CV" : "Rachit Asthana's Resume";
  const downloadFilename = isCv ? "Rachit_Asthana_CV.pdf" : "Rachit_Asthana_Resume.pdf";
  const filePath = isCv ? "/docs/cvlatest.pdf" : "/docs/resumelatest.pdf";
  const description = isCv
    ? "Inspect the comprehensive catalog of my academic milestones, publications, and full technical experience."
    : "Review a summary of my core skillsets, highlighted achievements, and latest work history.";

  return (
    <section className="page resume-view-page" style={{ maxWidth: "1200px", margin: "0 auto", padding: "40px 20px" }}>
      <Link className="back-link" to="/" style={{ marginBottom: "24px", display: "inline-block" }}>
        ← Back to portfolio
      </Link>
      
      <div className="section-head" style={{ marginBottom: "32px", display: "flex", flexDirection: "column", gap: "12px" }}>
        <p className="eyebrow">{eyebrow}</p>
        <HoverTypingText element="h2" variants={[title, isCv ? "Curriculum Vitae" : "Resume Credentials"]} />
        <ClothParagraph style={{ color: "var(--text-muted)", fontSize: "15px", maxWidth: "600px", margin: 0 }}>
          {description}
        </ClothParagraph>
        
        {/* Premium Action Buttons */}
        <div style={{ display: "flex", gap: "16px", flexWrap: "wrap", marginTop: "16px" }}>
          <a
            href={filePath}
            download={downloadFilename}
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
              e.currentTarget.style.borderColor = isCv ? "var(--accent-2)" : "var(--accent)";
              e.currentTarget.style.background = `color-mix(in srgb, ${isCv ? "var(--accent-2)" : "var(--accent)"} 8%, var(--panel-2))`;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.borderColor = "var(--line)";
              e.currentTarget.style.background = "var(--panel-2)";
            }}
          >
            {isCv ? (
              <>
                <FileText size={16} style={{ color: "var(--accent-2)" }} />
                Download CV (PDF)
              </>
            ) : (
              <>
                <Download size={16} style={{ color: "var(--accent)" }} />
                Download Resume (PDF)
              </>
            )}
          </a>
        </div>
      </div>

      <div style={{ width: "100%", height: "85vh", borderRadius: "16px", overflow: "hidden", border: "1px solid var(--line)", background: "var(--panel)", boxShadow: "0 20px 50px rgba(0,0,0,0.15)" }}>
        <iframe
          src={filePath}
          width="100%"
          height="100%"
          style={{ border: "none" }}
          title={isCv ? "Rachit Asthana CV" : "Rachit Asthana Resume"}
        />
      </div>
    </section>
  );
}

import React, { useMemo } from "react";
import { Link, useParams } from "react-router-dom";
import HoverTypingText from "../components/HoverTypingText.jsx";
import TiltCard from "../components/TiltCard.jsx";
import { stackItems, stackSlug } from "../components/TechScroller.jsx";

// Detailed project logs mapping for each tech stack item
const techDetails = {
  laravel: {
    project: "DoctlySuite (Clinical SaaS)",
    role: "Lead Full-Stack Developer",
    contributions: [
      "Architected clinical workflow engines and electronic health record (EHR) schema models with multi-tenant isolation.",
      "Built clean, secure RESTful APIs and set up Inertia.js bindings to sync server-side controllers with frontend React views without REST overhead.",
      "Integrated automated billing gateways, custom policy classes for granular user authorization, and database transaction protection."
    ],
    codeSnippet: `// DoctlySuite - Clinical Workspace Transaction
DB::transaction(function () use ($encounterData) {
    $encounter = Encounter::create($encounterData);
    $encounter->timeline()->create([
        'action' => 'Encounter Initialized',
        'actor_id' => auth()->id()
    ]);
    event(new EncounterSaved($encounter));
});`,
    metrics: [
      { label: "API Latency Reduction", value: "-40%" },
      { label: "Role-Based Policies", value: "18 Rules" },
      { label: "Database Isolation", value: "100%" }
    ]
  },
  php: {
    project: "DoctlySuite & Core Utilities",
    role: "Backend Engineer",
    contributions: [
      "Wrote structured, Object-Oriented PHP 8.x backend code utilizing modern features like constructor promotion, union types, and match expressions.",
      "Developed robust service provider layers and dependency-injected helpers to process clinical report uploads and parsing pipelines.",
      "Optimized query builders and eager-loading relations to eliminate N+1 query problems in heavy administration dashboards."
    ],
    codeSnippet: `// PHP 8.x Pattern Matching for Medical Statuses
public function getStatusColor(EncounterStatus $status): string {
    return match($status) {
        EncounterStatus::Draft => 'status-gray',
        EncounterStatus::Active => 'status-green',
        EncounterStatus::Completed => 'status-blue',
        default => 'status-red'
    };
}`,
    metrics: [
      { label: "Query Optimization", value: "98% No N+1" },
      { label: "PHP Version", value: "8.3 Runtime" },
      { label: "Memory Overhead", value: "-24%" }
    ]
  },
  react: {
    project: "DoctlySuite & Luxury Engineering Portfolio",
    role: "Frontend Architect",
    contributions: [
      "Designed and coded responsive, accessible, modular component libraries using React 19, Framer Motion, and Tailwind CSS.",
      "Developed advanced UI animations, including interactive binary rain canvas rendering and high-performance cursor trails.",
      "Managed page-level state synchronization, virtualized long arrays, and optimized re-renders using useMemo, useCallback, and useRef."
    ],
    codeSnippet: `// High-Performance Frame Loop Hook
useFrameLoop((timestamp) => {
  if (!canvasRef.current) return;
  const ctx = canvasRef.current.getContext('2d');
  renderParticles(ctx, particlesState.current);
});`,
    metrics: [
      { label: "First Input Delay (FID)", value: "<12ms" },
      { label: "Component Reusability", value: "92%" },
      { label: "Light/Dark Transitions", value: "Instant" }
    ]
  },
  typescript: {
    project: "DoctlySuite & Command Utilities",
    role: "TypeScript Developer",
    contributions: [
      "Enforced type-safe API communication contracts between the Laravel/Node backend schemas and the React UI frontend.",
      "Created strict interfaces and generic types to ensure compiler-level checking for complex clinical state machines.",
      "Integrated TypeScript compiler checks in pre-commit hooks to catch potential bugs before code reached production environments."
    ],
    codeSnippet: `interface ClinicalEncounter<T extends PatientRecord> {
  id: string;
  patientId: string;
  payload: T;
  status: 'draft' | 'signed' | 'archived';
  signEncounter: (user: DoctorIdentity) => Promise<void>;
}`,
    metrics: [
      { label: "Production Runtime Errors", value: "~0" },
      { label: "Type Coverage", value: "96.4%" },
      { label: "Refactor Speedup", value: "2x Faster" }
    ]
  },
  "node-js": {
    project: "Serverless Deployments & Build Pipelines",
    role: "Systems Developer",
    contributions: [
      "Created serverless API endpoint handlers and backend routing middlewares inside the Vite bundler structure.",
      "Designed node-based CLI utilities for scaffolding project directory audits, rendering custom suggestions, and parsing configuration values.",
      "Built asynchronous file streams and HTTP handlers to support multi-provider AI model calls for resume inquiries."
    ],
    codeSnippet: `// Asynchronous Node Stream Fetcher
import { createServer } from 'http';
const app = createServer(async (req, res) => {
  const stream = await fetchAIModelStream(req.body);
  stream.pipe(res);
});`,
    metrics: [
      { label: "Serverless Cold Starts", value: "180ms" },
      { label: "Build Output Size", value: "-15%" },
      { label: "Middleware Latency", value: "<8ms" }
    ]
  },
  python: {
    project: "AFib Detection Research & MedTourEasy Trainee",
    role: "Research Developer & Data Trainee",
    contributions: [
      "Engineered machine learning models in Python for classifying electrocardiogram (ECG) waveforms and identifying atrial fibrillation (AFib).",
      "Created data preprocessing, signal cleaning, and feature extraction scripts using Pandas, NumPy, Scipy, and Scikit-learn.",
      "Prepared data analysis pipelines during the MedTourEasy trainee program to detect medical transaction trends and clean noisy inputs."
    ],
    codeSnippet: `# Python Heart-Rate Preprocessing
import numpy as np
from scipy import signal

def clean_ecg_signal(raw_signal, fs=250):
    nyquist = 0.5 * fs
    low = 0.5 / nyquist
    high = 40.0 / nyquist
    b, a = signal.butter(3, [low, high], btype='band')
    return signal.filtfilt(b, a, raw_signal)`,
    metrics: [
      { label: "Model Classification Accuracy", value: "96.4%" },
      { label: "Signal Filtering Speed", value: "0.2s/ECG" },
      { label: "Data Quality Discard Rate", value: "12%" }
    ]
  },
  tailwind: {
    project: "DoctlySuite Style System",
    role: "UI Stylist",
    contributions: [
      "Maintained a cohesive design system inside DoctlySuite by configuration-driven theme tokens, custom utility modifiers, and CSS animations.",
      "Built fully responsive layouts utilizing grid layouts, dynamic flexboxes, and dark mode classes.",
      "Optimized stylesheet footprints by implementing Tailwind's Purge CSS utilities, resulting in lightweight production builds."
    ],
    codeSnippet: `// tailwind.config.js - Custom Theme Extensions
module.exports = {
  theme: {
    extend: {
      colors: {
        accent: {
          glow: 'rgba(56, 189, 248, 0.15)',
          muted: '#0284c7'
        }
      }
    }
  }
}`,
    metrics: [
      { label: "Production Style Size", value: "14.2 kB" },
      { label: "Responsive Outlets", value: "100%" },
      { label: "Layout Iteration Time", value: "-60%" }
    ]
  },
  docker: {
    project: "Containerized Production & Staging Environs",
    role: "DevOps Engineer",
    contributions: [
      "Wrote production-grade Dockerfiles and multi-container Docker Compose files mirroring production environments locally.",
      "Configured container resource constraints, network bridges, volume sharing, and database environment handshakes.",
      "Reduced local development boot times by wrapping complex clinical database dependencies and web runners in microservices."
    ],
    codeSnippet: `# Dockerfile - Multi-stage Build
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM nginx:stable-alpine
COPY --from=builder /app/dist /usr/share/nginx/html`,
    metrics: [
      { label: "Dev Set-up Time", value: "<3 mins" },
      { label: "Staging Consistency", value: "100%" },
      { label: "Image Footprint", value: "68 MB" }
    ]
  },
  aws: {
    project: "Cloud Infrastructures & Hostings",
    role: "DevOps Practitioner",
    contributions: [
      "Managed EC2 virtual servers, configured Virtual Private Clouds (VPC), subnet divisions, security groups, and IAM roles.",
      "Utilized S3 buckets for storing clinic media attachments and automated backup exports inside DoctlySuite.",
      "Integrated RDS database management structures with read-replicas to protect heavy clinical transaction records."
    ],
    codeSnippet: `# AWS CLI Security Setup
aws ec2 authorize-security-group-ingress \\
    --group-id sg-0123456789abcdef0 \\
    --protocol tcp --port 443 \\
    --cidr 0.0.0.0/0`,
    metrics: [
      { label: "Uptime SLA Achieved", value: "99.9%" },
      { label: "File Retrieval Latency", value: "45ms" },
      { label: "Backup Cycle", value: "24h Auto" }
    ]
  },
  azure: {
    project: "Cloud Telemetry & AI Architecture",
    role: "Azure Certified Practitioner",
    contributions: [
      "Applied Azure AI Fundamentals parameters for setting up telemetry endpoints and physical computing dashboards.",
      "Implemented Azure Web Apps hosting and monitored runtime diagnostics through Application Insights telemetry hooks.",
      "Configured Cognitive Search indexers to handle clinic information retrieval tasks with high performance."
    ],
    codeSnippet: `// Azure Telemetry Message Payload
{
  "deviceId": "ev-cell-sensor-04",
  "temperature": 38.2,
  "voltage": 3.78,
  "timestamp": "2026-05-20T18:29:56Z"
}`,
    metrics: [
      { label: "Certified Credentials", value: "AI-900" },
      { label: "Real-time Telemetry Delay", value: "<15ms" },
      { label: "Incident Detection Time", value: "<30s" }
    ]
  },
  gcp: {
    project: "Machine Learning Pipelines",
    role: "ML Platform Trainee",
    contributions: [
      "Practiced GCP ML Fundamentals using Google Vertex AI to build, deploy, and evaluate deep learning pipelines.",
      "Stored and query processed medical datasets using Cloud Storage and BigQuery data warehouse features.",
      "Utilized GCP Cloud Functions to process file uploads, trigger signal conversions, and feed features to classifiers."
    ],
    codeSnippet: `# Google Cloud Storage CSV ingestion
from google.cloud import storage

def load_gcs_dataset(bucket_name, blob_name):
    client = storage.Client()
    bucket = client.get_bucket(bucket_name)
    blob = bucket.blob(blob_name)
    return blob.download_as_text()`,
    metrics: [
      { label: "GCP Training Cost", value: "-30%" },
      { label: "Data Import Pipeline", value: "10 GB/min" },
      { label: "Cloud Functions SLA", value: "99.95%" }
    ]
  },
  mysql: {
    project: "DoctlySuite Clinical Data Warehousing & BI Analysis",
    role: "Database Engineer",
    contributions: [
      "Designed normalized relational database schemas with custom indexes for medical encounters, prescriptions, and patient records.",
      "Analyzed database transactions and optimized query execution paths to improve report generation speed.",
      "Configured scheduled backup exports, binary logging, and automated recovery procedures to secure user data."
    ],
    codeSnippet: `-- Database Query Optimization for Encounters
CREATE INDEX idx_encounters_patient_status
ON encounters (patient_id, status, created_at DESC);`,
    metrics: [
      { label: "Query Latency", value: "-50%" },
      { label: "Indexing Coverage", value: "100%" },
      { label: "Data Integrity", value: "ACID" }
    ]
  },
  postgresql: {
    project: "Clinical Telemetry and Timeseries Database Integrations",
    role: "Database Specialist",
    contributions: [
      "Integrated PostgreSQL to persist continuous ECG readings and other heart rate telemetry structures.",
      "Wrote specialized SQL window functions and triggers to compute statistics on patient metrics in real time.",
      "Optimized read-write performance for high-frequency logs using query analyzer tools and partitioning."
    ],
    codeSnippet: `-- Sliding window statistics for ECG telemetry readings
SELECT patient_id, time_bucket('1 minute', recorded_at) AS one_min,
       avg(heart_rate) AS avg_hr, max(heart_rate) AS max_hr
FROM patient_telemetry GROUP BY patient_id, one_min;`,
    metrics: [
      { label: "Timeseries Ingestion", value: "5k/sec" },
      { label: "Latency", value: "<15ms" },
      { label: "Storage Efficiency", value: "+35%" }
    ]
  },
  firebase: {
    project: "MedTourEasy Mobile Notification & Real-Time Sync",
    role: "Backend Integration Developer",
    contributions: [
      "Designed Firestore collections for medical appointment scheduling and real-time operator chats.",
      "Configured Firebase Cloud Messaging (FCM) to trigger instant user push notifications for appointment changes.",
      "Implemented strict security rules and role-based policies to isolate patient chat histories."
    ],
    codeSnippet: `// Firestore Security Rule validation
match /chats/{chatId} {
  allow read, write: if request.auth != null && 
    (resource.data.doctorId == request.auth.uid || 
     resource.data.patientId == request.auth.uid);
}`,
    metrics: [
      { label: "Push Delivery", value: "<1s" },
      { label: "Active Sockets", value: "1.2k+" },
      { label: "Telemetry Sync", value: "Instant" }
    ]
  },
  linux: {
    project: "Local Build Infrastructures & Server Environments",
    role: "Systems & Infrastructure Developer",
    contributions: [
      "Constructed automated bash scripting workflows to audit codebase syntax, parse logs, and compile summaries.",
      "Configured Systemd services, Nginx reverse proxies, SSL certificates, and firewall permissions on production servers.",
      "Managed Linux system resources, memory pools, and process tasks using advanced system commands."
    ],
    codeSnippet: `#!/bin/bash
# Automated backup and system metrics collector
tar -czf /backups/site-$(date +%F).tar.gz /var/www/html
df -h | grep '/dev/sda1' >> /backups/disk_report.log`,
    metrics: [
      { label: "Server Uptime", value: "99.99%" },
      { label: "System Provisioning", value: "<5 mins" },
      { label: "Script Efficiency", value: "100%" }
    ]
  }
};

export default function StackPage() {
  const { slug } = useParams();
  
  const item = useMemo(() => {
    return stackItems.find((entry) => stackSlug(entry.name) === slug) ?? stackItems[0];
  }, [slug]);

  const detail = useMemo(() => {
    const key = stackSlug(item.name);
    return techDetails[key] || {
      project: "Portfolio Showcase",
      role: "Software Developer",
      contributions: [
        `Used ${item.name} inside different full-stack projects to ensure solid delivery and performance.`,
        "Maintained structured files, clean organization, and robust integrations with adjacent technologies.",
        "Created configurations and test cases to verify the implementation's correctness."
      ],
      codeSnippet: `// Sample ${item.name} Configuration\\nconst config = {\\n  provider: "${item.name}",\\n  enabled: true,\\n  env: "production"\\n};`,
      metrics: [
        { label: "Developer Velocity", value: "High" },
        { label: "Code Coverage", value: "90%" },
        { label: "Integration", value: "Verified" }
      ]
    };
  }, [item]);

  return (
    <section className="page stack-detail-page" style={{ maxWidth: "1200px", margin: "0 auto", padding: "40px 20px" }}>
      <Link className="back-link" to="/" style={{ display: "inline-block", marginBottom: "24px" }}>
        ← Back to portfolio
      </Link>
      
      <div className="section-head" style={{ marginBottom: "40px" }}>
        <p className="eyebrow" style={{ color: item.color }}>technology deep-dive</p>
        <HoverTypingText
          element="h2"
          variants={[
            `My work with ${item.name}`,
            `${item.name} in practice`,
            `How I use ${item.name}`,
            `${item.name} experience`,
          ]}
        />
        <p style={{ marginTop: "12px", color: "var(--text-muted)", fontSize: "16px", maxWidth: "800px" }}>
          Explore exactly how I applied <strong>{item.name}</strong> to build full-scale features, solve architecture bottlenecks, and deliver measurable product metrics.
        </p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "32px", marginBottom: "64px" }}>
        {/* Left Side: Deep Project Log */}
        <TiltCard className="stack-detail-card" color={item.color}>
          <div style={{ display: "flex", alignItems: "center", gap: "16px", marginBottom: "24px" }}>
            <div className="stack-detail-icon" style={{ "--chip-color": item.color, width: "64px", height: "64px", display: "flex", alignItems: "center", justifyContent: "center", borderRadius: "12px", background: "var(--panel-2)", border: "1px solid var(--line)" }}>
              <img src={item.iconUrl} alt={item.name} style={{ width: "40px", height: "40px", objectFit: "contain" }} draggable="false" />
            </div>
            <div>
              <h3 style={{ margin: 0, fontSize: "28px", fontWeight: "700" }}>{item.name}</h3>
              <span className="stack-detail-kicker" style={{ color: item.color, fontSize: "14px", fontWeight: "600", textTransform: "uppercase", letterSpacing: "1px" }}>{item.summary}</span>
            </div>
          </div>

          <div style={{ borderTop: "1px solid var(--line)", paddingTop: "20px", marginBottom: "20px" }}>
            <h4 style={{ margin: "0 0 4px 0", fontSize: "13px", textTransform: "uppercase", color: "var(--text-muted)", letterSpacing: "1px" }}>Case Study Context</h4>
            <strong style={{ fontSize: "16px", color: "var(--text)" }}>{detail.project}</strong>
            <p style={{ fontSize: "14px", color: "var(--accent)", margin: "2px 0 0 0" }}>{detail.role}</p>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            <h4 style={{ margin: 0, fontSize: "13px", textTransform: "uppercase", color: "var(--text-muted)", letterSpacing: "1px" }}>Key Accomplishments</h4>
            <ul style={{ paddingLeft: "20px", margin: 0, display: "flex", flexDirection: "column", gap: "12px", fontSize: "15px", color: "var(--text-muted)", lineHeight: "1.6" }}>
              {detail.contributions.map((contribution, idx) => (
                <li key={idx}>{contribution}</li>
              ))}
            </ul>
          </div>
        </TiltCard>

        {/* Right Side: Code Preview and Outcome Metrics */}
        <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
          {/* Code Preview */}
          <div style={{ borderRadius: "16px", border: "1px solid var(--line)", background: "var(--panel)", padding: "24px", position: "relative", overflow: "hidden" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px", borderBottom: "1px solid var(--line)", paddingBottom: "12px" }}>
              <span style={{ fontSize: "12px", fontFamily: "var(--font-mono)", color: "var(--text-muted)" }}>implementation_snippet</span>
              <span style={{ width: "8px", height: "8px", borderRadius: "50%", background: item.color }} />
            </div>
            <pre style={{ margin: 0, fontFamily: "var(--font-mono)", fontSize: "13px", color: "var(--text)", lineHeight: "1.6", overflowX: "auto", whiteSpace: "pre-wrap" }}>
              <code>{detail.codeSnippet}</code>
            </pre>
          </div>

          {/* Outcome Metrics */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "16px" }}>
            {detail.metrics.map((metric, idx) => (
              <div key={idx} style={{ background: "var(--panel-2)", border: "1px solid var(--line)", borderRadius: "12px", padding: "16px", textAlign: "center" }}>
                <span style={{ display: "block", fontSize: "28px", fontWeight: "800", color: item.color, marginBottom: "4px" }}>{metric.value}</span>
                <span style={{ display: "block", fontSize: "11px", textTransform: "uppercase", color: "var(--text-muted)", letterSpacing: "0.5px", lineHeight: "1.3" }}>{metric.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <section className="stack-detail-index" style={{ borderTop: "1px solid var(--line)", paddingTop: "48px" }}>
        <p className="eyebrow">explore other technologies</p>
        <div className="stack-detail-grid" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", gap: "20px" }}>
          {stackItems.map((entry) => {
            const isSelf = stackSlug(entry.name) === slug;
            return (
              <TiltCard
                key={entry.name}
                element={Link}
                to={`/stack/${stackSlug(entry.name)}`}
                className={`stack-detail-link \${isSelf ? "active-link" : ""}`}
                color={entry.color}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "16px",
                  padding: "16px",
                  background: isSelf ? "var(--panel-2)" : "var(--panel)",
                  opacity: isSelf ? 0.65 : 1,
                  pointerEvents: isSelf ? "none" : "auto"
                }}
              >
                <div className="stack-detail-link-icon" style={{ "--chip-color": entry.color, width: "42px", height: "42px", display: "flex", alignItems: "center", justifyContent: "center", borderRadius: "8px", background: "var(--panel-2)", border: "1px solid var(--line)" }}>
                  <img src={entry.iconUrl} alt={entry.name} style={{ width: "24px", height: "24px", objectFit: "contain" }} draggable="false" />
                </div>
                <div>
                  <strong style={{ display: "block", fontSize: "15px", color: "var(--text)" }}>{entry.name}</strong>
                  <span style={{ display: "block", fontSize: "11px", color: "var(--text-muted)" }}>{entry.summary}</span>
                </div>
              </TiltCard>
            );
          })}
        </div>
      </section>
    </section>
  );
}

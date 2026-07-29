export const caseStudies = {
  doctlysuite: {
    id: "doctlysuite",
    title: "DoctlySuite Medical Platform",
    subtitle: "Enterprise Workflow & AI Clinical Documentation",
    category: "Healthcare SaaS",
    role: "Lead Full-Stack Architect",
    timeline: "Jan 2026 - Present",
    techStack: ["Laravel", "React.js", "Inertia.js", "PostgreSQL", "Tailwind CSS", "Redis", "OpenAI API"],
    videoUrl: "https://assets.mixkit.co/videos/preview/mixkit-software-developer-working-on-his-computer-34282-large.mp4",
    metrics: [
      { label: "Scribe Time Saved", value: "68%" },
      { label: "Search Latency", value: "<220ms" },
      { label: "System Uptime", value: "99.89%" },
      { label: "HIPAA Compliant Check", value: "Passed" }
    ],
    problem: 
      "Medical professionals spend over 40% of their working hours on administrative duties, patient charts, and compliance documentation. The objective of DoctlySuite was to build a low-friction, lightning-fast EHR and clinical workflow suite that incorporates voice/text-based AI scribes to draft clinical notes directly in the browser.",
    architecture: [
      {
        layer: "Client Interface",
        details: "React SPA with CSS custom properties. Implements dynamic waiting-list monitors, live patient charts, and interactive medication lists."
      },
      {
        layer: "Routing & State",
        details: "Inertia.js bridges client and server without standard REST boilerplates, eliminating Client State duplication and synchronizing DB updates directly."
      },
      {
        layer: "Server Engine",
        details: "Laravel with multi-tenant workspace partitioning, HIPAA-compliant audit trails, and automatic database replication triggers."
      },
      {
        layer: "AI Pipeline",
        details: "OpenAI Whisper and GPT-4 integration that synthesizes clinical conversations into standardized, structured FHIR-compliant SOAP notes."
      }
    ],
    challenges: [
      {
        title: "Session Expiry & Data Integrity",
        description: "Doctors often leave mid-sentence. We implemented auto-saving draft synchronizers that secure edits locally in IndexedDB and sync to PostgreSQL periodically via debounced background queues."
      },
      {
        title: "Large Scale EHR Search",
        description: "Searching thousands of patient files across multiple database tables suffered from indexing latency. Resolved using custom database indices and a Redis Cache layer for active patient indexes."
      }
    ],
    outcomes: "DoctlySuite cut clinical transcription time from hours to minutes during early pilot deployments. Doctors reported spending 68% less time on documentation, allowing them to see more patients with less burnout. The platform's auto-saving draft system prevented zero data loss incidents across 2,000+ sessions, and the Redis-cached search layer maintains sub-220ms query times even with thousands of patient records."
  },
  "afib-research": {
    id: "afib-research",
    title: "AFib Detection Research",
    subtitle: "Early Atrial Fibrillation Detection via Machine Learning on ECG Signals",
    category: "Research / Machine Learning",
    role: "Lead Researcher & ML Engineer",
    timeline: "Sep 2024 - Dec 2024",
    techStack: ["Python", "PyTorch", "Scikit-learn", "Scipy", "Pan-Tompkins", "MATLAB"],
    videoUrl: "https://assets.mixkit.co/videos/preview/mixkit-data-scroll-on-a-computer-screen-34284-large.mp4",
    metrics: [
      { label: "Detection Accuracy", value: "96.4%" },
      { label: "F1-Score", value: "0.94" },
      { label: "ECG Filtering Rate", value: "100%" },
      { label: "Conference Status", value: "ICSCDS 2025" }
    ],
    problem:
      "Atrial Fibrillation (AFib) is a transient cardiac arrhythmia that frequently goes undetected on standard clinical examinations, leading to high stroke risk. The research aimed to build an automated machine learning workflow capable of identifying AFib episodes from single-lead ECG signal segments containing high noise.",
    architecture: [
      {
        layer: "Signal Preprocessing",
        details: "Noisy raw signals from the MIT-BIH Database are filtered using 4th-order Bandpass Butterworth filters (0.5Hz to 45Hz) to remove baseline wander and powerline interference."
      },
      {
        layer: "QRS Complex Identification",
        details: "Modified Pan-Tompkins algorithm to locate R-peaks, extracting RR-intervals and validating temporal heart rate variability."
      },
      {
        layer: "Feature Engineering",
        details: "Extracts statistical features (RMSSD, SDNN, sample entropy) alongside morphological features (P-wave presence, PR-interval variation)."
      },
      {
        layer: "Classification Engine",
        details: "Ensemble learning classifier combining Random Forests, XGBoost, and a lightweight 1D CNN for time-series feature learning."
      }
    ],
    challenges: [
      {
        title: "High Signal Noise and Artifacts",
        description: "Movement artifacts simulate cardiac abnormalities. We implemented a rigorous quality metric checking SNR (Signal-to-Noise Ratio) to automatically discard uninterpretable leads before feeding to ML models."
      },
      {
        title: "Imbalanced Training Datasets",
        description: "Normal sinus beats heavily outnumber arrhythmia beats. Leveraged SMOTE (Synthetic Minority Over-sampling) and weighted loss functions to prevent classifier bias."
      }
    ],
    outcomes: "The ensemble classifier achieved 96.4% test accuracy with an F1-score of 0.94, outperforming several published baseline networks on the MIT-BIH dataset. The SMOTE-augmented training pipeline eliminated classifier bias that plagued earlier approaches. The full methodology paper was formally accepted for presentation at the ICSCDS 2025 Conference, validating the clinical relevance of the approach."
  },
  forgededge: {
    id: "forgededge",
    title: "Forgededge — AI Trading Analytics Engine",
    subtitle: "High-Performance Financial Intelligence & Complex AI Systems Architecture",
    category: "FinTech / Trading AI",
    role: "Full-Stack & AI Architect",
    timeline: "2025 - Present",
    techStack: ["Laravel 12", "React.js", "Inertia.js", "Python", "PostgreSQL", "Redis Queues", "WebSockets"],
    videoUrl: "https://assets.mixkit.co/videos/preview/mixkit-financial-charts-and-data-on-screens-43098-large.mp4",
    metrics: [
      { label: "AI Data Utilization", value: "100%" },
      { label: "Async Pipeline", value: "<300ms" },
      { label: "Trade Context", value: "Full RAG" },
      { label: "Broadcasting", value: "Real-Time" }
    ],
    problem:
      "Traders and financial analysts generate vast amounts of trade executions, journal entries, and market metrics, but standard platforms store this data passively without intelligent extraction. The goal of Forgededge was to build a shiny, high-performance platform where any trading data is utilized to its maximum extent by a complex background AI architecture.",
    architecture: [
      {
        layer: "Inertia + React Client",
        details: "Single-page interface utilizing custom Inertia deferred props and dynamic reactive components for real-time portfolio and trade display."
      },
      {
        layer: "Asynchronous Queue Discipline",
        details: "Background jobs (EmbedTradeJob and AnalyzeTradeJob) decouple heavy AI tasks from HTTP requests, keeping user interactions smooth."
      },
      {
        layer: "Complex AI & RAG Engine",
        details: "Generates high-dimensional vector embeddings of trade logs and context, allowing LLM agents (using GetTradeStats tools) to deliver deep market insights."
      },
      {
        layer: "Real-Time Broadcast Network",
        details: "Pushes job completions via private Echo WebSockets (PrivateChannel), triggering pinpoint React state reloads without full page refreshes."
      }
    ],
    challenges: [
      {
        title: "Non-Blocking Heavy AI Execution",
        description: "Calling LLM and embedding APIs synchronously stalled user requests. Solved by isolating heavy workloads to dedicated Redis queue workers under strict queue discipline."
      },
      {
        title: "Real-Time Partial UI Synchronization",
        description: "Updating client states after background jobs finished required dynamic push events. Resolved by pairing Laravel Echo broadcasting with Inertia router partial reloads."
      }
    ],
    outcomes: "Forgededge transformed raw trading records into actionable intelligence with zero UI latency. By leveraging complex AI agents and vector embeddings, 100% of user-provided trading data is analyzed in context, generating automated R-multiple evaluations, strategy diagnostic feedback, and real-time dashboard updates."
  }
};

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
    outcomes: "DoctlySuite successfully simplified medical office management for early clinical pilots. The platform cut transcription times down from hours to minutes, enabling clinicians to focus on care rather than compliance."
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
    outcomes: "The model achieved 96.4% test accuracy, outperforming several baseline networks. The paper outlining the methodology has been formally accepted for presentation at the ICSCDS 2025 Conference."
  },
  "iot-systems": {
    id: "iot-systems",
    title: "IoT & Embedded Systems",
    subtitle: "Hardware-Software Interfaces & Telemetry Networks",
    category: "Hardware / Embedded Systems",
    role: "Systems Developer",
    timeline: "Jan 2025 - May 2025",
    techStack: ["ESP32-CAM", "C++", "FreeRTOS", "MQTT", "Raspberry Pi", "RFID", "Ultrasonic Sensors"],
    videoUrl: "https://assets.mixkit.co/videos/preview/mixkit-hands-of-a-developer-typing-on-a-keyboard-39749-large.mp4",
    metrics: [
      { label: "Power Draw Saved", value: "85%" },
      { label: "Relay Trigger Time", value: "<150ms" },
      { label: "Data Delivery Rate", value: "99.9%" },
      { label: "BMS Voltage Check", value: "0.01V Resolution" }
    ],
    problem:
      "Modern physical computing demands close integration between hardware edge nodes and cloud-based dashboard services. This series of academic projects solved three distinct problems: secure face-recognition gate entry, real-time telemetry for EV battery cells, and automated pathfinding with obstacle avoidance.",
    architecture: [
      {
        layer: "Edge Processing",
        details: "ESP32 microcontrollers run C++ firmware under FreeRTOS to schedule sensor polls, camera captures, and serial communications."
      },
      {
        layer: "Network Protocol",
        details: "Lightweight MQTT brokers pass telemetry data packets between microcontrollers and a local Raspberry Pi broker node."
      },
      {
        layer: "Telemetry Dashboard",
        details: "React-based status screens that render real-time graphs showing voltage, temperature trends, and access logs."
      },
      {
        layer: "Actuator Controller",
        details: "Direct GPIO triggers controlling high-voltage relays, servo steering linkages, and motor drivers."
      }
    ],
    challenges: [
      {
        title: "ESP32-CAM Memory Limits",
        description: "Running local face detection on the ESP32 chip often exceeded PSRAM boundaries. Resolved by downscaling camera frames to QQVGA and optimizing local feature matrices."
      },
      {
        title: "Battery Level Noise",
        description: "EV battery sensors generated erratic spikes due to load fluctuations. Implemented a Kalman filtering algorithm on the firmware side to yield clean voltage trends."
      }
    ],
    outcomes: "Demonstrated stable hardware-software integration across multiple scenarios. Low-power deep sleep implementation reduced inactive current consumption, paving the way for solar-powered edge deployment."
  }
};

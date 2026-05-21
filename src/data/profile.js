export const profile = {
  name: "Rachit Asthana",
  roleLine: "Product Engineer · Full Stack Architect · Systems Builder",
  email: "asthanarachit@gmail.com",
  phone: "7780289576",
  githubHandle: "racstan",
  githubUrl: "https://github.com/racstan",
  linkedinUrl: "https://linkedin.com/in/rachitasthana/",
  summary:
    "I architect production software that solves real problems — from clinical AI platforms to embedded IoT systems. My work lives at the intersection of clean engineering, thoughtful design, and relentless shipping. Laravel and React for the stack, curiosity for everything else.",
};

export const projectCards = [
  {
    id: "doctlysuite",
    activateId: "project-os",
    title: "DoctlySuite",
    summary: "An end-to-end clinical workflow platform that turns doctor-hours into doctor-minutes. AI scribes draft SOAP notes while you talk, and the system handles scheduling, prescriptions, and patient history — built for the pace of real clinics.",
    highlights: ["Laravel + React + Inertia.js", "OpenAI Whisper & GPT-4 Scribe", "Multi-tenant HIPAA architecture"],
    href: "/projects/doctlysuite",
  },
  {
    id: "afib-research",
    activateId: "project-tools",
    title: "AFib Detection Research",
    summary: "A machine learning pipeline that catches atrial fibrillation before a cardiologist can — 96.4% accuracy from noisy single-lead ECGs. Accepted for ICSCDS 2025.",
    highlights: ["Pan-Tompkins + Bandpass Filtering", "Random Forest + XGBoost + 1D CNN", "Accepted at ICSCDS 2025"],
    href: "/projects/afib-research",
  },
  {
    id: "iot-systems",
    activateId: "academics",
    title: "IoT & Embedded Systems",
    summary: "A portfolio of hardware-software builds: face-recognition door locks on ESP32-CAM, real-time EV battery telemetry, and autonomous obstacle-avoidance vehicles — all running on microcontrollers with sub-150ms response times.",
    highlights: ["ESP32-CAM + FreeRTOS", "MQTT Telemetry + React Dashboard", "Kalman-filtered BMS"],
    href: "/projects/iot-systems",
  },
];

export const journeyTimeline = [
  {
    year: "Childhood",
    role: "First Fascination",
    company: "Home, family, and old electronics",
    tags: ["Curiosity", "Games", "TV", "Family"],
    desc:
      "Growing up in a lower-middle-class family made every piece of technology feel valuable. Video game cassettes with my grandfather, cartoons on the old TV, and small moments at home became the beginning of my fascination with tech.",
    color: "#1a7f37",
  },
  {
    year: "Class 1",
    role: "First Computer",
    company: "School interest became a home machine",
    tags: ["Computer", "School", "Discovery"],
    desc:
      "After showing deep interest in the computers at school, I came home one day and found a computer waiting there. My father had brought it for me, and that changed how I saw what was possible.",
    color: "#0969da",
  },
  {
    year: "Early school",
    role: "Games, Paint, and MS Word",
    company: "Road Rash, Zuma Deluxe, Paint, stories",
    tags: ["Miniclip", "MS Word", "Paint"],
    desc:
      "I spent years exploring small games and basic tools with my younger brother. Those tiny 1-2 MB games, Paint, and writing stories in MS Word made me the kid in class who genuinely loved computers.",
    color: "#9a6700",
  },
  {
    year: "Age 9-10",
    role: "Internet on My PC",
    company: "USB tethering discovery",
    tags: ["Google", "YouTube", "Tethering"],
    desc:
      "Mobile internet was limited and expensive, and I had only seen the internet properly on school computers. Figuring out USB tethering and seeing Google work on my own PC became one of my proudest early tech moments.",
    color: "#cf222e",
  },
  {
    year: "High school",
    role: "First Lines of Code",
    company: "C++ in school, HTML at home",
    tags: ["C++", "HTML", "Curiosity"],
    desc:
      "School introduced me to C++ and basic programming concepts. At home, I started tinkering with HTML, building terrible-looking pages and loving every second of it. The idea that I could make a computer do what I wanted was addictive.",
    color: "#e5534b",
  },
  {
    year: "12th Grade",
    role: "The Coding Obsession",
    company: "Python, competitive coding, and YouTube tutorials",
    tags: ["Python", "Competitive", "Self-taught"],
    desc:
      "I discovered Python and competitive programming. YouTube channels became my university. I started solving problems daily, building small automation scripts, and realized software engineering was what I wanted to do for the rest of my life.",
    color: "#3776AB",
  },
  {
    year: "2021",
    role: "Engineering Begins",
    company: "Vellore Institute of Technology, Chennai",
    tags: ["VIT", "CSE", "AI & Robotics"],
    desc:
      "Joined VIT Chennai for B.Tech in Computer Science with AI and Robotics specialization. The next four years became a concentrated sprint through systems, data, web, cloud, and embedded engineering.",
    color: "#8250df",
  },
  {
    year: "2025",
    role: "B.Tech CSE Graduate",
    company: "Vellore Institute of Technology, Chennai",
    tags: ["AI & Robotics", "CGPA 8.24", "CSE"],
    desc:
      "Completed B.Tech in Computer Science Engineering with AI and Robotics specialization. Four years of building, researching, interning, and shipping — culminating in a published research paper and production software.",
    color: "#8250df",
  },
  {
    year: "2026",
    role: "Shipping Real Products",
    company: "DoctlySuite, portfolio systems, and freelance builds",
    tags: ["Laravel", "React", "AI", "Cloud"],
    desc:
      "Building production software that people actually use. DoctlySuite is live in clinical pilot, and I'm taking on freelance architecture work while continuing to push into cloud-native and AI-integrated product engineering.",
    color: "#0a66c2",
  },
];

export const experienceTimeline = [
  {
    year: "Jul 2025",
    role: "B.Tech Fellow",
    company: "Vellore Institute of Technology",
    tags: ["CGPA 8.24", "AI & Robotics", "CSE"],
    desc:
      "Graduated with a Computer Science degree specializing in AI & Robotics. Focused on systems engineering, ML research, full-stack product development, and embedded systems across four intensive years.",
    color: "#8250df",
  },
  {
    year: "Nov 2023",
    role: "Data Science Intern",
    company: "JPMorgan Chase & Co.",
    tags: ["Python", "R", "EDA", "Financial data"],
    desc:
      "Performed exploratory data analysis on financial portfolio datasets at one of the world's largest investment banks. Improved internal reporting pipelines, built statistical visualizations, and supported data-driven decision workflows across teams.",
    color: "#0969da",
  },
  {
    year: "Aug 2023",
    role: "Data Analytics Trainee",
    company: "MedTourEasy",
    tags: ["Python", "MySQL", "Pandas", "Scikit-learn"],
    desc:
      "Industrial traineeship covering the full analytics lifecycle — from raw dataset ingestion and cleaning through trend analysis, feature engineering, and automated reporting using Python, SQL, and ML libraries.",
    color: "#1a7f37",
  },
];

export const skillGroups = [
  { cat: "Backend", items: ["PHP", "Laravel", "REST APIs", "Node.js"] },
  { cat: "Frontend", items: ["JavaScript", "TypeScript", "React.js", "HTML5", "CSS3", "Tailwind CSS"] },
  { cat: "Databases", items: ["MySQL", "PostgreSQL", "Firebase", "ChromaDB"] },
  { cat: "Cloud & DevOps", items: ["AWS", "Microsoft Azure", "GCP", "Docker", "Linux", "Git", "Postman"] },
  { cat: "AI", items: ["Generative AI", "LangChain", "LangGraph", "ML Fundamentals"] },
  { cat: "Certifications", items: ["Azure AI Fundamentals", "GCP ML Fundamentals", "SFPC", "MySQL for BI", "IIT Bombay Python/Java/C++"] },
];

import React, { useMemo, useRef, useState, useEffect } from "react";
import { Sparkles, RefreshCw } from "lucide-react";

const promptOptions = [
  "What do you build?",
  "Share your tech stack",
  "Show recent projects",
  "Where are you based?",
  "What are your core tech skills?",
  "Tell me about DoctlySuite.",
  "Describe your ML research on AFib detection.",
  "Tell me about Forgededge and your trading AI engines.",
  "How do you optimize Laravel database performance?",
  "What is Inertia.js and why do you use it?",
  "How does the Pan-Tompkins algorithm work in your ECG project?",
  "What ML classifiers did you test for AFib detection?",
  "Tell me about Forgededge background AI pipelines.",
  "How does queue discipline work in Forgededge?",
  "What is vector RAG used for in Forgededge?",
  "Describe your experience with React 19.",
  "What libraries do you use for animations?",
  "How do you ensure HIPAA compliance in DoctlySuite?",
  "What database indexing strategies do you use?",
  "How do you configure multi-tenant isolation in Laravel?",
  "Tell me about your trading AI architecture.",
  "What WebSocket brokers do you prefer for real-time app updates?",
  "Tell me about your conference paper for ICSCDS 2025.",
  "What is your academic background?",
  "Have you worked with Docker and containerization?",
  "What AWS services have you used?",
  "How do you set up CI/CD pipelines?",
  "Tell me about your experience with Laravel Echo.",
  "What is your favorite CSS styling approach?",
  "How do you achieve high performance in React apps?",
  "Describe your experience with Python for data science.",
  "What is your approach to system testing?",
  "Have you worked with TypeScript?",
  "How do you manage state in React?",
  "Tell me about your newsletter subscription setup.",
  "What is Brevo and why did you use it?",
  "What are your certifications?",
  "Tell me about your Azure AI Fundamentals certificate.",
  "What is the AI-900 exam about?",
  "What GCP tools are you familiar with?",
  "Have you used Google Vertex AI?",
  "What database engines do you work with?",
  "How do you write safe database transactions in Laravel?",
  "What PHP 8.x features do you use most?",
  "How do you handle N+1 query problems in databases?",
  "Describe your local development setup.",
  "What Linux tools do you use for administration?",
  "How do you write automation scripts?",
  "Tell me about your full-stack architect role.",
  "Do you have experience with WebSockets?",
  "How do you build real-time applications?",
  "What API patterns do you prefer?",
  "Tell me about your background in signal processing.",
  "How do you filter noise from raw signals?",
  "What is SDNN and RMSSD in cardiac telemetry?",
  "How does SMOTE help with imbalanced datasets?",
  "What was your intern role at MedTourEasy?",
  "Describe your contributions as a MedTourEasy intern.",
  "What was your main project at MedTourEasy?",
  "Tell me about your Software Engineering Internship at JPMorgan Chase.",
  "What financial data analysis did you do at JPMC?",
  "Tell me about your complex AI architectures.",
  "How do you handle asynchronous background queues?",
  "What is your approach to clean code?",
  "How do you design REST APIs?",
  "What is your workflow for responsive web design?",
  "Have you worked with Tailwind CSS?",
  "What Git workflow do you follow?",
  "How do you deploy Laravel applications?",
  "What Nginx configurations do you write?",
  "Have you used Redis, and for what?",
  "What is your experience with OpenAI APIs?",
  "How do you integrate Whisper and GPT-4?",
  "What are FHIR-compliant SOAP notes?",
  "How did you solve doctor session expiry in DoctlySuite?",
  "What is your experience with IndexedDB?",
  "What are debounced background queues?",
  "Why is baseline wander a problem in ECGs?",
  "How do Butterworth filters work?",
  "What classifier metrics do you focus on?",
  "What is an F1-score?",
  "Have you worked with Random Forests and XGBoost?",
  "What is a 1D CNN used for?",
  "Tell me about Forgededge trade analytics.",
  "How do you measure sub-300ms AI pipeline performance?",
  "Tell me about your cursor trail animation.",
  "How did you build the binary rain background?",
  "What is the luxury portfolio design theme?",
  "How do you write high-performance canvas loops?",
  "What is your approach to dark/light modes?",
  "Tell me about your experience with serverless APIs?",
  "How do you minimize cold start times?",
  "What is your experience with SQL window functions?",
  "How do you partition databases for analytics?",
  "What push notification services have you integrated?",
  "Tell me about Firestore security rules.",
  "What is your approach to project auditing?",
  "How do you deploy production-ready Docker containers?",
  "Describe your experience with AWS RDS.",
  "What is your approach to system security?",
  "Where can I download your CV and Resume?"
];

const cannedReplies = [
  {
    test: /stack|tech|tools|language/i,
    reply: "My core stack is Laravel, React, TypeScript, and PostgreSQL for full-stack work. Python for ML/data science, Docker for deployment, and AWS for cloud infrastructure. I'm also certified in Azure AI and GCP ML Fundamentals.",
  },
  {
    test: /project|work|case|build/i,
    reply: "My flagship projects include DoctlySuite — a clinical workflow platform with AI scribes, and Forgededge — an AI trading analytics engine where any user data is utilized by complex background AI. I also published AFib detection research at ICSCDS 2025.",
  },
  {
    test: /contact|reach|hire|email/i,
    reply: "Best way to reach me is email: asthanarachit@gmail.com. I also respond quickly on LinkedIn. I'm open for full-stack engineering roles, freelance architecture work, and AI integration projects.",
  },
  {
    test: /doctly|medical|clinical|hipaa/i,
    reply: "DoctlySuite is a multi-tenant clinical platform built with Laravel, React, and Inertia.js. It features AI-powered scribes using OpenAI Whisper and GPT-4, IndexedDB auto-saving for session recovery, and HIPAA-compliant audit trails. Cut transcription time from hours to minutes in clinical pilots.",
  },
  {
    test: /afib|ecg|heart|cardiac|research/i,
    reply: "My AFib detection research uses Pan-Tompkins R-peak extraction, Bandpass Butterworth filtering, and an ensemble of Random Forests, XGBoost, and 1D CNN classifiers. Achieved 96.4% accuracy on MIT-BIH data. The paper was accepted at ICSCDS 2025.",
  },
  {
    test: /forgededge|trading|trade|ai.?engine/i,
    reply: "Forgededge is a high-performance trading analytics platform where any user-provided trading data is utilized to its maximum extent by a complex background AI architecture, vector RAG pipelines, and real-time WebSockets.",
  },
  {
    test: /laravel|php|backend/i,
    reply: "Laravel is the backbone of my backend work. DoctlySuite and Forgededge run on it — multi-tenant workspaces, Eloquent with custom scopes, queue-driven AI pipelines, and WebSocket broadcasting.",
  },
  {
    test: /react|frontend|ui|interface/i,
    reply: "This portfolio itself is built in React 19 with Vite 7. I use React for everything from clinical dashboards to interactive data visualizations — hooks, lazy loading, canvas integrations, and performance-optimized rendering.",
  },
  {
    test: /python|ml|machine.?learn|data.?science/i,
    reply: "Python powers my ML and data science work. Used PyTorch, Scikit-learn, and SciPy for AFib detection research. At JPMC, I performed EDA on financial datasets with Pandas and R during my internship.",
  },
  {
    test: /docker|container|devops|deploy/i,
    reply: "Multi-stage Docker builds, docker-compose for local dev stacks, and containerized CI/CD pipelines. Every project I build runs identically from my laptop to production. Also experienced with Nginx, systemd, and cloud deployment.",
  },
  {
    test: /aws|cloud|azure|gcp/i,
    reply: "AWS for production: EC2, RDS, S3, CloudFront, Lambda. Certified in Azure AI Fundamentals (AI-900) and GCP ML Fundamentals. I'm comfortable across all three major clouds.",
  },
  {
    test: /experience|intern|jpmorgan|jpmc|medtour/i,
    reply: "Software Engineering Intern at JPMorgan Chase & Co. (Nov 2023) — EDA on financial portfolio datasets with Python and R. Data Analytics Intern at MedTourEasy (Aug 2023) — full lifecycle analytics with Pandas, MySQL, and Scikit-learn. B.Tech CSE (AI & Robotics) from VIT Chennai, CGPA 8.24.",
  },
  {
    test: /education|degree|college|vit|university/i,
    reply: "B.Tech in Computer Science Engineering with AI & Robotics specialization from Vellore Institute of Technology, Chennai. CGPA 8.24. Graduated July 2025 with a published research paper and production software in my portfolio.",
  },
  {
    test: /certif|azure.?ai|gcp.?ml|sfpc/i,
    reply: "Certified in Azure AI Fundamentals (AI-900), GCP Machine Learning Fundamentals, SFPC (Scrum Foundation Professional Certificate), MySQL for Business Intelligence, and IIT Bombay Python/Java/C++ certifications.",
  },
  {
    test: /database|mysql|postgres|sql|firebase/i,
    reply: "MySQL for analytics workflows, PostgreSQL for DoctlySuite (JSONB, full-text search, row-level security), Firebase for rapid prototyping, and ChromaDB for vector search in AI applications.",
  },
  {
    test: /linux|terminal|bash|server/i,
    reply: "I develop on Linux daily — Bash scripting, systemd services, SSH tunneling, Nginx configuration, and server administration. It's not just a tool, it's my primary operating system.",
  },
  {
    test: /ai|openai|gpt|whisper|langchain/i,
    reply: "I integrate AI into real products. DoctlySuite uses OpenAI Whisper for voice transcription and GPT-4 for SOAP note generation. Forgededge uses complex AI architectures for trading intelligence.",
  },
  {
    test: /resume|cv|download/i,
    reply: "You can view and download my Resume and CV from the navigation bar — look for the 'Resume' and 'CV' links. They're also available in Professional mode with direct download buttons.",
  },
  {
    test: /freelan|available|open|looking/i,
    reply: "Yes, I'm open for work! Full-stack engineering roles, freelance architecture projects, and AI integration consulting. Best way to discuss: asthanarachit@gmail.com or LinkedIn.",
  },
  {
    test: /who|about|yourself|tell.?me/i,
    reply: "I'm Rachit Asthana — a product engineer who builds production software from database schemas to pixel-perfect UIs. CS graduate from VIT Chennai, former JPMC Software Engineering Intern, and creator of DoctlySuite and Forgededge. I care about clean architecture, real users, and shipping fast.",
  },
];

const defaultReply = "I'm Rachit Asthana — a product engineer specializing in full-stack architecture with Laravel, React, and cloud platforms. Ask me about my projects, tech stack, experience, or anything else!";

function getReply(text) {
  const match = cannedReplies.find((item) => item.test.test(text));
  return match ? match.reply : defaultReply;
}

function getRandomPrompts() {
  const shuffled = [...promptOptions].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, 3);
}

function createMessage(role, text) {
  return {
    id: `${role}-${Date.now()}-${Math.random().toString(16).slice(2)}`,
    role,
    text,
  };
}

export default function ResumeAIWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState(() => [
    createMessage("ai", "Ask me about projects, stack, or how I build full-stack products."),
  ]);
  const [input, setInput] = useState("");
  const [isThinking, setIsThinking] = useState(false);
  const [activePrompts, setActivePrompts] = useState(() => getRandomPrompts());
  const listRef = useRef(null);
  const inputRef = useRef(null);

  const promptList = useMemo(() => promptOptions, []);

  useEffect(() => {
    const list = listRef.current;
    if (!list) return;
    list.scrollTop = list.scrollHeight;
  }, [messages, isThinking]);

  async function sendMessage(text) {
    const trimmed = text.trim();
    if (!trimmed) return;

    const userMsg = createMessage("user", trimmed);
    const updatedMessages = [...messages, userMsg];

    setMessages(updatedMessages);
    setIsThinking(true);

    try {
      const apiMessages = updatedMessages.map((msg) => ({
        role: msg.role === "ai" ? "assistant" : "user",
        content: msg.text,
      }));

      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ messages: apiMessages }),
      });

      const data = await response.json();

      if (!response.ok || data.error) {
        throw new Error(data.error || "Failed to fetch response");
      }

      setMessages((prev) => [...prev, createMessage("ai", data.reply)]);
    } catch (error) {
      console.error("AI Widget error:", error);
      const fallbackReply = getReply(trimmed);
      setMessages((prev) => [
        ...prev,
        createMessage("ai", `${fallbackReply} (Offline Mode: ${error.message})`),
      ]);
    } finally {
      setIsThinking(false);
    }
  }

  function handleSubmit(event) {
    event.preventDefault();
    sendMessage(input);
    setInput("");
  }

  return (
    <div className="resume-ai-widget" aria-label="Rachit's Resume AI">
      {open && (
        <section className="resume-ai-panel" id="resume-ai-panel">
          <header className="resume-ai-header">
            <div className="resume-ai-title">
              <Sparkles size={14} />
              <span>Rachit&apos;s Resume AI</span>
            </div>
            <span className="resume-ai-status">Ready</span>
          </header>

          <div className="resume-ai-body" ref={listRef} role="log" aria-live="polite">
            {messages.map((message) => (
              <div key={message.id} className={`resume-ai-message ${message.role}`}>
                <div className="resume-ai-bubble">
                  {message.text}
                </div>
              </div>
            ))}

            {isThinking && (
              <div className="resume-ai-message ai">
                <div className="resume-ai-bubble resume-ai-typing" aria-label="AI is typing">
                  <span />
                  <span />
                  <span />
                </div>
              </div>
            )}
          </div>

          <div style={{ padding: "8px 14px 2px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ fontSize: "10px", fontFamily: "var(--font-mono)", color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.5px" }}>Suggested Prompts</span>
            <button
              type="button"
              onClick={() => setActivePrompts(getRandomPrompts())}
              style={{
                background: "none",
                border: "none",
                color: "var(--accent)",
                cursor: "pointer",
                padding: "2px",
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                transition: "transform 0.2s ease"
              }}
              onMouseEnter={(e) => { e.currentTarget.style.transform = "rotate(30deg)"; }}
              onMouseLeave={(e) => { e.currentTarget.style.transform = "rotate(0deg)"; }}
              title="Shuffle suggestions"
            >
              <RefreshCw size={10} />
            </button>
          </div>
          <div className="resume-ai-prompts" aria-label="Suggested prompts" style={{ paddingTop: "4px" }}>
            {activePrompts.map((prompt) => (
              <button
                key={prompt}
                type="button"
                className="resume-ai-prompt"
                onClick={() => {
                  sendMessage(prompt);
                  setActivePrompts(getRandomPrompts());
                }}
              >
                {prompt}
              </button>
            ))}
          </div>

          <form className="resume-ai-input" onSubmit={handleSubmit}>
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(event) => setInput(event.target.value)}
              placeholder="Ask about experience, stack, or projects"
              aria-label="Ask Rachit's Resume AI"
            />
            <button type="submit" className="resume-ai-send" disabled={!input.trim()}>
              Ask
            </button>
          </form>
        </section>
      )}

      <button
        type="button"
        className="resume-ai-fab"
        onClick={() => setOpen((value) => !value)}
        aria-expanded={open}
        aria-controls="resume-ai-panel"
        data-label="resume ai"
      >
        <Sparkles size={15} />
      </button>
    </div>
  );
}

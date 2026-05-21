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
  "What IoT and embedded systems have you built?",
  "How do you optimize Laravel database performance?",
  "What is Inertia.js and why do you use it?",
  "How does the Pan-Tompkins algorithm work in your ECG project?",
  "What ML classifiers did you test for AFib detection?",
  "Tell me about your ESP32-CAM gate entry system.",
  "How did you manage PSRAM limits on the ESP32-CAM?",
  "What is the Kalman filter used for in your IoT projects?",
  "Describe your experience with React 19.",
  "What libraries do you use for animations?",
  "How do you ensure HIPAA compliance in DoctlySuite?",
  "What database indexing strategies do you use?",
  "How do you configure multi-tenant isolation in Laravel?",
  "Tell me about your EV battery telemetry system.",
  "What MQTT brokers do you prefer for IoT?",
  "Tell me about your conference paper for ICSCDS 2025.",
  "What is your academic background?",
  "Have you worked with Docker and containerization?",
  "What AWS services have you used?",
  "How do you set up CI/CD pipelines?",
  "Tell me about your experience with FreeRTOS.",
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
  "What is your role at MedTourEasy?",
  "Describe your contributions as a MedTourEasy trainee.",
  "What was your main project at MedTourEasy?",
  "What is your experience with C++ in microcontrollers?",
  "How do you interface ESP32 with RFID readers?",
  "Tell me about your obstacle avoidance robot.",
  "What motor drivers have you worked with?",
  "How do you optimize deep sleep power draw?",
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
  "Tell me about your battery management system.",
  "How do you measure cell voltage resolutions?",
  "What is your pathfinding algorithm preference?",
  "Tell me about your cursor trail animation.",
  "How did you build the binary rain background?",
  "What is the luxury portfolio design theme?",
  "How do you write high-performance canvas loops?",
  "What is your approach to dark/light modes?",
  "Tell me about your experience with serverless APIs?",
  "How do you minimize cold start times?",
  "What is your experience with SQL window functions?",
  "How do you partition databases for telemetry?",
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
    test: /stack|tech|tools/i,
    reply: "Laravel, React, TypeScript, Node.js, and cloud services for full-stack delivery with clean UX.",
  },
  {
    test: /project|work|case/i,
    reply: "Recent work includes DoctlySuite, AFib research tooling, and automation-heavy product builds.",
  },
  {
    test: /contact|reach|hire/i,
    reply: "Best contact is email or LinkedIn. I respond fast to clear scopes and outcomes.",
  },
];

const defaultReply = "Full-stack product engineering, systems-minded UX, and shipping features that hold up.";

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

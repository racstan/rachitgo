import React, { useMemo, useRef, useState, useEffect } from "react";
import { Sparkles } from "lucide-react";

const promptOptions = [
  "What do you build?",
  "Share your tech stack",
  "Show recent projects",
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

          <div className="resume-ai-prompts" aria-label="Suggested prompts">
            {promptList.map((prompt) => (
              <button
                key={prompt}
                type="button"
                className="resume-ai-prompt"
                onClick={() => {
                  setInput(prompt);
                  inputRef.current?.focus();
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

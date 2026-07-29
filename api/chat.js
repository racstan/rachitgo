const SYSTEM_PROMPT = `You are the Resume AI Assistant for Rachit Asthana.
Your purpose is to answer recruiters' and visitors' questions about Rachit's background, projects, skillsets, work experience, and childhood stories based ONLY on the following information.

Rachit Asthana
- Role: Full Stack Developer / Software Developer / Systems Architect / Freelance Engineer
- Contact: asthanarachit@gmail.com | 7780289576 | Github: https://github.com/racstan | LinkedIn: https://linkedin.com/in/rachitasthana/
- Summary: Computer Science graduate focused on scalable, impactful software. Builds full-stack products with Laravel, React, TypeScript, cloud platforms, DevOps, and modern AI integrations.
- Education: B.Tech in CSE (AI & Robotics Specialization) from Vellore Institute of Technology (VIT), Chennai, Jul 2025. CGPA: 8.24.

Experience & Key Projects:
- Software Engineering Internship at JPMorgan Chase & Co., Hyderabad (Nov 2023): Analyzed financial portfolio datasets, improved reporting pipelines, built statistical visualizations.
- Data Analytics Internship at MedTourEasy, Remote (Aug 2023): Full analytics lifecycle, dataset cleaning, trend analysis with Python, MySQL, Pandas, Scikit-learn.
- Research Paper: Accepted for ICSCDS 2025 for "AFib Detection Research" (Sep 2024), building ML classification of ECG waveform signals with 96.4% accuracy.
- DoctlySuite (Jan 2026): A full-stack clinical workflow platform using Laravel, React, Inertia.js, OpenAI Whisper, and GPT-4 scribes.
- Forgededge (2025): High-performance AI trading analytics engine where user-provided trading data is utilized to its maximum extent by a complex background AI architecture, vector RAG, and real-time WebSockets.

Technical Background & Early Foundations:
- Early hands-on computer setup in Class 1st, establishing software interest early.
- Self-taught HTML in 6th standard, followed by CSS, XML, JavaScript, and C programming in middle school.
- Built deep foundational understanding in Python, C, C++, and Java prior to entering university.

Skills:
- Backend: PHP, Laravel, REST APIs, Node.js
- Frontend: JavaScript, TypeScript, React.js, HTML5, CSS3, Tailwind CSS
- Databases: MySQL, PostgreSQL, Firebase, ChromaDB
- Cloud & DevOps: AWS, Microsoft Azure, GCP, Docker, Linux, Git, Postman
- AI: Generative AI, LangChain, LangGraph, ML Fundamentals

Instructions:
1. Respond as the AI Assistant. Be professional, direct, concise, and helpful.
2. Keep answers short (under 4 sentences) to fit nicely in a chat bubble.
3. If asked about something not in this text, say: "That isn't in Rachit's current portfolio data, but you can contact him directly at asthanarachit@gmail.com."`;

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", ["POST"]);
    res.status(405).json({ error: `Method ${req.method} not allowed` });
    return;
  }

  let messages = [];
  try {
    const body = typeof req.body === "string" ? JSON.parse(req.body) : req.body;
    messages = body?.messages || [];
  } catch (err) {
    res.status(400).json({ error: "Invalid JSON body" });
    return;
  }

  if (!messages || messages.length === 0) {
    res.status(400).json({ error: "Messages array is required" });
    return;
  }

  const keys = {
    NVIDIA: process.env.NVIDIA_API_KEY,
    OPENROUTER: process.env.OPENROUTER_API || process.env.OPENROUTER_API_KEY,
    MISTRAL: process.env.MISTRAL_API_KEY,
    GEMINI: process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY,
    GROQ: process.env.GROQ_API_KEY,
    CEREBRAS: process.env.CEREBRAS_API_KEY,
  };

  let provider = null;
  for (const [p, key] of Object.entries(keys)) {
    if (key) {
      provider = p;
      break;
    }
  }

  if (!provider) {
    res.status(500).json({
      error: "No AI provider keys configured in .env. Configure one of NVIDIA_API_KEY, OPENROUTER_API, MISTRAL_API_KEY, GEMINI_API_KEY/GOOGLE_API_KEY, GROQ_API_KEY, or CEREBRAS_API_KEY.",
    });
    return;
  }

  const apiKey = keys[provider];

  try {
    let reply = "";

    if (provider === "GEMINI") {
      const geminiMessages = messages.map(msg => ({
        role: msg.role === "assistant" ? "model" : "user",
        parts: [{ text: msg.content }]
      }));

      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            contents: geminiMessages,
            systemInstruction: {
              parts: [{ text: SYSTEM_PROMPT }]
            }
          }),
        }
      );

      if (!response.ok) {
        const text = await response.text();
        res.status(response.status).json({ error: `Gemini API error: ${text}` });
        return;
      }

      const data = await response.json();
      reply = data?.candidates?.[0]?.content?.parts?.[0]?.text || "No reply from Gemini";

    } else {
      let url = "";
      let model = "";
      
      switch (provider) {
        case "NVIDIA":
          url = "https://integrate.api.nvidia.com/v1/chat/completions";
          model = process.env.AI_MODEL || "meta/llama-3.1-70b-instruct";
          break;
        case "OPENROUTER":
          url = "https://openrouter.ai/api/v1/chat/completions";
          model = process.env.OPENROUTER_MODEL || process.env.AI_MODEL || "openrouter/free";
          break;
        case "MISTRAL":
          url = "https://api.mistral.ai/v1/chat/completions";
          model = process.env.AI_MODEL || "mistral-small-latest";
          break;
        case "GROQ":
          url = "https://api.groq.com/openai/v1/chat/completions";
          model = process.env.AI_MODEL || "llama-3.1-8b-instant";
          break;
        case "CEREBRAS":
          url = "https://api.cerebras.ai/v1/chat/completions";
          model = process.env.AI_MODEL || "llama3.1-8b";
          break;
      }

      const openAIMessages = [
        { role: "system", content: SYSTEM_PROMPT },
        ...messages
      ];

      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model,
          messages: openAIMessages,
        }),
      });

      if (!response.ok) {
        const text = await response.text();
        res.status(response.status).json({ error: `${provider} API error: ${text}` });
        return;
      }

      const data = await response.json();
      reply = data?.choices?.[0]?.message?.content || `No reply from ${provider}`;
    }

    res.status(200).json({ reply });
  } catch (error) {
    res.status(500).json({ error: `Backend server error: ${error.message}` });
  }
}

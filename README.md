# Rachit Portfolio

A React + Vite portfolio with two presentation modes, glassmorphism UI, and keyboard-first navigation.

## Features

- Dual modes: Full (interactive) and Professional (clean, recruiter-friendly) with hardware fallback detection.
- Glass surfaces across cards, navbar, command palette, and professional sections.
- Draggable tilt cards with slow, peaceful return motion.
- Tech stack scroller with click/focus details and deep-linkable stack pages for every technology.
- Interactive timeline tags: Clickable technology tags on Journey/Experience cards that open info popovers linking directly to detailed technology pages.
- Quick Switch command palette for fast navigation and mode toggling.
- Resume AI Widget: A conversational chatbot using LLMs (supporting OpenRouter, Google, OpenAI, Groq, Cerebras, etc. through `.env` configurations) to answer recruiter inquiries.
- Downloads Dropdown & Inline Viewer: Premium navigation options to view or download Rachit Asthana's CV or Resume PDFs inline.
- Binary rain background and a springy cursor trail in Full mode.
- GitHub snapshot with contribution calendar and top repositories via a server-side GraphQL request.
- Scroll controls for section-by-section navigation, fading in dynamically on scroll.
- Error boundary to keep the UI stable on component failures.

## Keyboard Navigation

- Tab/Shift+Tab: move across interactive controls and cards.
- Arrow Up/Down or Page Up/Down: jump between sections.
- Home/End: jump to top/bottom of the page.
- / or Cmd/Ctrl+K: open Quick Switch.
- Esc: close Quick Switch.
- Arrow Up/Down inside Quick Switch: move the active result; Enter to navigate.
- Skip link: press Tab at the top to jump directly to main content.

## Development

- Install dependencies: `npm install`
- Start dev server: `npm run dev`
- Build: `npm run build`
- Preview build: `npm run preview`

## Serverless / API Proxy Setup

- Add the following keys to your [.env](.env) file:
  - `GITHUB_TOKEN` and `GITHUB_USERNAME` (for contribution calendar & top repositories).
  - AI Provider credentials (for the Resume AI Widget):
    - `OPENROUTER_API_KEY` (highly recommended, defaults to a free model like `google/gemini-2.5-flash:free` or `meta-llama/llama-3-8b-instruct:free`).
    - Or standard keys like `GEMINI_API_KEY`, `OPENAI_API_KEY`, `GROQ_API_KEY`, `MISTRAL_API_KEY`, etc.
- The client routes requests through `/api/github` and `/api/chat` proxies to preserve API keys in client-side production builds.

## Notes

- Full mode is the default for accelerated browsers; Professional mode is used when acceleration is not detected.
- Use `?mode=full` or `?mode=professional` in the URL to force a mode for review.

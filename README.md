# Rachit Portfolio

A React + Vite portfolio with two presentation modes, glassmorphism UI, and keyboard-first navigation.

## Features

- Dual modes: Full (interactive) and Professional (clean, recruiter-friendly) with hardware fallback detection.
- Glass surfaces across cards, navbar, command palette, and professional sections.
- Draggable tilt cards with slow, peaceful return motion.
- Tech stack scroller with click/focus details and deep-linkable stack pages.
- Quick Switch command palette for fast navigation.
- Binary rain background and a springy cursor trail in Full mode.
- GitHub snapshot with contribution calendar and top repositories via a server-side GraphQL request.
- Stack detail pages for every tech item, plus a stack index.
- Scroll controls for section-by-section navigation.
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

## GitHub Contributions

- Add `GITHUB_TOKEN` and `GITHUB_USERNAME` to [.env](.env).
- The client calls `/api/github`, which proxies GitHub GraphQL using the token for contributions and top repositories.
- Vite dev server includes a middleware proxy for `/api/github`; production should use the serverless handler in [api/github.js](api/github.js).

## Notes

- Full mode is the default for accelerated browsers; Professional mode is used when acceleration is not detected.
- Use `?mode=full` or `?mode=professional` in the URL to force a mode for review.

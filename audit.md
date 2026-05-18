# Portfolio Audit

Updated: 2026-05-18

## Snapshot

- Scope: developer portfolio for Rachit Asthana with CV-backed content, interactive polish, and recruiter-readable flow.
- Goal: keep the site memorable without making interaction cost higher than content value.
- Current direction: full mode for the animated technical experience, professional mode for one-page recruiter readability, glass surfaces, bounded cards, stack proof pages, and quick navigation.

## External Inspiration Reviewed

- Brittany Chiang: clean writing, strong hierarchy, and minimal distraction.
- Bruno Simon: one unforgettable interaction, but not a pattern to copy everywhere.
- Josh Comeau: personal site as a proof/content engine, not just a landing page.
- Robby Leonardi: resume as an interactive story with clear progression.
- Themed portfolio examples from WordPress/Colorlib-style galleries: consistent visual metaphor matters more than random effects.

Detailed notes are in `suggestions.md`.

## Strengths

- Strong visual identity: atom cursor, binary field, glass panels, and technical typography feel cohesive.
- CV-backed content is now more credible than placeholder copy.
- My Journey timeline gives the portfolio a personal story instead of only project cards.
- Stack items now have expandable detail pages, giving the site room to grow into proof pages.
- New command palette improves navigation without adding heavy animation.
- Professional Mode now provides a Brittany-Chiang-style low-motion reading path.

## Fixed In This Pass

- Added a GitHub contributions calendar to the Home snapshot section (server-side proxy via `/api/github`).
- Added top repositories to the GitHub snapshot card.
- Replaced the cursor with a springy, canvas-based trail that follows the pointer smoothly.
- Made tech stack detail cards open on click/focus only, with a cloud-like connector treatment.
- Improved keyboard-only navigation with focus trapping in Quick Switch and ARIA on navigation.
- Adjusted Quick Switch contrast in light mode for better visibility.
- Slowed down card drag response and return so the throw feels calmer and more deliberate.
- Refreshed glassmorphism on cards, navbar, and overlays based on new CodePen references.
- Unified remaining glass blur values to the shared glass variables for consistency.
- Added keyboard navigation support: skip link, focus-visible styling, section-to-section shortcuts, and command-palette arrow selection.
- Replaced the atom cursor with a springy trail cursor.
- Collapsed and moved the Quick Switch button to the RHS beneath the scroll controls to avoid text overlap.
- Removed the broken draggable heading scrubber.
- Increased bounded card drag range and slowed return to avoid glitchy snap-back.
- Prevented card drag from activating when clicking internal buttons or links.
- Made timeline expand controls conditional: only clamped/expandable text gets a button.
- Fixed tech-stack hover card clipping by allowing the popover to render outside the moving track wrapper.
- Added top/bottom-aware scroll controls.
- Added `suggestions.md` with external reference notes.
- Added Professional Mode with hardware-acceleration fallback detection.
- Added `?mode=full` and `?mode=professional` overrides for testing and review.
- Added an error boundary so component failures show a stable fallback instead of a blank page.

## Remaining Gaps

- Project cards still need true case-study pages with screenshots, architecture decisions, and outcomes.
- Blog entries are still placeholders and should be replaced with real writing or hidden.
- GitHub snapshot is still qualitative; avoid fake counts unless using real API-backed data.
- Tech-stack detail pages are currently short proof stubs, not full evidence pages.
- Accessibility still needs a complete reduced-motion toggle and contrast review.

## Recommendations

- Build case-study pages first for DoctlySuite and AFib research.
- Keep one signature motion system and remove effects that compete with reading.
- Keep Professional Mode stable and low-motion; add richer proof only after case studies exist.
- Add public resume download only after the CV PDF is ready to expose.
- Treat every visible metric as sourced or remove it.

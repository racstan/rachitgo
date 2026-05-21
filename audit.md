# Portfolio Audit

Updated: 2026-05-20

## Snapshot

- **Scope**: Developer portfolio for Rachit Asthana with CV-backed content, interactive code simulation, and recruiter-readable layout paths.
- **Goal**: Provide a highly memorable and premium technical portfolio that showcases building craft, low-level execution context, and clean design without introducing unnecessary interaction friction.
- **Current Direction**: Dual-mode setup:
  - **Full Mode**: High-fidelity animated technical experience featuring a canvas spring trail cursor, interactive logic simulation lab, command palette, and reactive card layers.
  - **Professional Mode**: Clean, recruiter-readable single-page layout based on Brittany Chiang-style minimal distraction, with direct access to proof sections.

## External Inspiration Reviewed

- **Brittany Chiang**: Clean structure, strong readable hierarchy, and low motion. Applied as the foundational aesthetic for Professional Mode.
- **Bruno Simon**: Highly memorable single-signature interaction. Adapted by keeping card-drag interactions playful but bounded and lightweight to avoid heavy physics.
- **Josh Comeau**: Focus on building a proof and content engine. Implemented via dedicated tech-stack detail subpages and a command palette to access specific content blocks.
- **Robby Leonardi**: Memorable narrative progression. Applied to the "My Journey" timeline with explicit, layout-stable expand controls.
- **Glassmorphism References (Erichologist / Ibbatta)**: Refreshed card shadows, frosted borders, and backdrops across navbar, command palette, and hover overlays to create crisp, premium layers.

## Strengths

- **High-Fidelity Interaction**: Fluid, physics-based spring trail emoji cursor that dynamically follows the pointer and fades on pause. Unified UI physics with a 3D hover-tilt and spring-damped drag-and-bounce behavior on both the project cards and global navbar.
- **Interactive Code Lab**: The CPU/Execution simulator under `/lab` uses a dynamic canvas map with custom pulsing node connections, mimicking a step-by-step low-level translation of source code down to hardware signals.
- **Production-Ready Builds**: Clean, modular React component architecture (using React 19 and Vite 7) that builds into a lightweight client bundle under 2 seconds.
- **Dual-Experience Flexibility**: User-controlled capability toggle (Full Mode / Professional Mode) with local storage persistence and fallback detection for non-accelerated graphic environments.
- **Translucent Glass Layout**: Cohesive styling utilizing CSS variables for blur and sheens, maintaining legibility in both dark and light modes.
- **Command Palette & Accessibility**: Focus trapping, ARIA tags, screen-reader skip links, and keybind listeners (arrows, Space, PageUp/PageDown, Home, End) are fully integrated.
- **Scroller Control Interruption & Pause Robustness**: Rebuilt TechScroller animation loop pausing using reactive detection of active popover state, stopping scrolling completely when hovering or pinning cards.
- **Interactive Timeline Tag Popovers**: Mapped static timeline tags in My Journey and My Experience sections to interactive popover elements that mirror TechScroller cards, permitting direct detail page expansion.
- **Scroll Position Restoration**: Configured explicit `window.scrollTo` cleanup triggers on React Router transitions to resolve partial-scroll clipping when moving between portfolio views.
- **Stack Card Layout Overlap Fix**: Converted `.stack-detail-card` layout from CSS Grid to a clean, responsive Flex Column, resolving text overlaps and layout squeeze caused by grid row-column mismatch.

- **Scroll Event Throttling**: Optimized the scroll listener in App.jsx and Navbar.jsx using requestAnimationFrame ticking, preventing virtual DOM recalculations when scroll boundaries are unchanged.
- **Canvas Performance & Reflow Guard**: Cached container boundaries and theme variables outside the requestAnimationFrame loop in Inspector.jsx, eliminating forced synchronous layouts.
- **Resume/CV PDF Integration**: Integrated CV2026.pdf download links across Navbar, Contact page, and the Professional mode hero CTA.
- **Detailed Case Studies**: Implemented full, evidence-backed case study detail pages (/projects/:id) for DoctlySuite, AFib Research, and IoT Systems outlining problem statements, metrics, architecture layers, and outcomes.
- **Interactive Blog Modal Reader**: Replaced empty anchors on BlogsPage.jsx with a premium overlay modal reader that parses and renders code snippets and rich markdown-like text.

- **Downloads Link Redirection & CV/Resume Splitting**: Replaced the navbar hover menu with direct separate links to view/download CV and Resume in their respective viewer views, and cleaned contact details with standard SVG telephone/contact icons.
- **Rotating Peculiar Personas**: Configured custom role profiles in the hero section ("Citizen of Earth", "Clash of Clans player (Yes I still do upgrades)", "Age of Empires lover", etc.) that rotate dynamically in both Full and Professional modes.
- **Language Tech Stack Nicknames**: Updated technology representations with peculiar, developer-focused nicknames (such as `Go (if err != nil Generator)` or `Rust (Borrow Checker Whipping Boy)`) to personalize the codebase narrative.
- **Project Back-to-Detail Button**: Fixed navigation restoration in project detail views by making "Back to projects" anchors point to correct hash references or router state navigation.
- **Implementation Video Embeds**: Embedded responsive interactive video players containing actual implementation demos on all project detail views and tech stack subpages.
- **Dynamic Resume AI Prompts Pool**: Replaced the basic 3 static prompts with a robust list of 100 context-specific suggested questions. Prompts send immediately upon tap and trigger an auto-shuffle to select three fresh options, and include a manual Refresh control.
- **Gradual Cursor Settle Transitions**: Re-engineered cursor event transition CSS to gradually fade out and smooth cursor trail effects when moving over interactive UI controls.

## Remaining Gaps

- **Comprehensive Motion Settings**: The application respects user preferences via media queries but could benefit from a dedicated in-app reduced-motion setting.

## Recommendations

1. **Interactive Lab API Playpen**: Add a mock interactive console to `/lab` allowing recruiters to send mock HTTP request packets and watch system variables mutate.
2. **Dedicated Settings Panel**: Provide recruiters with explicit toggle options for motion triggers, sounds, and terminal themes.


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

- **Scroll Event Throttling**: Optimized the scroll listener in App.jsx and Navbar.jsx using requestAnimationFrame ticking, preventing virtual DOM recalculations when scroll boundaries are unchanged.
- **Canvas Performance & Reflow Guard**: Cached container boundaries and theme variables outside the requestAnimationFrame loop in Inspector.jsx, eliminating forced synchronous layouts.
- **Resume/CV PDF Integration**: Integrated CV2026.pdf download links across Navbar, Contact page, and the Professional mode hero CTA.
- **Detailed Case Studies**: Implemented full, evidence-backed case study detail pages (/projects/:id) for DoctlySuite, AFib Research, and IoT Systems outlining problem statements, metrics, architecture layers, and outcomes.
- **Interactive Blog Modal Reader**: Replaced empty anchors on BlogsPage.jsx with a premium overlay modal reader that parses and renders code snippets and rich markdown-like text.

## Remaining Gaps

- **Comprehensive Motion Settings**: The application respects user preferences via media queries but could benefit from a dedicated in-app reduced-motion setting.

## Recommendations

1. **Interactive Lab API Playpen**: Add a mock interactive console to `/lab` allowing recruiters to send mock HTTP request packets and watch system variables mutate.
2. **Dedicated Settings Panel**: Provide recruiters with explicit toggle options for motion triggers, sounds, and terminal themes.


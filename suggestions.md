# Portfolio Suggestions

Research date: 2026-05-20

## Standout Portfolio References

### Brittany Chiang
- **Interesting feature**: Clean two-column, recruiter-readable layout with strong writing and minimal distraction.
- **Useful idea**: Keep the main content legible and use the interactive layer as support, not as the product itself.
- **Implemented**: *Professional Mode* is a one-page, recruiter-readable layout with simplified navigation, lower motion, and direct proof sections.

### Bruno Simon
- **Interesting feature**: One memorable interaction defines the entire site (e.g., a playful 3D world).
- **Useful idea**: Keep one signature interaction, but avoid making every interaction physically heavy or complex.
- **Implemented**: Card drag movement remains playful, but bounded and lightweight instead of using unbounded physics.

### Josh Comeau
- **Interesting feature**: The site behaves like a content engine with interactive, visual explanations.
- **Useful idea**: Add proof pages and searchable navigation so visitors can move from visual polish into substance.
- **Implemented**: Stack items have detail pages, and the command palette gives fast access to proof areas.

### Robby Leonardi
- **Interesting feature**: The resume is turned into a scrollable, memorable story.
- **Useful idea**: Keep the narrative timeline readable, avoiding layout surprises or sudden jumps.
- **Implemented**: Timeline cards only expand through explicit click controls when text is actually clamped.

---

## Stability & Performance Enhancements

### [COMPLETED]
1. **Decouple React Renders from Canvas rAF Loops** (Completed)
   - **Action**: Cached container boundaries and theme variables outside the requestAnimationFrame loop in Inspector.jsx, eliminating forced synchronous layouts.
2. **Prevent Canvas/rAF Memory Leaks** (Completed)
   - **Action**: Every animation frame loop registers and cleans up via returned callback cancellation.
3. **Throttle Scroll State Event Handlers** (Completed)
   - **Action**: Handled scroll position shifts with a passive requestAnimationFrame throttle, preventing React component updates on identical scroll ranges.
4. **Layout Alignment & Right-Side Cut-off Fix** (Completed)
   - **Action**: Removed hardcoded horizontal margins from the `.app-shell` container, allowing correct centering and layout boundaries on all viewports.
5. **Scroll Controls Smart Opacity & Hover Logic** (Completed)
   - **Action**: Modified scroll control buttons to remain transparent by default (`0.12` opacity) and fade in smoothly upon actual scroll events or cursor hover.

### [MEDIUM PRIORITY]
6. **Group DOM Reads and Writes**
   - **Why**: Interleaving reads (`getBoundingClientRect()`) and writes (`style.transform`) triggers synchronous reflows.
   - **Action**: In `TechScroller.jsx` and `Timeline.jsx`, batch all geometry measurements during initial loads and cache them. Apply transform updates separately inside animation ticks.
7. **Granular Element Error Boundaries**
   - **Why**: A local runtime canvas fail shouldn't crash the entire screen or navigation shell.
   - **Action**: Wrap the code lab, the scroller, and the cursor trail in individual `<ErrorBoundary>` instances so fallbacks are scoped.

### [LOW PRIORITY]
8. **Hardware-Acceleration Battery Fallbacks**
   - **Why**: Running heavy matrix rains and particle paths drains batteries on mobile devices or laptops in power-saver mode.
   - **Action**: Check `navigator.connection` (network state) or implement media queries for `prefers-reduced-motion` to automatically turn off secondary canvas details.

---

## Feature & Interaction Enhancements

### [COMPLETED]
1. **Add Real Case-Study Pages & Full Tech-Stack Deep Dive** (Completed)
   - **Action**: Created case study pages at `/projects/:id` (DoctlySuite, AFib Research, IoT Systems) and built custom detailed project logs for all 15 skills in the scroller strip.
2. **Wire Up Resume CV Download Link & Viewer Dropdown** (Completed)
   - **Action**: Added CV2026.pdf links and built an inline document viewer dropdown under 'Downloads' in the navbar.
3. **Resolve Blog Empty Anchors** (Completed)
   - **Action**: Developed a custom markdown rendering system and modal reader on BlogsPage.jsx.
4. **Multi-Provider AI Resume Widget Integration** (Completed)
   - **Action**: Wrote a dynamic backend chat service (`/api/chat`) calling LLM APIs (OpenRouter, Google, OpenAI, etc.) driven by `.env` configurations.
5. **Resume AI Widget Layout Overlap Fix** (Completed)
   - **Action**: Restructured the widget FAB and panel with CSS Grid relative layout flow to prevent overlaps between the launcher button and input form.
6. **Tech Marquee Scroller Hover & Click Pauses** (Completed)
   - **Action**: Modified marquee scroller loop velocity to immediately pause movement when hovered or card is pinned.
7. **Robust Marquee Scrolling Interrupts** (Completed)
   - **Action**: Re-engineered scroll loop tracking state to pause immediately whenever a popover card is showing or active (whether hovered or clicked/pinned), preventing content drift.
8. **Interactive Timeline Tags Integration** (Completed)
   - **Action**: Converted static timeline technology tags (e.g. Laravel, React) into interactive popover links that display matching stack summaries and expand detail links.
9. **Scroll Restoration on Navigation** (Completed)
   - **Action**: Integrated window scroll coordinate resets on all route changes, solving page-cut-off rendering glitches on page loads.
10. **Stack Detail Card Overlap Fix** (Completed)
    - **Action**: Converted `.stack-detail-card` layout from CSS Grid to a clean, responsive Flex Column, resolving text overlaps and layout squeeze caused by grid row-column mismatch.

### [MEDIUM PRIORITY]
7. **Interactive Lab API Playpen**
   - **Why**: Highlights real-world backend design.
   - **Action**: Extend `/lab` to show a mock REST/API playground where visitors can send dummy requests to `DoctlySuite` and visually watch how JSON fields get validated and written to DB nodes.
8. **CLI / Terminal Navigation Overlay**
   - **Why**: Appeals to developer recruiters and fits the low-level, binary rain theme.
   - **Action**: Create a toggleable terminal modal triggered by the backtick key (`` ` ``) allowing visitors to query basic profile commands like `cat projects.txt`, `help`, or `clear`.
9. **Contrast & Light Mode Pass**
   - **Why**: Accessibility compliance.
   - **Action**: Audit light-mode variables in `styles.css` for WCAG AA compliance (specifically card border boundaries and text buttons on frosted backdrops).

### [LOW PRIORITY]
10. **Micro-Auditory Interactions**
    - **Why**: Creates tactile depth.
    - **Action**: Add subtle, brief audio feedback ticks on toggling Mode/Theme switches (controlled by a main mute configuration).
11. **Animated Connectors**
    - **Why**: Visual storytelling.
    - **Action**: Use dynamic SVG lines to connect tech stack badges in the scroller to their specific detail descriptions upon focus.

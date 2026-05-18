# Changelog

## 2026-05-18

- Added stack detail index links and improved tech stack padding/fade.
- Animated the timeline branch on scroll and added binary index labels.
- Updated card glass surfaces to match the quick-switch glass look.
- Added hover-cycling role line text on the hero.
- Improved card return behavior by disabling tilt effects while settling.
- Fixed GitHub proxy to load .env values in Vite dev server.
- Added top repositories to the GitHub snapshot card.

## 2026-05-17

- Added a GitHub contributions calendar in the Home snapshot section via `/api/github`.
- Implemented a springy, canvas-based cursor trail for Full mode.
- Made tech stack details open on click/focus only, with a cloud-style connector.
- Improved Quick Switch visibility in light mode and added focus trapping.
- Added ARIA metadata for mobile navigation.
- Slowed card drag response and return for a calmer throw/settle feel.
- Enhanced glassmorphism across cards, navbar, and command palette based on new references.
- Added keyboard navigation improvements: skip link, focus-visible styling, section shortcuts, and command palette arrow selection.
- Collapsed and repositioned the Quick Switch button to the RHS beneath the scroll controls to prevent overlap.
- Added Professional Mode: a one-page, recruiter-readable layout inspired by Brittany Chiang's clean portfolio hierarchy.
- Added a Full/Professional mode switch beside the light/dark toggle; professional mode uses a simplified one-page navbar.
- Added graphics-capability detection so low/no hardware acceleration defaults to Professional Mode, while accelerated browsers default to Full Mode.
- Added `?mode=full` and `?mode=professional` URL overrides for testing either mode directly.
- Added an error boundary fallback to prevent blank pages from component render failures.
- Reduced the hero typing block height to recover wasted vertical space.
- Increased bounded card drag range significantly while keeping the slow return spring stable.
- Added more glass styling coverage to the professional layout and error fallback surfaces.
- Increased bounded card drag distance and slowed the return spring so cards can move visibly without the old heavy toss/collision lag.
- Removed the broken draggable vertical heading scrubber and returned headings to stable text rendering.
- Made timeline expand controls appear only when the timeline text is actually clamped/expandable.
- Fixed interactive controls inside cards so clicking expand buttons or links does not trigger card drag and resets the tilt state cleanly.
- Fixed tech-stack hover cards being clipped by the moving stack container and kept pinned cards available for stack detail navigation.
- Made scroll controls context-aware: top shows next/bottom actions, bottom shows previous/top actions, and middle shows previous/next.
- Replaced unbounded toss-card physics with a bounded click-drag spring so cards move only a small distance, keep hover tilt, and return without heavy collision animation.
- Changed heading scrubbers from whole-text swapping to a wider draggable rectangle that reveals alternate text character-by-character across the heading.
- Changed timeline cards to explicit click-to-expand cards with a bottom-right `Click to expand` affordance instead of expanding on hover.
- Reworked the tech stack interaction so clicking a technology pins a moving glass popover with experience notes and an expand link to a dedicated stack detail page.
- Removed the duplicate footer identity label and kept the footer minimal.
- Tightened hero text sizing so long changing text stays inside one line and respects its container boundaries.
- Extended the glass treatment to more panels and removed the heavy tech-stack hover shadow.
- Rebuilt the cursor from `cursor.html` into the React cursor component as a smaller hydrogen-atom style pointer with animated orbital rings, electron trail, and RGB/rainbow coloring.
- Fixed hero typing stability by keeping the name animation inside a fixed-height area, slowing the type/delete cycle, adding hexadecimal display, and adding the role line: `Software Developer / Freelancer / Builder`.
- Removed the old spring-scroll behavior and added center-right 3D keycap scroll buttons with smoother hover/press transitions and page padding so they do not cover content.
- Replaced heading hover text swapping with a draggable vertical scrubber line that previews alternate heading copy while held and snaps back to an end state on release.
- Reworked cards with translucent glass styling, blur, specular highlights, and toss physics: cards can be dragged, thrown, bounce/crash against viewport edges, then magnet back home.
- Removed card vibration-on-hold and kept drag/toss motion as the primary high-level interaction.
- Filled portfolio content from `CV2026.pdf`, including contact links, education, internships, projects, skills, certifications, and professional summary.
- Added the current `my journey.txt` story into the My Journey timeline, preserving the incomplete “to be continued” arc through the current product-building phase.
- Added tech-stack hover cards with per-skill experience notes, including AWS/Azure/GCP and full-stack tools from the CV.
- Improved dark/light mode hover feedback with rotating/glowing sun and moon behavior.
- Disabled normal text selection across the portfolio so the UI behaves like an interactive visual surface.
- Removed placeholder contact channels not present in the CV and kept verified CV-backed contact paths.

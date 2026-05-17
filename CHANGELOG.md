# Changelog

## 2026-05-17

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

# Portfolio Suggestions

Research date: 2026-05-17

## Standout Portfolio References

### Brittany Chiang

- Source: https://brittanychiang.com/
- Interesting feature: clean two-column, recruiter-readable layout with strong writing and minimal distraction.
- Useful idea for this portfolio: keep the main content legible and use the interactive layer as support, not as the product itself.
- Implemented now: Professional Mode is a one-page, recruiter-readable layout with simplified navigation, lower motion, and direct proof sections.

### Bruno Simon

- Source: https://bruno-simon.com/
- Interesting feature: one memorable interaction defines the site: a playful 3D world used as navigation.
- Useful idea for this portfolio: keep one signature interaction, but avoid making every interaction physically heavy.
- Implemented now: card movement remains playful, but bounded and lightweight instead of unbounded collision physics.

### Josh Comeau

- Source: https://www.joshwcomeau.com/
- Interesting feature: the site behaves like a content engine, with useful interactive explanations and deep technical writing.
- Useful idea for this portfolio: add proof pages and searchable navigation so visitors can move from visual polish into substance.
- Implemented now: stack items have detail pages, and the command palette gives fast access to proof areas.

### Robby Leonardi

- Source: http://www.rleonardi.com/interactive-resume/
- Interesting feature: a resume is turned into a scrollable story, making progression memorable.
- Useful idea for this portfolio: keep the My Journey timeline narrative-led, but do not expand content on hover because it causes layout surprise.
- Implemented now: timeline cards only expand through explicit click controls when text is actually clamped.

### Patrick David / Themed Developer Portfolios

- Source: https://wordpress.com/go/web-design/web-developer-portfolio-examples/
- Interesting feature: a strong visual theme can make the site memorable when it is consistent across sections.
- Useful idea for this portfolio: keep the cursor, glass surface, binary atmosphere, and technical identity consistent instead of adding unrelated gimmicks.
- Implemented now: the glass and navigation behavior has been normalized across more panels.

### Glassmorphism References (Erichologist / Ibbatta)

- Source: https://codepen.io/erichologist/pen/PwzzovO
- Source: https://codepen.io/ibbatta/pen/ZYOzrzg
- Interesting feature: layered highlights, strong blur, and crisp borders create a convincing frosted glass surface.
- Useful idea for this portfolio: increase the glass sheen on cards, navbar, and overlays without sacrificing contrast.
- Implemented now: glass layers were refreshed across cards, navbar, and the command palette, with stronger blur and highlights.

## Next High-Value Ideas

- Add real case-study pages for DoctlySuite and AFib research with problem, constraints, architecture, outcome, and screenshots.
- Add a small "proof mode" toggle that hides decorative effects and emphasizes recruiter-readable content.
- Keep Professional Mode as the default fallback for low/no hardware acceleration.
- Use `?mode=full` or `?mode=professional` during review to force either mode without relying on browser graphics detection.
- Add downloadable resume access from the contact page once the final PDF is intended for public visitors.
- Replace placeholder blog posts with one or two real engineering notes.
- Finish the accessibility pass: reduced-motion toggle and contrast checks.

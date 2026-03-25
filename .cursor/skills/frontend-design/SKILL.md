---
name: frontend-design
description: Create distinctive, production-grade frontend interfaces with high design quality. Use this skill when the user asks to build web components, pages, or applications. Generates creative, polished code that avoids generic AI aesthetics.
license: Complete terms in LICENSE.txt
---

# Frontend Design

## Intent
Creates distinctive, production-grade frontend interfaces with exceptional visual coherence. This skill helps avoid generic "AI slop" aesthetics by enforcing intentional design decisions (typography, color, layout, motion, and details) and delivering working code.

## Quick Start (Agent Workflow)
1. **Clarify requirements (only if missing)**: purpose, audience, tone/aesthetic preference, target framework (Next.js/React/Vue/vanilla), styling approach (Tailwind/CSS modules/styled-components), routing/page placement, and any constraints (performance, SEO, accessibility, brand assets).
2. **Write a one-paragraph aesthetic brief**:
   - **Purpose** (what problem it solves; who uses it)
   - **Tone** (pick one bold direction)
   - **Constraints** (tech + accessibility + content)
- **Differentiation** (the "one thing" people remember)
3. **Choose an implementation plan that matches the aesthetic**:
   - Minimalist/refined direction: emphasize spacing, typography, grid discipline, and subtle details.
   - Maximalist direction: emphasize layered effects, orchestrated motion, richer backgrounds/textures, and more component-level choreography.
4. **Build a small design system first**:
   - CSS variables for colors/spacing/radii/shadows
   - A typography scale (display + body) and clear hierarchy
   - A consistent motion approach (durations/easing + prefers-reduced-motion)
5. **Implement working UI** end-to-end (not mockups):
   - Real layout/components, empty states, basic interactions, and responsive behavior
   - Focus/keyboard accessibility and semantic structure
6. **Run a final design+quality pass**:
   - Cohesion check (typography/colors/layout/motion all point to the same direction)
   - Accessibility check (focus visibility, reduced motion, contrast)
   - "No generic vibe" check (typography and layout aren't copy-paste defaults)

## Design Thinking
Before coding, commit to a **BOLD aesthetic direction**:
- **Purpose**: What problem does this interface solve? Who uses it?
- **Tone**: Choose one extreme (examples: brutally minimal, maximalist chaos, retro-futuristic, organic/natural, luxury/refined, playful/toy-like, editorial/magazine, brutalist/raw, art deco/geometric, soft/pastel, industrial/utilitarian, etc.). Execute it with precision.
- **Constraints**: Framework, performance expectations, SEO needs, accessibility requirements, and any brand assets.
- **Differentiation**: What makes this unforgettable? What detail will people remember?

Then implement working code that is:
- Production-grade and functional
- Visually striking and memorable
- Cohesive with a clear design point-of-view
- Meticulously refined in every detail

## Frontend Aesthetics Guidelines
Focus on:
- **Typography**: Prefer distinctive fonts (especially for headings). Avoid generic fonts like Arial and Inter unless the project already uses them and constraints demand it. If the repo already has a font setup, reuse it. Otherwise, pick a characterful display + refined body pairing that matches the chosen tone.
- **Color & Theme**: Commit to a cohesive palette via CSS variables. Use a dominant color story with sharp accents. Avoid timid, evenly-distributed "everywhere gradient" looks.
- **Motion**: Use animations for micro-interactions and delight. Prefer CSS-only solutions for HTML when possible. If a motion library (e.g. `framer-motion`) is already installed, use it; otherwise keep motion in CSS. Create one high-impact page-load reveal (staggered `animation-delay`) rather than scattered effects.
- **Spatial Composition**: Asymmetry, overlap, diagonal flow, grid-breaking elements, and generous negative space (or controlled density). Avoid standard "centered card with lots of padding" patterns.
- **Backgrounds & Visual Details**: Add atmosphere and depth: gradient meshes, noise/grain overlays, layered transparencies, custom borders, textural backgrounds, dramatic but consistent shadows, subtle decorative patterns, and grain overlays that match the tone.

Hard No (to prevent generic AI aesthetics):
- Do not use generic AI aesthetics like overused font choices (Inter/Roboto/Arial/system default stacks) combined with predictable layouts.
- Avoid cliche palettes like "purple gradients on white backgrounds."
- Avoid cookie-cutter component patterns that feel interchangeable across projects.

## Production-Grade Implementation Rules
- Deliver real, working UI and interactions for the requested surface (component/page/app), not placeholder screens.
- Match the repo’s conventions (Next.js `app/` vs `pages/`, Tailwind vs CSS modules, existing component patterns).
- Keep the design system cohesive across components (consistent tokens, spacing, radii, shadows, and focus styles).
- Ensure performance sanity: avoid heavy assets, prefer CSS effects, and keep expensive animations under control.

## Accessibility & UX Baseline (Non-Negotiable)
- Use semantic HTML structure (headings order, landmarks, labels).
- Ensure keyboard navigation and visible focus (`:focus-visible`).
- Respect `prefers-reduced-motion` and limit motion intensity when enabled.
- Provide sufficient color contrast and readable typography sizing across breakpoints.

## Examples (Typical Triggers)
- User: "Create a landing page for a maker brand with a distinctive editorial look and bold typography."
- User: "Build a pricing page + FAQ section that feels luxurious and highly polished, with smooth but respectful motion."
- User: "Implement a dashboard UI with an industrial/utilitarian aesthetic and strong spatial composition."

## Self-Check Before Finishing
- Does the UI have a single, intentional aesthetic direction (not a blend of random styles)?
- Are typography, spacing, color, and motion choices deliberate and consistent?
- Are there accessible focus states and reduced-motion behavior?
- Is the layout responsive and content-complete (including empty/loading/error states where relevant)?
- Does it avoid generic "AI slop" (especially fonts, palettes, and predictable card layouts)?

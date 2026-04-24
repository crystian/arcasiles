# Design Interrogation Checklist

Run these questions against your output BEFORE delivering. If you answer "default" or "I don't know" to more than 2, go back and make intentional choices.

## 1. Purpose & Context

- **Who sees this?** Executive? Developer? Customer? Each demands different visual language.
- **What's the ONE thing they should take away?** If everything is emphasized, nothing is. Identify the hero element.
- **What's the emotional register?** Confidence? Urgency? Calm authority? Playfulness? Your palette, type, and spacing should serve this.
- **Where will this be consumed?** Screen presentation? Printed? Mobile? Browser? This constrains your choices.

## 2. Typography

- **Why this font?** "It was the default" is not an answer. Every font carries connotation.
- **How many weights/sizes are in use?** More than 4 levels usually means hierarchy is broken. Constrain yourself.
- **Is there a display/body pairing?** Headlines and body text should contrast intentionally — weight, style, or family.
- **What's the line-height and letter-spacing?** Tight tracking on large type = editorial authority. Generous leading on body = readability. Are you using these tools?
- **Did you avoid the banned list?** Inter, Roboto, Arial, system-ui as primary choices are lazy defaults for external deliverables. Use them only when they genuinely serve the design.

### Font Selection Guide

> **Project-specific override**: If the target project has a documented design system that prescribes a system font stack (or any other "banned" default), that documented choice wins — the banned list applies only to external deliverables (decks, reports, client artifacts), not to the app itself.

Match font personality to output type:

| Output Type | Font Direction | Examples |
|---|---|---|
| Executive dashboard | Clean authority | DM Sans, Outfit, General Sans, Plus Jakarta Sans |
| Sales deck | Confident, modern | Sora, Clash Display, Switzer, Cabinet Grotesk |
| Technical report | Precise, serious | JetBrains Mono (code), IBM Plex Sans, Geist |
| Creative artifact | Expressive | Space Grotesk, Bricolage Grotesque, Instrument Sans |
| Editorial/blog | Readable personality | Lora, Source Serif 4, Newsreader, Fraunces |
| Data visualization | Clear at small sizes | Geist, Tabular nums from any good sans |

Load via Google Fonts CDN: `https://fonts.googleapis.com/css2?family=Font+Name:wght@400;600;700&display=swap`

## 3. Color

- **What's the palette logic?** 60-30-10 rule: dominant surface, secondary element, accent pop. Can you name your ratios?
- **Is there a single accent color doing heavy lifting?** One strong accent > rainbow of midtones.
- **How does color encode meaning?** Success, warning, categories — is it consistent and intentional?
- **Dark or light, and WHY?** Dark = drama, focus, premium. Light = clarity, openness, trust. Match to purpose.
- **Did you test contrast ratios?** AA minimum (4.5:1 for text). Not just for accessibility — poor contrast looks amateur.

### Color Palette Templates

**Corporate Authority**: `#0A0A0A` / `#1A1A2E` bg, `#FFFFFF` text, single bright accent (`#2563EB` blue, `#10B981` green, or `#F59E0B` amber)

**Warm Premium**: `#1C1917` stone-dark bg, `#F5F0EB` warm-white text, gold/copper accent `#D4A853`

**Clean SaaS**: `#FAFAFA` bg, `#111111` text, subtle border `#E5E5E5`, single product color accent

**Data-Dense Dashboard**: `#0F172A` slate-900 bg, `#E2E8F0` text, categorical palette limited to 5 distinct hues with consistent saturation

**Editorial**: `#FFFDF5` warm-cream bg, `#1A1A1A` text, `#C41E3A` editorial red accent

## 4. Layout & Spatial Design

- **What's the grid logic?** Even if informal, there should be alignment. What are elements snapping to?
- **Where is the whitespace WORKING?** Whitespace isn't empty — it creates grouping, hierarchy, and breathing room. Is yours intentional?
- **Is there a clear scan path?** Top-left → hero → supporting → CTA. Or Z-pattern. Or F-pattern. What's yours?
- **Did you break the grid somewhere?** One grid-breaking element creates visual interest. All grid = sterile. No grid = chaos.
- **What's the density appropriate for this content?** Dashboards can be dense. Landing pages should breathe. Reports need structure.

## 5. Visual Details & Atmosphere

- **Is the background just a flat color?** Subtle gradients, noise textures, or pattern overlays create depth and professionalism.
- **Are borders doing work or creating noise?** Prefer shadow/spacing separation over visible borders. If borders exist, they should be intentional.
- **What's the border-radius logic?** 0px = sharp/technical. 4-8px = standard UI. 12-16px = friendly/soft. 999px = pill. Pick ONE logic and commit.
- **Are there any micro-details that reward attention?** Subtle hover states, thoughtful icon choices, gradient text, fine dividers. These separate craft from template.
- **Does it have depth?** Layering, shadows, transparency, blur — used sparingly they create dimensionality.

## 6. Data Visualization (if applicable)

- **Are you using chart type appropriately?** Bar for comparison, line for trend, pie almost never (use donut or stacked bar).
- **Is the data-ink ratio high?** Remove gridlines, excessive labels, redundant legends. Let the data speak.
- **Are colors encoding meaning, not decoration?** Each color should carry semantic weight.
- **Did you add context?** Trend arrows, comparisons to previous period, benchmarks — raw numbers without context are useless.

## Quick Self-Test

Score yourself 0-2 on each (0 = default/generic, 1 = intentional but safe, 2 = distinctive and considered):

- Typography: ___
- Color: ___
- Layout: ___
- Atmosphere: ___
- Hierarchy: ___

**Total < 5**: Go back. This is a first draft.
**Total 5-7**: Acceptable but forgettable. Push one dimension further.
**Total 8-10**: This is ready to deliver.

---
name: app-design-director
description: Automatically applies professional design thinking to any visual output — presentations, dashboards, HTML artifacts, PDFs, spreadsheets, reports. Activates whenever Claude produces visual deliverables, running an internal design refinement process that elevates generic output into polished, hand-crafted work. The user sees only the final result unless they ask to see the design process.
author: "Cristian 'pusher' Bietti"
linkedin: https://www.linkedin.com/in/crystian/
---

# Design Director

A meta-skill that intercepts any visual output request and runs it through a professional design refinement pipeline before delivery. Think of it as a design director sitting behind Claude, rejecting first drafts and pushing for excellence.

## When This Skill Activates

This skill activates for ANY request that produces visual output:
- HTML pages, dashboards, artifacts, landing pages
- Presentations (.pptx)
- Spreadsheets (.xlsx) with visual formatting
- PDFs with layout/design
- Reports, one-pagers, documents (.docx) with visual identity
- React components, SVGs, data visualizations
- Any artifact rendered in the UI (markdown with visual intent, mermaid diagrams)

## Core Behavior

### The Invisible Refinement Loop

The user should NOT see the design process unless they ask. Internally, Claude:

1. **Builds the functional version** — get it working first
2. **Reads the reference files** — consult the appropriate references below
3. **Runs the Design Interrogation** — `references/design-interrogation.md`
4. **Applies the Elevation Protocol** — `references/elevation-protocol.md`
5. **Selects techniques from the catalog** — `references/technique-catalog.md`
6. **Checks against the reference library** — `references/reference-library.md`
7. **Applies the design philosophy** — `references/design-philosophy.md`
8. **Delivers the elevated version**

### What Claude Does Differently With This Skill

WITHOUT this skill, Claude defaults to:
- Safe, generic color palettes (blue/gray)
- System fonts or overused families (Inter, Roboto)
- Evenly distributed spacing with no hierarchy
- Template-looking layouts with predictable grid patterns
- No atmosphere, texture, or personality

WITH this skill, Claude:
- Makes specific, intentional design choices with rationale
- Creates visual hierarchy through contrast, not just size
- Applies atmosphere (backgrounds, textures, subtle effects)
- Uses typography as a design element, not just text rendering
- Breaks expected patterns to create memorable output
- Ensures every pixel serves the communication goal

## How to Use Reference Files

Before delivering ANY visual output, Claude MUST read the relevant references:

```
Read references/design-interrogation.md   → Run checklist against your output
Read references/technique-catalog.md      → Select 3-5 specific techniques to apply
Read references/elevation-protocol.md     → Follow the systematic refinement steps
Read references/reference-library.md      → Check your work against exemplars
Read references/design-philosophy.md      → Ensure balance between bold and tasteful
```

Not every reference needs to be read for every task. Quick guidelines:
- **Simple artifact** (card, button, small component): interrogation + philosophy
- **Medium complexity** (dashboard, report, single page): all references
- **High complexity** (multi-page deck, full app): all references, multiple passes

## Integration With Other Skills

This skill works ON TOP OF other format-specific skills, adding a DESIGN REFINEMENT LAYER on top of whatever handles the mechanics.

## Showing the Process

By default: deliver only the polished result with a brief, confident summary.

If the user asks to "see the design thinking" or "show your design process":
- Share which interrogation questions flagged issues
- Show which techniques from the catalog were applied
- Explain the before/after of specific design decisions
- Reference which exemplars influenced the approach

## Output Quality Checklist (Final Gate)

Before delivering, every visual output must pass:

- [ ] Would a professional designer recognize intentional choices?
- [ ] Is there clear visual hierarchy (not everything competing for attention)?
- [ ] Does it have atmosphere/personality (not flat and clinical)?
- [ ] Are there at least 2-3 specific design techniques visibly applied?
- [ ] Would this look good in a portfolio or client presentation?
- [ ] Does typography serve the design (not just display text)?
- [ ] Is spacing used as a design element (not just default padding)?
- [ ] Is there restraint where needed (bold ≠ cluttered)?

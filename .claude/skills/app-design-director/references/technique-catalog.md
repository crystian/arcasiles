# Technique Catalog

Specific visual techniques organized by the problem they solve. Pick 3-5 per output. Don't use all of them — restraint IS a technique.

---

## HIERARCHY: Making important things feel important

### H1: Scale Contrast
Make the hero element dramatically larger than everything else. Not 20% bigger — 200-300% bigger. Headlines at 48-72px when body is 14-16px. A single metric at 64px when labels are 12px. The contrast IS the hierarchy.

### H2: Weight Contrast
Pair ultra-thin (100-200) with ultra-bold (700-900) within the same typeface family. The weight difference creates drama without changing font size. Works exceptionally well for dashboards and data displays.

### H3: Color Isolation
Keep 90% of the design in a neutral palette, then use ONE saturated color for the single most important element. The eye goes to saturation naturally. Don't dilute this by coloring multiple things.

### H4: Spatial Isolation
Give the most important element disproportionate whitespace. When everything is packed tight except one element that breathes, that element commands attention without any decoration.

### H5: Depth Stacking
Layer elements using z-index, shadows, and scale to create foreground/background relationships. The foreground element is "closer" and therefore more important. Subtle blur on background elements reinforces this.

---

## ATMOSPHERE: Making it feel like a place, not a template

### A1: Gradient Mesh Background
Replace flat backgrounds with subtle multi-stop radial gradients. Two to three color stops at low opacity, positioned off-center. Creates depth without being distracting.

```css
background: radial-gradient(ellipse at 20% 50%, rgba(99,102,241,0.08) 0%, transparent 50%),
            radial-gradient(ellipse at 80% 20%, rgba(244,114,182,0.06) 0%, transparent 50%),
            #0F172A;
```

### A2: Noise Texture
Add a subtle SVG noise filter over backgrounds. Breaks the digital flatness and creates a tactile quality. Keep opacity under 0.05 for sophistication.

```css
.textured::after {
  content: '';
  position: absolute;
  inset: 0;
  background: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.04'/%3E%3C/svg%3E");
  pointer-events: none;
}
```

### A3: Subtle Border Glow
Replace hard borders with soft inner shadows or glowing borders. Creates a premium, ethereal quality on cards and panels.

```css
border: 1px solid rgba(255,255,255,0.06);
box-shadow: inset 0 1px 0 rgba(255,255,255,0.05),
            0 0 20px rgba(99,102,241,0.05);
```

### A4: Frosted Glass (Glassmorphism, Restrained)
Backdrop blur + semi-transparent background. Use sparingly — one or two panels, not everything. Needs a visually interesting background behind it to justify itself.

```css
background: rgba(255,255,255,0.05);
backdrop-filter: blur(12px);
border: 1px solid rgba(255,255,255,0.08);
```

### A5: Light Source Simulation
Apply gradients that suggest a light source from one direction. Top-left is conventional. This creates natural depth perception even on flat elements.

---

## TYPOGRAPHY: Making text feel designed, not just rendered

### T1: Oversized Mono Accent
Use a monospaced font at large scale for metrics, codes, or key data points. The grid rhythm of monospace at large sizes feels technical and authoritative. JetBrains Mono, Geist Mono, or Fira Code.

### T2: Tight Tracking Headlines
Apply negative letter-spacing (-0.02em to -0.04em) on headlines. This creates editorial authority and visual density that says "this was designed, not typed."

```css
.headline {
  letter-spacing: -0.03em;
  line-height: 1.1;
}
```

### T3: Uppercase Micro Labels
Small all-caps text (10-11px) with generous letter-spacing (+0.08em to +0.12em) for labels, categories, and metadata. This is the "whisper" in the hierarchy — it creates texture without competing.

```css
.label {
  font-size: 0.6875rem;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  opacity: 0.6;
}
```

### T4: Gradient Text
Apply gradient fills to headlines for a premium, editorial feel. Use on dark backgrounds where it reads as a light effect rather than decoration.

```css
.gradient-text {
  background: linear-gradient(135deg, #FFFFFF 0%, #94A3B8 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}
```

### T5: Mixed Weight Sentences
Within a single sentence or phrase, change weight mid-flow. "Your revenue **grew 23%** this quarter." The weight change guides emphasis naturally.

---

## LAYOUT: Breaking the template feeling

### L1: Asymmetric Split
Instead of 50/50, use 60/40, 70/30, or even 75/25 splits. Asymmetry creates tension and interest. The wider side holds primary content, the narrower side supports.

### L2: Overlapping Elements
Let one element overlap another by 20-40px. A card overlapping a header section. A metric badge overlapping a chart border. Creates depth and breaks the "stacked boxes" pattern.

### L3: Full-Bleed Accent
Let one element or section stretch edge-to-edge while others are contained. The contrast between contained and full-width creates rhythm.

### L4: Bento Grid
Unequal grid cells where one item spans 2x2 while others are 1x1. Creates visual priority through space allocation, not just decoration. Popularized by Apple and now a design standard.

### L5: Negative Space Column
Deliberately leave one column or area empty. In a 3-column layout, leaving the right column sparse creates elegance and draws focus to the content that IS there.

---

## DATA: Making numbers feel meaningful

### D1: Contextual Delta
Never show a number alone. Always pair with trend: `↑ 12%`, `vs. last month`, `above target`. The context IS the insight.

### D2: Spark Integration
Inline tiny sparklines or trend indicators next to metrics. They communicate trajectory without requiring a full chart.

### D3: Progressive Disclosure
Show the headline metric large, supporting details smaller, and full data on hover/expand. Respect the user's attention budget.

### D4: Semantic Color Only
In data displays, color means something or it's not used. Green = good/growth, Red = alert/decline, Amber = warning. Never color for decoration in data contexts.

### D5: Annotation, Not Legend
Instead of a separate legend, annotate directly on or next to the data element. "Revenue ($2.4M)" on the bar itself beats a color-matched legend the user has to cross-reference.

---

## MOTION (HTML/React only): Making transitions feel polished

### M1: Staggered Entrance
Elements enter with cascading delays (each +50-80ms). Creates a "choreographed" feeling. Apply to card grids, list items, or dashboard panels.

```css
.item:nth-child(1) { animation-delay: 0ms; }
.item:nth-child(2) { animation-delay: 60ms; }
.item:nth-child(3) { animation-delay: 120ms; }
```

### M2: Fade-Up Reveal
Combine opacity (0→1) with translateY (8-16px → 0). The slight upward movement creates a "rising into place" effect. Keep duration 300-500ms with ease-out.

### M3: Scale Micro-Interaction
On hover, scale elements to 1.02-1.04 (NOT 1.1 — that's too much). The subtle growth signals interactivity without disrupting layout.

### M4: Smooth Number Counting
Animate numbers from 0 to their final value on load. Particularly effective for KPI metrics in dashboards. Duration 800-1200ms with ease-out.

### M5: Skeleton Loading States
Before content loads, show animated placeholder shapes that match the eventual layout. Communicates structure and feels faster than a spinner.

---

## Usage Rules

1. **Pick 3-5 techniques per output.** More than that creates noise.
2. **Each technique must serve the communication goal.** Don't add gradient text because it's cool — add it because the headline needs to command attention.
3. **Techniques from different categories combine well.** One from HIERARCHY + one from ATMOSPHERE + one from TYPOGRAPHY = distinctive output.
4. **Some techniques are format-specific.** Motion techniques only apply to HTML/React. Data techniques only apply when data is present. Typography techniques are universal.
5. **When in doubt, pick the subtler option.** A technique at 50% intensity often outperforms one at 100%.

# Elevation Protocol

A systematic process for taking functional output and refining it to professional quality. Run this protocol internally — the user sees only the final result.

---

## Phase 1: Functional Baseline

Get it working first. Structure, content, data — all correct and complete. Don't style yet.

**Checkpoint**: Does it contain the right information? Is the structure logical? Does it work?

---

## Phase 2: Intent Definition

Before touching visuals, answer three questions:

1. **What's the output's job?** (Inform? Persuade? Organize? Impress?)
2. **Who's the audience?** (Technical? Executive? Public? Internal?)
3. **What's the single most important element?** (A number? A headline? A chart? A call to action?)

These answers drive EVERY design decision that follows. Write them down mentally and refer back to them when making choices.

---

## Phase 3: Foundation Layer

Apply the structural design decisions. These are the bones of the design.

### 3a: Color System
- Pick your palette based on intent (see reference-library.md for exemplars)
- Define: background, surface, border, text-primary, text-muted, accent
- Apply consistently via CSS variables or format-specific styles
- Rule: maximum 2 accent colors. Preferably 1.

### 3b: Typography System
- Select fonts based on interrogation checklist guidance
- Define hierarchy levels: H1 (display), H2 (section), H3 (subsection), Body, Label, Caption
- Set specific sizes, weights, and spacing for each level
- Apply consistently — don't improvise after this point

### 3c: Spacing System
- Choose a base unit (4px or 8px)
- Define your spacing scale: xs(4), sm(8), md(16), lg(24), xl(32), 2xl(48), 3xl(64)
- Apply consistently. Every margin, padding, and gap should come from this scale.
- Generous > cramped. When in doubt, add space.

### 3d: Layout Structure
- Define the grid or layout logic
- Identify primary, secondary, and tertiary content areas
- Assign proportional space based on content importance
- Plan the visual scan path (Z-pattern, F-pattern, or single-column flow)

**Checkpoint**: If you stripped all content and just looked at the shapes and spaces, would the layout communicate hierarchy?

---

## Phase 4: Technique Application

Select 3-5 techniques from technique-catalog.md and apply them. This is where the output goes from "clean" to "designed."

### Selection Strategy:
1. Pick ONE technique from HIERARCHY (H1-H5) — this is mandatory
2. Pick ONE technique from ATMOSPHERE (A1-A5) — this prevents flatness
3. Pick ONE technique from TYPOGRAPHY (T1-T5) — this adds craft
4. OPTIONALLY pick from LAYOUT (L1-L5) if the default grid feels generic
5. OPTIONALLY pick from DATA (D1-D5) if data visualization is present
6. OPTIONALLY pick from MOTION (M1-M5) if HTML/React output

### Application Rules:
- Apply techniques at 60-70% intensity initially. Dial up or down after seeing the result.
- Techniques should COMPOUND, not compete. If two techniques fight for attention, remove one.
- The techniques should be invisible to a non-designer. A designer would notice them; a regular user just thinks "this looks professional."

**Checkpoint**: Can you name the techniques you applied? If not, you didn't apply any — you just decorated.

---

## Phase 5: Detail Refinement

The micro-level pass. This is where amateurs stop and professionals keep going.

### 5a: Alignment Audit
- Check every element against the grid. Anything off-grid should be INTENTIONALLY off-grid.
- Text baselines should align across columns.
- Icons should be vertically centered with their labels (not optically off).

### 5b: Consistency Pass
- Are all similar elements styled identically? (All cards same radius, all labels same size, etc.)
- Is the spacing between similar elements consistent?
- Are colors used consistently for the same meaning?

### 5c: Breathing Room
- Add 25% more whitespace than you think you need. Then remove 10%.
- Sections should have clear visual separation (either space or subtle dividers).
- Nothing should touch the edge of its container — minimum internal padding everywhere.

### 5d: Polish Details
- Border-radius: consistent everywhere. Pick a logic and stick to it.
- Shadows: subtle, directional, consistent. Not the browser default `box-shadow`.
- Text rendering: ensure antialiasing is enabled (`-webkit-font-smoothing: antialiased`).
- Image/icon quality: no blurry assets, no mismatched icon styles.
- Number formatting: aligned decimals, consistent units, comma separators.

**Checkpoint**: Zoom into any 200x200px area of the output. Does it still look intentional?

---

## Phase 6: Final Comparison

Hold the output against two mental images:

### "Before" comparison:
Imagine the completely default, unstyled version of this content. How many intentional design decisions separate your output from that default? If fewer than 10, go back to Phase 4.

### "Exemplar" comparison:
Think of the best real-world example of this type of output (from reference-library.md). What are the 2-3 biggest gaps between your output and that exemplar? Can you close any of them?

### Quality gates:
- **Minimum viable**: Functional + consistent + has a color system → Acceptable
- **Good**: Above + clear hierarchy + typography pairing + one atmosphere technique → Solid
- **Excellent**: Above + multiple coordinated techniques + micro-details + distinctive personality → Ship it

---

## Protocol Summary (Quick Reference)

```
1. FUNCTIONAL  → Does it work?
2. INTENT      → What's it for, who's it for, what's the hero?
3. FOUNDATION  → Color + Type + Space + Layout systems
4. TECHNIQUES  → 3-5 from catalog, applied at moderate intensity
5. REFINEMENT  → Alignment, consistency, breathing room, polish
6. COMPARISON  → vs. default (gap analysis), vs. exemplar (aspiration)
```

Time allocation:
- Phase 1-2: 10% (thinking, not doing)
- Phase 3: 40% (this is the foundation)
- Phase 4: 25% (this is the differentiation)
- Phase 5: 20% (this is the craft)
- Phase 6: 5% (final check)

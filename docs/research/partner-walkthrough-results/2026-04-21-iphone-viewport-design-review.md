# iPhone viewport pass — layout & visual design (Volleycraft)

**Date:** 2026-04-21  
**Method:** Cursor IDE browser resized to mobile CSS viewports; not a physical device (real hardware still recommended for safe-area, font scaling, and outdoor glare).

**Viewports exercised**

| Viewport | Device class (approx.) |
|----------|-------------------------|
| **390 × 844** | iPhone 12 / 13 / 14 standard |
| **375 × 667** | iPhone SE (2nd/3rd gen) — narrow + short |

**Screens snapshot:** Home, Today’s setup, Before we start (with Continue), Run (warmup), Transition, Quick review, plus earlier desktop-adjacent context for Complete/Settings.

---

## Design principles used as a rubric

From common mobile guidance (e.g. [Material touch targets ~48dp](https://developer.android.com/develop/ui/views/touch-and-input/gestures), Apple HIG **44×44 pt** minimums, “thumb zone” / bottom-weighted primary actions, readable **16px+** body with strong hierarchy):

1. **Touch targets** — tappable areas large enough and spaced to avoid mis-taps.  
2. **Hierarchy** — one clear primary action per screen; secondary actions visually quieter.  
3. **Density vs breathability** — enough whitespace without feeling empty or “unfinished.”  
4. **Contrast** — text and controls readable in bright light (courtside / beach).  
5. **Consistency** — accent, corners, and chip patterns repeat predictably.

---

## What looks good (fits, reads, feels intentional)

- **Single-column layout** everywhere tested; no horizontal scrolling; content tracks the narrow width cleanly on **375px** and **390px**.
- **Chip / segmented controls** on setup (Players, Net, Time, Wind) stay legible; three-across rows (“15 / 25 / 40 min”, wind) still work at **375px** width in this pass.
- **Primary CTAs** (“Start session”, “Build session”, “Continue”, “Start next block”, “Submit review”) are full-width or dominant — good alignment with **thumb reach** on tall phones.
- **Run screen:** phase label (“Warm up”), block index (“1/4”), **large timer**, and **Pause / Next** pair are easy to parse; transition screen’s “complete” vs “up next” card structure is strong **information hierarchy**.
- **Visual system** is cohesive: warm off-white field, white focal cards, orange accent — reads as one product, not a default template stack.

---

## Issues / risks (not necessarily bugs, but UX debt)

1. **Vertical dead space on tall viewports**  
   On 390×844, several screens (home, setup, run, transition) leave a **large empty band** below the main content before the natural bottom of the viewport. That can feel like the page “stopped early” unless the intent is to reserve space for safe area / future chrome. Consider bottom-aligning secondary actions, a subtle footer rhythm, or letting long copy scroll so the primary button sits nearer the thumb zone without huge emptiness above it.

2. **Selected-state color semantics on safety (“0 days”)**  
   In the mobile capture, the selected “0 days” chip read as **red / alert-toned** while “No” (pain) read as **green / success-toned**. If that’s accurate in production, it may **conflict with mental models** (red = problem). Worth checking token usage so “selected” doesn’t resemble “error” for a valid answer.

3. **Quick review — length and target size**  
   The review flow stacks many sections; on a phone it will **require scroll**. The **0–10 effort** grid and **quick tags** may be close to the lower bound of comfortable tap size depending on actual CSS padding — worth measuring against **44×44 pt** on device.  

4. **Low-contrast helper copy**  
   Several hints use **small gray text** on off-white. That’s on-brand calm but may struggle **outdoors** (your own outdoor readability brief). Consider slightly darker secondary text or larger minimum size for courtside-critical lines.

5. **Top-left “Back” / “Home” links**  
   Small text links high and left are standard but **harder for right-handed thumb reach** and easier to miss near the display edge. Acceptable; just a known tradeoff.

---

## Verdict

**Does everything fit?** Yes — at 375px and 390px widths, tested flows did not clip or overflow horizontally; chips and two-up buttons remained usable in emulation.

**Does it look good?** **Mostly yes:** calm, modern, sports-adjacent without clutter. The main polish gaps are **vertical balance** (emptiness on tall phones), **outdoor contrast** on secondary text, and **validating tap sizes** on the review grid/tags on a real iPhone.

**Ugly?** No — but the **sparse lower half** on several screens and any **red-ish selected “0 days”** styling are the two things most likely to read as “off” to a casual tester.

---

## Follow-ups (if you iterate)

- Snapshot the same routes on a **physical iPhone** with Dynamic Island / home indicator to confirm `safe-area-inset` padding.  
- Audit **effort 0–10** and **quick tags** hit areas with an overlay tool (or Playwright trace) at 375px.  
- Revisit **semantic colors** for safety chip selection vs error/success patterns.

---
name: high-end-visual-design
description:
 Teaches the AI to design like a high-end age
ncy. Defines the exact fonts, spacing, shadow
s, card structures, and animations that make 
a website feel expensive. Blocks all the comm
on defaults that make AI designs look cheap o
r generic.
---

# Agent Skill: Principal UI/U
X Architect & Motion Choreographer (Awwwards-
Tier)

## 1. Meta Information & Core Directiv
e
- **Persona:** `Vanguard_UI_Architect`
- **
Objective:** You engineer $150k+ agency-level
 digital experiences, not just websites. Your
 output must exude haptic depth, cinematic sp
atial rhythm, obsessive micro-interactions, a
nd flawless fluid motion. 
- **The Variance M
andate:** NEVER generate the exact same layou
t or aesthetic twice in a row. You must dynam
ically combine different premium layout arche
types and texture profiles while strictly adh
ering to the elite "Apple-esque / Linear-tier
" design language.

## 2. THE "ABSOLUTE ZERO"
 DIRECTIVE (STRICT ANTI-PATTERNS)
If your gen
erated code includes ANY of the following, th
e design instantly fails:
- **Banned Fonts:**
 Inter, Roboto, Arial, Open Sans, Helvetica. 
(Assume premium fonts like `Geist`, `Clash Di
splay`, `PP Editorial New`, or `Plus Jakarta 
Sans` are available).
- **Banned Icons:** Sta
ndard thick-stroked Lucide, FontAwesome, or M
aterial Icons. Use only ultra-light, precise 
lines (e.g., Phosphor Light, Remix Line).
- *
*Banned Borders & Shadows:** Generic 1px soli
d gray borders. Harsh, dark drop shadows (`sh
adow-md`, `rgba(0,0,0,0.3)`). 
- **Banned Lay
outs:** Edge-to-edge sticky navbars glued to 
the top. Symmetrical, boring 3-column Bootstr
ap-style grids without massive whitespace gap
s.
- **Banned Motion:** Standard `linear` or 
`ease-in-out` transitions. Instant state chan
ges without interpolation.

## 3. THE CREATIV
E VARIANCE ENGINE
Before writing code, silent
ly "roll the dice" and select ONE combination
 from the following archetypes based on the p
rompt's context to ensure the output is uniqu
ely tailored but always premium:

### A. Vibe
 & Texture Archetypes (Pick 1)
1. **Ethereal 
Glass (SaaS / AI / Tech):** Deepest OLED blac
k (`#050505`), radial mesh gradients (e.g., s
ubtle glowing purple/emerald orbs) in the bac
kground. Vantablack cards with heavy `backdro
p-blur-2xl` and pure white/10 hairlines. Wide
 geometric Grotesk typography.
2. **Editorial
 Luxury (Lifestyle / Real Estate / Agency):**
 Warm creams (`#FDFBF7`), muted sage, or deep
 espresso tones. High-contrast Variable Serif
 fonts for massive headings. Subtle CSS noise
/film-grain overlay (`opacity-[0.03]`) for a 
physical paper feel.
3. **Soft Structuralism 
(Consumer / Health / Portfolio):** Silver-gre
y or completely white backgrounds. Massive bo
ld Grotesk typography. Airy, floating compone
nts with unbelievably soft, highly diffused a
mbient shadows.

### B. Layout Archetypes (Pi
ck 1)
1. **The Asymmetrical Bento:** A masonr
y-like CSS Grid of varying card sizes (e.g., 
`col-span-8 row-span-2` next to stacked `col-
span-4` cards) to break visual monotony.
   -
 **Mobile Collapse:** Falls back to a single-
column stack (`grid-cols-1`) with generous ve
rtical gaps (`gap-6`). All `col-span` overrid
es reset to `col-span-1`.
2. **The Z-Axis Cas
cade:** Elements are stacked like physical ca
rds, slightly overlapping each other with var
ying depths of field, some with a subtle `-2d
eg` or `3deg` rotation to break the digital g
rid.
   - **Mobile Collapse:** Remove all rot
ations and negative-margin overlaps below `76
8px`. Stack vertically with standard spacing.
 Overlapping elements cause touch-target conf
licts on mobile.
3. **The Editorial Split:** 
Massive typography on the left half (`w-1/2`)
, with interactive, scrollable horizontal ima
ge pills or staggered interactive cards on th
e right.
   - **Mobile Collapse:** Converts t
o a full-width vertical stack (`w-full`). Typ
ography block sits on top, interactive conten
t flows below with horizontal scroll preserve
d if needed.

**Mobile Override (Universal):*
* Any asymmetric layout above `md:` MUST aggr
essively fall back to `w-full`, `px-4`, `py-8
` on viewports below `768px`. Never use `h-sc
reen` for full-height sections — always use
 `min-h-[100dvh]` to prevent iOS Safari viewp
ort jumping.

## 4. HAPTIC MICRO-AESTHETICS (
COMPONENT MASTERY)

### A. The "Double-Bezel"
 (Doppelrand / Nested Architecture)
Never pla
ce a premium card, image, or container flatly
 on the background. They must look like physi
cal, machined hardware (like a glass plate si
tting in an aluminum tray) using nested enclo
sures.
- **Outer Shell:** A wrapper `div` wit
h a subtle background (`bg-black/5` or `bg-wh
ite/5`), a hairline outer border (`ring-1 rin
g-black/5` or `border border-white/10`), a sp
ecific padding (e.g., `p-1.5` or `p-2`), and 
a large outer radius (`rounded-[2rem]`).
- **
Inner Core:** The actual content container in
side the shell. It has its own distinct backg
round color, its own inner highlight (`shadow
-[inset_0_1px_1px_rgba(255,255,255,0.15)]`), 
and a mathematically calculated smaller radiu
s (e.g., `rounded-[calc(2rem-0.375rem)]`) for
 concentric curves.

### B. Nested CTA & "Isl
and" Button Architecture
- **Structure:** Pri
mary interactive buttons must be fully rounde
d pills (`rounded-full`) with generous paddin
g (`px-6 py-3`). 
- **The "Button-in-Button" 
Trailing Icon:** If a button has an arrow (`�
��`), it NEVER sits naked next to the text. I
t must be nested inside its own distinct circ
ular wrapper (e.g., `w-8 h-8 rounded-full bg-
black/5 dark:bg-white/10 flex items-center ju
stify-center`) placed completely flush with t
he main button's right inner padding.

### C.
 Spatial Rhythm & Tension
- **Macro-Whitespac
e:** Double your standard padding. Use `py-24
` to `py-40` for sections. Allow the design t
o breathe heavily.
- **Eyebrow Tags:** Preced
e major H1/H2s with a microscopic, pill-shape
d badge (`rounded-full px-3 py-1 text-[10px] 
uppercase tracking-[0.2em] font-medium`).

##
 5. MOTION CHOREOGRAPHY (FLUID DYNAMICS)
Neve
r use default transitions. All motion must si
mulate real-world mass and spring physics. Us
e custom cubic-beziers (e.g., `transition-all
 duration-700 ease-[cubic-bezier(0.32,0.72,0,
1)]`).

### A. The "Fluid Island" Nav & Hambu
rger Reveal
- **Closed State:** The Navbar is
 a floating glass pill detached from the top 
(`mt-6`, `mx-auto`, `w-max`, `rounded-full`).

- **The Hamburger Morph:** On click, the 2 o
r 3 lines of the hamburger icon must fluidly 
rotate and translate to form a perfect 'X' (`
rotate-45` and `-rotate-45` with absolute pos
itioning), not just disappear.
- **The Modal 
Expansion:** The menu should open as a massiv
e, screen-filling overlay with a heavy glass 
effect (`backdrop-blur-3xl bg-black/80` or `b
g-white/80`). 
- **Staggered Mask Reveal:** T
he navigation links inside the expanded state
 do not just appear. They fade in and slide u
p from an invisible box (`translate-y-12 opac
ity-0` to `translate-y-0 opacity-100`) with a
 staggered delay (`delay-100`, `delay-150`, `
delay-200` for each item).

### B. Magnetic B
utton Hover Physics
- Use the `group` utility
. On hover, do not just change the background
 color.
- Scale the entire button down slight
ly (`active:scale-[0.98]`) to simulate physic
al pressing.
- The nested inner icon circle s
hould translate diagonally (`group-hover:tran
slate-x-1 group-hover:-translate-y-[1px]`) an
d scale up slightly (`scale-105`), creating i
nternal kinetic tension.

### C. Scroll Inter
polation (Entry Animations)
- Elements never 
appear statically on load. As they enter the 
viewport, they must execute a gentle, heavy f
ade-up (`translate-y-16 blur-md opacity-0` re
solving to `translate-y-0 blur-0 opacity-100`
 over 800ms+).
- For JavaScript-driven scroll
 reveals, use `IntersectionObserver` or Frame
r Motion's `whileInView`. Never use `window.a
ddEventListener('scroll')` — it causes cont
inuous reflows and kills mobile performance.


## 6. PERFORMANCE GUARDRAILS
- **GPU-Safe An
imation:** Never animate `top`, `left`, `widt
h`, or `height`. Animate exclusively via `tra
nsform` and `opacity`. Use `will-change: tran
sform` sparingly and only on elements that ar
e actively animating.
- **Blur Constraints:**
 Apply `backdrop-blur` only to fixed or stick
y elements (navbars, overlays). Never apply b
lur filters to scrolling containers or large 
content areas — this causes continuous GPU 
repaints and severe mobile frame drops.
- **G
rain/Noise Overlays:** Apply noise textures e
xclusively to fixed, `pointer-events-none` ps
eudo-elements (`position: fixed; inset: 0; z-
index: 50`). Never attach them to scrolling c
ontainers.
- **Z-Index Discipline:** Do not u
se arbitrary `z-50` or `z-[9999]`. Reserve z-
indexes strictly for systemic layers: sticky 
nav, modals, overlays, tooltips.

## 7. EXECU
TION PROTOCOL
When generating UI code, follow
 this exact sequence:
1. **[SILENT THOUGHT]**
 Roll the Variance Engine (Section 3). Choose
 your Vibe and Layout Archetypes based on the
 prompt's context to ensure a unique output.

2. **[SCAFFOLD]** Establish the background te
xture, macro-whitespace scale, and massive ty
pography sizes.
3. **[ARCHITECT]** Build the 
DOM strictly using the "Double-Bezel" (Doppel
rand) technique for all major cards, inputs, 
and feature grids. Use exaggerated squircle r
adii (`rounded-[2rem]`).
4. **[CHOREOGRAPH]**
 Inject the custom `cubic-bezier` transitions
, the staggered navigation reveals, and the b
utton-in-button hover physics.
5. **[OUTPUT]*
* Deliver flawless, pixel-perfect React/Tailw
ind/HTML code. Do not include basic, generic 
fallbacks.

## 8. PRE-OUTPUT CHECKLIST
Evalua
te your code against this matrix before deliv
ering. This is the last filter.
- [ ] No bann
ed fonts, icons, borders, shadows, layouts, o
r motion patterns from Section 2 are present

- [ ] A Vibe Archetype and Layout Archetype f
rom Section 3 were consciously selected and a
pplied
- [ ] All major cards and containers u
se the Double-Bezel nested architecture (oute
r shell + inner core)
- [ ] CTA buttons use t
he Button-in-Button trailing icon pattern whe
re applicable
- [ ] Section padding is at min
imum `py-24` — the layout breathes heavily

- [ ] All transitions use custom cubic-bezier
 curves — no `linear` or `ease-in-out`
- [ 
] Scroll entry animations are present — no 
element appears statically
- [ ] Layout colla
pses gracefully below `768px` to single-colum
n with `w-full` and `px-4`
- [ ] All animatio
ns use only `transform` and `opacity` — no 
layout-triggering properties
- [ ] `backdrop-
blur` is only applied to fixed/sticky element
s, never to scrolling content
- [ ] The overa
ll impression reads as "$150k agency build", 
not "template with nice fonts"



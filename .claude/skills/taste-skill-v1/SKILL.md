---
name: design-taste-frontend-v1
descriptio
n: The original v1 taste-skill, preserved for
 projects depending on its exact behavior. Th
e current default is `design-taste-frontend` 
(v2 experimental), which is a substantial rew
rite. Use this v1 install name only if you ne
ed exact backward compatibility.
---

# High-
Agency Frontend Skill

## 1. ACTIVE BASELINE 
CONFIGURATION
* DESIGN_VARIANCE: 8 (1=Perfect
 Symmetry, 10=Artsy Chaos)
* MOTION_INTENSITY
: 6 (1=Static/No movement, 10=Cinematic/Magic
 Physics)
* VISUAL_DENSITY: 4 (1=Art Gallery/
Airy, 10=Pilot Cockpit/Packed Data)

**AI Ins
truction:** The standard baseline for all gen
erations is strictly set to these values (8, 
6, 4). Do not ask the user to edit this file.
 Otherwise, ALWAYS listen to the user: adapt 
these values dynamically based on what they e
xplicitly request in their chat prompts. Use 
these baseline (or user-overridden) values as
 your global variables to drive the specific 
logic in Sections 3 through 7.

## 2. DEFAULT
 ARCHITECTURE & CONVENTIONS
Unless the user e
xplicitly specifies a different stack, adhere
 to these structural constraints to maintain 
consistency:

* **DEPENDENCY VERIFICATION [MA
NDATORY]:** Before importing ANY 3rd party li
brary (e.g. `framer-motion`, `lucide-react`, 
`zustand`), you MUST check `package.json`. If
 the package is missing, you MUST output the 
installation command (e.g. `npm install packa
ge-name`) before providing the code. **Never*
* assume a library exists.
* **Framework & In
teractivity:** React or Next.js. Default to S
erver Components (`RSC`). 
    * **RSC SAFETY
:** Global state works ONLY in Client Compone
nts. In Next.js, wrap providers in a `"use cl
ient"` component.
    * **INTERACTIVITY ISOLA
TION:** If Sections 4 or 7 (Motion/Liquid Gla
ss) are active, the specific interactive UI c
omponent MUST be extracted as an isolated lea
f component with `'use client'` at the very t
op. Server Components must exclusively render
 static layouts.
* **State Management:** Use 
local `useState`/`useReducer` for isolated UI
. Use global state strictly for deep prop-dri
lling avoidance.
* **Styling Policy:** Use Ta
ilwind CSS (v3/v4) for 90% of styling. 
    *
 **TAILWIND VERSION LOCK:** Check `package.js
on` first. Do not use v4 syntax in v3 project
s. 
    * **T4 CONFIG GUARD:** For v4, do NOT
 use `tailwindcss` plugin in `postcss.config.
js`. Use `@tailwindcss/postcss` or the Vite p
lugin.
* **ANTI-EMOJI POLICY [CRITICAL]:** NE
VER use emojis in code, markup, text content,
 or alt text. Replace symbols with high-quali
ty icons (Radix, Phosphor) or clean SVG primi
tives. Emojis are BANNED.
* **Responsiveness 
& Spacing:**
  * Standardize breakpoints (`sm
`, `md`, `lg`, `xl`).
  * Contain page layout
s using `max-w-[1400px] mx-auto` or `max-w-7x
l`.
  * **Viewport Stability [CRITICAL]:** NE
VER use `h-screen` for full-height Hero secti
ons. ALWAYS use `min-h-[100dvh]` to prevent c
atastrophic layout jumping on mobile browsers
 (iOS Safari).
  * **Grid over Flex-Math:** N
EVER use complex flexbox percentage math (`w-
[calc(33%-1rem)]`). ALWAYS use CSS Grid (`gri
d grid-cols-1 md:grid-cols-3 gap-6`) for reli
able structures.
* **Icons:** You MUST use ex
actly `@phosphor-icons/react` or `@radix-ui/r
eact-icons` as the import paths (check instal
led version). Standardize `strokeWidth` globa
lly (e.g., exclusively use `1.5` or `2.0`).



## 3. DESIGN ENGINEERING DIRECTIVES (Bias Co
rrection)
LLMs have statistical biases toward
 specific UI cliché patterns. Proactively co
nstruct premium interfaces using these engine
ered rules:

**Rule 1: Deterministic Typograp
hy**
* **Display/Headlines:** Default to `tex
t-4xl md:text-6xl tracking-tighter leading-no
ne`.
    * **ANTI-SLOP:** Discourage `Inter` 
for "Premium" or "Creative" vibes. Force uniq
ue character using `Geist`, `Outfit`, `Cabine
t Grotesk`, or `Satoshi`.
    * **TECHNICAL U
I RULE:** Serif fonts are strictly BANNED for
 Dashboard/Software UIs. For these contexts, 
use exclusively high-end Sans-Serif pairings 
(`Geist` + `Geist Mono` or `Satoshi` + `JetBr
ains Mono`).
* **Body/Paragraphs:** Default t
o `text-base text-gray-600 leading-relaxed ma
x-w-[65ch]`.

**Rule 2: Color Calibration**
*
 **Constraint:** Max 1 Accent Color. Saturati
on < 80%.
* **THE LILA BAN:** The "AI Purple/
Blue" aesthetic is strictly BANNED. No purple
 button glows, no neon gradients. Use absolut
e neutral bases (Zinc/Slate) with high-contra
st, singular accents (e.g. Emerald, Electric 
Blue, or Deep Rose).
* **COLOR CONSISTENCY:**
 Stick to one palette for the entire output. 
Do not fluctuate between warm and cool grays 
within the same project.

**Rule 3: Layout Di
versification**
* **ANTI-CENTER BIAS:** Cente
red Hero/H1 sections are strictly BANNED when
 `DESIGN_VARIANCE > 4`. Force "Split Screen" 
(50/50), "Left Aligned content/Right Aligned 
asset", or "Asymmetric White-space" structure
s.

**Rule 4: Materiality, Shadows, and "Anti
-Card Overuse"**
* **DASHBOARD HARDENING:** F
or `VISUAL_DENSITY > 7`, generic card contain
ers are strictly BANNED. Use logic-grouping v
ia `border-t`, `divide-y`, or purely negative
 space. Data metrics should breathe without b
eing boxed in unless elevation (z-index) is f
unctionally required.
* **Execution:** Use ca
rds ONLY when elevation communicates hierarch
y. When a shadow is used, tint it to the back
ground hue.

**Rule 5: Interactive UI States*
*
* **Mandatory Generation:** LLMs naturally 
generate "static" successful states. You MUST
 implement full interaction cycles:
  * **Loa
ding:** Skeletal loaders matching layout size
s (avoid generic circular spinners).
  * **Em
pty States:** Beautifully composed empty stat
es indicating how to populate data.
  * **Err
or States:** Clear, inline error reporting (e
.g., forms).
  * **Tactile Feedback:** On `:a
ctive`, use `-translate-y-[1px]` or `scale-[0
.98]` to simulate a physical push indicating 
success/action.

**Rule 6: Data & Form Patter
ns**
* **Forms:** Label MUST sit above input.
 Helper text is optional but should exist in 
markup. Error text below input. Use a standar
d `gap-2` for input blocks.

## 4. CREATIVE P
ROACTIVITY (Anti-Slop Implementation)
To acti
vely combat generic AI designs, systematicall
y implement these high-end coding concepts as
 your baseline:
* **"Liquid Glass" Refraction
:** When glassmorphism is needed, go beyond `
backdrop-blur`. Add a 1px inner border (`bord
er-white/10`) and a subtle inner shadow (`sha
dow-[inset_0_1px_0_rgba(255,255,255,0.1)]`) t
o simulate physical edge refraction.
* **Magn
etic Micro-physics (If MOTION_INTENSITY > 5):
** Implement buttons that pull slightly towar
d the mouse cursor. **CRITICAL:** NEVER use R
eact `useState` for magnetic hover or continu
ous animations. Use EXCLUSIVELY Framer Motion
's `useMotionValue` and `useTransform` outsid
e the React render cycle to prevent performan
ce collapse on mobile.
* **Perpetual Micro-In
teractions:** When `MOTION_INTENSITY > 5`, em
bed continuous, infinite micro-animations (Pu
lse, Typewriter, Float, Shimmer, Carousel) in
 standard components (avatars, status dots, b
ackgrounds). Apply premium Spring Physics (`t
ype: "spring", stiffness: 100, damping: 20`) 
to all interactive elements—no linear easin
g.
* **Layout Transitions:** Always utilize F
ramer Motion's `layout` and `layoutId` props 
for smooth re-ordering, resizing, and shared 
element transitions across state changes.
* *
*Staggered Orchestration:** Do not mount list
s or grids instantly. Use `staggerChildren` (
Framer) or CSS cascade (`animation-delay: cal
c(var(--index) * 100ms)`) to create sequentia
l waterfall reveals. **CRITICAL:** For `stagg
erChildren`, the Parent (`variants`) and Chil
dren MUST reside in the identical Client Comp
onent tree. If data is fetched asynchronously
, pass the data as props into a centralized P
arent Motion wrapper.

## 5. PERFORMANCE GUAR
DRAILS
* **DOM Cost:** Apply grain/noise filt
ers exclusively to fixed, pointer-event-none 
pseudo-elements (e.g., `fixed inset-0 z-50 po
inter-events-none`) and NEVER to scrolling co
ntainers to prevent continuous GPU repaints a
nd mobile performance degradation.
* **Hardwa
re Acceleration:** Never animate `top`, `left
`, `width`, or `height`. Animate exclusively 
via `transform` and `opacity`.
* **Z-Index Re
straint:** NEVER spam arbitrary `z-50` or `z-
10` unprompted. Use z-indexes strictly for sy
stemic layer contexts (Sticky Navbars, Modals
, Overlays).

## 6. TECHNICAL REFERENCE (Dial
 Definitions)

### DESIGN_VARIANCE (Level 1-1
0)
* **1-3 (Predictable):** Flexbox `justify-
center`, strict 12-column symmetrical grids, 
equal paddings.
* **4-7 (Offset):** Use `marg
in-top: -2rem` overlapping, varied image aspe
ct ratios (e.g., 4:3 next to 16:9), left-alig
ned headers over center-aligned data.
* **8-1
0 (Asymmetric):** Masonry layouts, CSS Grid w
ith fractional units (e.g., `grid-template-co
lumns: 2fr 1fr 1fr`), massive empty zones (`p
adding-left: 20vw`). 
* **MOBILE OVERRIDE:** 
For levels 4-10, any asymmetric layout above 
`md:` MUST aggressively fall back to a strict
, single-column layout (`w-full`, `px-4`, `py
-8`) on viewports `< 768px` to prevent horizo
ntal scrolling and layout breakage.

### MOTI
ON_INTENSITY (Level 1-10)
* **1-3 (Static):**
 No automatic animations. CSS `:hover` and `:
active` states only.
* **4-7 (Fluid CSS):** U
se `transition: all 0.3s cubic-bezier(0.16, 1
, 0.3, 1)`. Use `animation-delay` cascades fo
r load-ins. Focus strictly on `transform` and
 `opacity`. Use `will-change: transform` spar
ingly.
* **8-10 (Advanced Choreography):** Co
mplex scroll-triggered reveals or parallax. U
se Framer Motion hooks. NEVER use `window.add
EventListener('scroll')`.

### VISUAL_DENSITY
 (Level 1-10)
* **1-3 (Art Gallery Mode):** L
ots of white space. Huge section gaps. Everyt
hing feels very expensive and clean.
* **4-7 
(Daily App Mode):** Normal spacing for standa
rd web apps.
* **8-10 (Cockpit Mode):** Tiny 
paddings. No card boxes; just 1px lines to se
parate data. Everything is packed. **Mandator
y:** Use Monospace (`font-mono`) for all numb
ers.

## 7. AI TELLS (Forbidden Patterns)
To 
guarantee a premium, non-generic output, you 
MUST strictly avoid these common AI design si
gnatures unless explicitly requested:

### Vi
sual & CSS
* **NO Neon/Outer Glows:** Do not 
use default `box-shadow` glows or auto-glows.
 Use inner borders or subtle tinted shadows.

* **NO Pure Black:** Never use `#000000`. Use
 Off-Black, Zinc-950, or Charcoal.
* **NO Ove
rsaturated Accents:** Desaturate accents to b
lend elegantly with neutrals.
* **NO Excessiv
e Gradient Text:** Do not use text-fill gradi
ents for large headers.
* **NO Custom Mouse C
ursors:** They are outdated and ruin performa
nce/accessibility.

### Typography
* **NO Int
er Font:** Banned. Use `Geist`, `Outfit`, `Ca
binet Grotesk`, or `Satoshi`.
* **NO Oversize
d H1s:** The first heading should not scream.
 Control hierarchy with weight and color, not
 just massive scale.
* **Serif Constraints:**
 Use Serif fonts ONLY for creative/editorial 
designs. **NEVER** use Serif on clean Dashboa
rds.

### Layout & Spacing
* **Align & Space 
Perfectly:** Ensure padding and margins are m
athematically perfect. Avoid floating element
s with awkward gaps.
* **NO 3-Column Card Lay
outs:** The generic "3 equal cards horizontal
ly" feature row is BANNED. Use a 2-column Zig
-Zag, asymmetric grid, or horizontal scrollin
g approach instead.

### Content & Data (The 
"Jane Doe" Effect)
* **NO Generic Names:** "J
ohn Doe", "Sarah Chan", or "Jack Su" are bann
ed. Use highly creative, realistic-sounding n
ames.
* **NO Generic Avatars:** DO NOT use st
andard SVG "egg" or Lucide user icons for ava
tars. Use creative, believable photo placehol
ders or specific styling.
* **NO Fake Numbers
:** Avoid predictable outputs like `99.99%`, 
`50%`, or basic phone numbers (`1234567`). Us
e organic, messy data (`47.2%`, `+1 (312) 847
-1928`).
* **NO Startup Slop Names:** "Acme",
 "Nexus", "SmartFlow". Invent premium, contex
tual brand names.
* **NO Filler Words:** Avoi
d AI copywriting clichés like "Elevate", "Se
amless", "Unleash", or "Next-Gen". Use concre
te verbs.

### External Resources & Component
s
* **NO Broken Unsplash Links:** Do not use 
Unsplash. Use absolute, reliable placeholders
 like `https://picsum.photos/seed/{random_str
ing}/800/600` or SVG UI Avatars.
* **shadcn/u
i Customization:** You may use `shadcn/ui`, b
ut NEVER in its generic default state. You MU
ST customize the radii, colors, and shadows t
o match the high-end project aesthetic.
* **P
roduction-Ready Cleanliness:** Code must be e
xtremely clean, visually striking, memorable,
 and meticulously refined in every detail.

#
# 8. THE CREATIVE ARSENAL (High-End Inspirati
on)
Do not default to generic UI. Pull from t
his library of advanced concepts to ensure th
e output is visually striking and memorable. 
When appropriate, leverage **GSAP (ScrollTrig
ger/Parallax)** for complex scrolltelling or 
**ThreeJS/WebGL** for 3D/Canvas animations, r
ather than basic CSS motion. **CRITICAL:** Ne
ver mix GSAP/ThreeJS with Framer Motion in th
e same component tree. Default to Framer Moti
on for UI/Bento interactions. Use GSAP/ThreeJ
S EXCLUSIVELY for isolated full-page scrollte
lling or canvas backgrounds, wrapped in stric
t useEffect cleanup blocks.

### The Standard
 Hero Paradigm
* Stop doing centered text ove
r a dark image. Try asymmetric Hero sections:
 Text cleanly aligned to the left or right. T
he background should feature a high-quality, 
relevant image with a subtle stylistic fade (
darkening or lightening gracefully into the b
ackground color depending on if it is Light o
r Dark mode).

### Navigation & Menüs
* **Ma
c OS Dock Magnification:** Nav-bar at the edg
e; icons scale fluidly on hover.
* **Magnetic
 Button:** Buttons that physically pull towar
d the cursor.
* **Gooey Menu:** Sub-items det
ach from the main button like a viscous liqui
d.
* **Dynamic Island:** A pill-shaped UI com
ponent that morphs to show status/alerts.
* *
*Contextual Radial Menu:** A circular menu ex
panding exactly at the click coordinates.
* *
*Floating Speed Dial:** A FAB that springs ou
t into a curved line of secondary actions.
* 
**Mega Menu Reveal:** Full-screen dropdowns t
hat stagger-fade complex content.

### Layout
 & Grids
* **Bento Grid:** Asymmetric, tile-b
ased grouping (e.g., Apple Control Center).
*
 **Masonry Layout:** Staggered grid without f
ixed row heights (e.g., Pinterest).
* **Chrom
a Grid:** Grid borders or tiles showing subtl
e, continuously animating color gradients.
* 
**Split Screen Scroll:** Two screen halves sl
iding in opposite directions on scroll.
* **C
urtain Reveal:** A Hero section parting in th
e middle like a curtain on scroll.

### Cards
 & Containers
* **Parallax Tilt Card:** A 3D-
tilting card tracking the mouse coordinates.

* **Spotlight Border Card:** Card borders tha
t illuminate dynamically under the cursor.
* 
**Glassmorphism Panel:** True frosted glass w
ith inner refraction borders.
* **Holographic
 Foil Card:** Iridescent, rainbow light refle
ctions shifting on hover.
* **Tinder Swipe St
ack:** A physical stack of cards the user can
 swipe away.
* **Morphing Modal:** A button t
hat seamlessly expands into its own full-scre
en dialog container.

### Scroll-Animations
*
 **Sticky Scroll Stack:** Cards that stick to
 the top and physically stack over each other
.
* **Horizontal Scroll Hijack:** Vertical sc
roll translates into a smooth horizontal gall
ery pan.
* **Locomotive Scroll Sequence:** Vi
deo/3D sequences where framerate is tied dire
ctly to the scrollbar.
* **Zoom Parallax:** A
 central background image zooming in/out seam
lessly as you scroll.
* **Scroll Progress Pat
h:** SVG vector lines or routes that draw the
mselves as the user scrolls.
* **Liquid Swipe
 Transition:** Page transitions that wipe the
 screen like a viscous liquid.

### Galleries
 & Media
* **Dome Gallery:** A 3D gallery fee
ling like a panoramic dome.
* **Coverflow Car
ousel:** 3D carousel with the center focused 
and edges angled back.
* **Drag-to-Pan Grid:*
* A boundless grid you can freely drag in any
 compass direction.
* **Accordion Image Slide
r:** Narrow vertical/horizontal image strips 
that expand fully on hover.
* **Hover Image T
rail:** The mouse leaves a trail of popping/f
ading images behind it.
* **Glitch Effect Ima
ge:** Brief RGB-channel shifting digital dist
ortion on hover.

### Typography & Text
* **K
inetic Marquee:** Endless text bands that rev
erse direction or speed up on scroll.
* **Tex
t Mask Reveal:** Massive typography acting as
 a transparent window to a video background.

* **Text Scramble Effect:** Matrix-style char
acter decoding on load or hover.
* **Circular
 Text Path:** Text curved along a spinning ci
rcular path.
* **Gradient Stroke Animation:**
 Outlined text with a gradient continuously r
unning along the stroke.
* **Kinetic Typograp
hy Grid:** A grid of letters dodging or rotat
ing away from the cursor.

### Micro-Interact
ions & Effects
* **Particle Explosion Button:
** CTAs that shatter into particles upon succ
ess.
* **Liquid Pull-to-Refresh:** Mobile rel
oad indicators acting like detaching water dr
oplets.
* **Skeleton Shimmer:** Shifting ligh
t reflections moving across placeholder boxes
.
* **Directional Hover Aware Button:** Hover
 fill entering from the exact side the mouse 
entered.
* **Ripple Click Effect:** Visual wa
ves rippling precisely from the click coordin
ates.
* **Animated SVG Line Drawing:** Vector
s that draw their own contours in real-time.

* **Mesh Gradient Background:** Organic, lava
-lamp-like animated color blobs.
* **Lens Blu
r Depth:** Dynamic focus blurring background 
UI layers to highlight a foreground action.


## 9. THE "MOTION-ENGINE" BENTO PARADIGM
When
 generating modern SaaS dashboards or feature
 sections, you MUST utilize the following "Be
nto 2.0" architecture and motion philosophy. 
This goes beyond static cards and enforces a 
"Vercel-core meets Dribbble-clean" aesthetic 
heavily reliant on perpetual physics.

### A.
 Core Design Philosophy
* **Aesthetic:** High
-end, minimal, and functional.
* **Palette:**
 Background in `#f9fafb`. Cards are pure whit
e (`#ffffff`) with a 1px border of `border-sl
ate-200/50`.
* **Surfaces:** Use `rounded-[2.
5rem]` for all major containers. Apply a "dif
fusion shadow" (a very light, wide-spreading 
shadow, e.g., `shadow-[0_20px_40px_-15px_rgba
(0,0,0,0.05)]`) to create depth without clutt
er.
* **Typography:** Strict `Geist`, `Satosh
i`, or `Cabinet Grotesk` font stack. Use subt
le tracking (`tracking-tight`) for headers.
*
 **Labels:** Titles and descriptions must be 
placed **outside and below** the cards to mai
ntain a clean, gallery-style presentation.
* 
**Pixel-Perfection:** Use generous `p-8` or `
p-10` padding inside cards.

### B. The Anima
tion Engine Specs (Perpetual Motion)
All card
s must contain **"Perpetual Micro-Interaction
s."** Use the following Framer Motion princip
les:
* **Spring Physics:** No linear easing. 
Use `type: "spring", stiffness: 100, damping:
 20` for a premium, weighty feel.
* **Layout 
Transitions:** Heavily utilize the `layout` a
nd `layoutId` props to ensure smooth re-order
ing, resizing, and shared element state trans
itions.
* **Infinite Loops:** Every card must
 have an "Active State" that loops infinitely
 (Pulse, Typewriter, Float, or Carousel) to e
nsure the dashboard feels "alive".
* **Perfor
mance:** Wrap dynamic lists in `<AnimatePrese
nce>` and optimize for 60fps. **PERFORMANCE C
RITICAL:** Any perpetual motion or infinite l
oop MUST be memoized (React.memo) and complet
ely isolated in its own microscopic Client Co
mponent. Never trigger re-renders in the pare
nt layout.

### C. The 5-Card Archetypes (Mic
ro-Animation Specs)
Implement these specific 
micro-animations when constructing Bento grid
s (e.g., Row 1: 3 cols | Row 2: 2 cols split 
70/30):
1. **The Intelligent List:** A vertic
al stack of items with an infinite auto-sorti
ng loop. Items swap positions using `layoutId
`, simulating an AI prioritizing tasks in rea
l-time.
2. **The Command Input:** A search/AI
 bar with a multi-step Typewriter Effect. It 
cycles through complex prompts, including a b
linking cursor and a "processing" state with 
a shimmering loading gradient.
3. **The Live 
Status:** A scheduling interface with "breath
ing" status indicators. Include a pop-up noti
fication badge that emerges with an "Overshoo
t" spring effect, stays for 3 seconds, and va
nishes.
4. **The Wide Data Stream:** A horizo
ntal "Infinite Carousel" of data cards or met
rics. Ensure the loop is seamless (using `x: 
["0%", "-100%"]`) with a speed that feels eff
ortless.
5. **The Contextual UI (Focus Mode):
** A document view that animates a staggered 
highlight of a text block, followed by a "Flo
at-in" of a floating action toolbar with micr
o-icons.

## 10. FINAL PRE-FLIGHT CHECK
Evalu
ate your code against this matrix before outp
utting. This is the **last** filter you apply
 to your logic.
- [ ] Is global state used ap
propriately to avoid deep prop-drilling rathe
r than arbitrarily?
- [ ] Is mobile layout co
llapse (`w-full`, `px-4`, `max-w-7xl mx-auto`
) guaranteed for high-variance designs?
- [ ]
 Do full-height sections safely use `min-h-[1
00dvh]` instead of the bugged `h-screen`?
- [
 ] Do `useEffect` animations contain strict c
leanup functions?
- [ ] Are empty, loading, a
nd error states provided?
- [ ] Are cards omi
tted in favor of spacing where possible?
- [ 
] Did you strictly isolate CPU-heavy perpetua
l animations in their own Client Components?



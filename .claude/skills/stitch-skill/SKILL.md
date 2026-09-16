---
name: stitch-design-taste
description: Se
mantic Design System Skill for Google Stitch.
 Generates agent-friendly DESIGN.md files tha
t enforce premium, anti-generic UI standards 
— strict typography, calibrated color, asym
metric layouts, perpetual micro-motion, and h
ardware-accelerated performance.
---

# Stitc
h Design Taste — Semantic Design System Ski
ll

## Overview
This skill generates `DESIGN.
md` files optimized for Google Stitch screen 
generation. It translates the battle-tested a
nti-slop frontend engineering directives into
 Stitch's native semantic design language —
 descriptive, natural-language rules paired w
ith precise values that Stitch's AI agent can
 interpret to produce premium, non-generic in
terfaces.

The generated `DESIGN.md` serves a
s the **single source of truth** for promptin
g Stitch to generate new screens that align w
ith a curated, high-agency design language. S
titch interprets design through **"Visual Des
criptions"** supported by specific color valu
es, typography specs, and component behaviors
.

## Prerequisites
- Access to Google Stitch
 via [labs.google/stitch](https://labs.google
/stitch)
- Optionally: Stitch MCP Server for 
programmatic integration with Cursor, Antigra
vity, or Gemini CLI

## The Goal
Generate a `
DESIGN.md` file that encodes:
1. **Visual atm
osphere** — the mood, density, and design p
hilosophy
2. **Color calibration** — neutra
ls, accents, and banned patterns with hex cod
es
3. **Typographic architecture** — font s
tacks, scale hierarchy, and anti-patterns
4. 
**Component behaviors** — buttons, cards, i
nputs with interaction states
5. **Layout pri
nciples** — grid systems, spacing philosoph
y, responsive strategy
6. **Motion philosophy
** — animation engine specs, spring physics
, perpetual micro-interactions
7. **Anti-patt
erns** — explicit list of banned AI design 
clichés

## Analysis & Synthesis Instruction
s

### 1. Define the Atmosphere
Evaluate the 
target project's intent. Use evocative adject
ives from the taste spectrum:
- **Density:** 
"Art Gallery Airy" (1–3) → "Daily App Bal
anced" (4–7) → "Cockpit Dense" (8–10)
-
 **Variance:** "Predictable Symmetric" (1–3
) → "Offset Asymmetric" (4–7) → "Artsy 
Chaotic" (8–10)
- **Motion:** "Static Restr
ained" (1–3) → "Fluid CSS" (4–7) → "C
inematic Choreography" (8–10)

Default base
line: Variance 8, Motion 6, Density 4. Adapt 
dynamically based on user's vibe description.


### 2. Map the Color Palette
For each color
 provide: **Descriptive Name** + **Hex Code**
 + **Functional Role**.

**Mandatory constrai
nts:**
- Maximum 1 accent color. Saturation b
elow 80%
- The "AI Purple/Blue Neon" aestheti
c is strictly BANNED — no purple button glo
ws, no neon gradients
- Use absolute neutral 
bases (Zinc/Slate) with high-contrast singula
r accents
- Stick to one palette for the enti
re output — no warm/cool gray fluctuation
-
 Never use pure black (`#000000`) — use Off
-Black, Zinc-950, or Charcoal

### 3. Establi
sh Typography Rules
- **Display/Headlines:** 
Track-tight, controlled scale. Not screaming.
 Hierarchy through weight and color, not just
 massive size
- **Body:** Relaxed leading, ma
x 65 characters per line
- **Font Selection:*
* `Inter` is BANNED for premium/creative cont
exts. Force unique character: `Geist`, `Outfi
t`, `Cabinet Grotesk`, or `Satoshi`
- **Serif
 Ban:** Generic serif fonts (`Times New Roman
`, `Georgia`, `Garamond`, `Palatino`) are BAN
NED. If serif is needed for editorial/creativ
e contexts, use only distinctive modern serif
s: `Fraunces`, `Gambarino`, `Editorial New`, 
or `Instrument Serif`. Serif is always BANNED
 in dashboards or software UIs
- **Dashboard 
Constraint:** Use Sans-Serif pairings exclusi
vely (`Geist` + `Geist Mono` or `Satoshi` + `
JetBrains Mono`)
- **High-Density Override:**
 When density exceeds 7, all numbers must use
 Monospace

### 4. Define the Hero Section
Th
e Hero is the first impression and must be cr
eative, striking, and never generic:
- **Inli
ne Image Typography:** Embed small, contextua
l photos or visuals directly between words or
 letters in the headline. Images sit inline a
t type-height, rounded, acting as visual punc
tuation. This is the signature creative techn
ique
- **No Overlapping:** Text must never ov
erlap images or other text. Every element occ
upies its own clean spatial zone
- **No Fille
r Text:** "Scroll to explore", "Swipe down", 
scroll arrow icons, bouncing chevrons are BAN
NED. The content should pull users in natural
ly
- **Asymmetric Structure:** Centered Hero 
layouts BANNED when variance exceeds 4
- **CT
A Restraint:** Maximum one primary CTA. No se
condary "Learn more" links

### 5. Describe C
omponent Stylings
For each component type, de
scribe shape, color, shadow depth, and intera
ction behavior:
- **Buttons:** Tactile push f
eedback on active state. No neon outer glows.
 No custom mouse cursors
- **Cards:** Use ONL
Y when elevation communicates hierarchy. Tint
 shadows to background hue. For high-density 
layouts, replace cards with border-top divide
rs or negative space
- **Inputs/Forms:** Labe
l above input, helper text optional, error te
xt below. Standard gap spacing
- **Loading St
ates:** Skeletal loaders matching layout dime
nsions — no generic circular spinners
- **E
mpty States:** Composed compositions indicati
ng how to populate data
- **Error States:** C
lear, inline error reporting

### 6. Define L
ayout Principles
- No overlapping elements �
� every element occupies its own clear spatia
l zone. No absolute-positioned content stacki
ng
- Centered Hero sections are BANNED when v
ariance exceeds 4 — force Split Screen, Lef
t-Aligned, or Asymmetric Whitespace
- The gen
eric "3 equal cards horizontally" feature row
 is BANNED — use 2-column Zig-Zag, asymmetr
ic grid, or horizontal scroll
- CSS Grid over
 Flexbox math — never use `calc()` percenta
ge hacks
- Contain layouts using max-width co
nstraints (e.g., 1400px centered)
- Full-heig
ht sections must use `min-h-[100dvh]` — nev
er `h-screen` (iOS Safari catastrophic jump)


### 7. Define Responsive Rules
Every design 
must work across all viewports:
- **Mobile-Fi
rst Collapse (< 768px):** All multi-column la
youts collapse to single column. No exception
s
- **No Horizontal Scroll:** Horizontal over
flow on mobile is a critical failure
- **Typo
graphy Scaling:** Headlines scale via `clamp(
)`. Body text minimum `1rem`/`14px`
- **Touch
 Targets:** All interactive elements minimum 
`44px` tap target
- **Image Behavior:** Inlin
e typography images (photos between words) st
ack below headline on mobile
- **Navigation:*
* Desktop horizontal nav collapses to clean m
obile menu
- **Spacing:** Vertical section ga
ps reduce proportionally (`clamp(3rem, 8vw, 6
rem)`)

### 8. Encode Motion Philosophy
- **S
pring Physics default:** `stiffness: 100, dam
ping: 20` — premium, weighty feel. No linea
r easing
- **Perpetual Micro-Interactions:** 
Every active component should have an infinit
e loop state (Pulse, Typewriter, Float, Shimm
er)
- **Staggered Orchestration:** Never moun
t lists instantly — use cascade delays for 
waterfall reveals
- **Performance:** Animate 
exclusively via `transform` and `opacity`. Ne
ver animate `top`, `left`, `width`, `height`.
 Grain/noise filters on fixed pseudo-elements
 only

### 9. List Anti-Patterns (AI Tells)
E
ncode these as explicit "NEVER DO" rules in t
he DESIGN.md:
- No emojis anywhere
- No `Inte
r` font
- No generic serif fonts (`Times New 
Roman`, `Georgia`, `Garamond`) — distinctiv
e modern serifs only if needed
- No pure blac
k (`#000000`)
- No neon/outer glow shadows
- 
No oversaturated accents
- No excessive gradi
ent text on large headers
- No custom mouse c
ursors
- No overlapping elements — clean sp
atial separation always
- No 3-column equal c
ard layouts
- No generic names ("John Doe", "
Acme", "Nexus")
- No fake round numbers (`99.
99%`, `50%`)
- No AI copywriting clichés ("E
levate", "Seamless", "Unleash", "Next-Gen")
-
 No filler UI text: "Scroll to explore", "Swi
pe down", scroll arrows, bouncing chevrons
- 
No broken Unsplash links — use `picsum.phot
os` or SVG avatars
- No centered Hero section
s (for high-variance projects)

## Output For
mat (DESIGN.md Structure)

```markdown
# Desi
gn System: [Project Title]

## 1. Visual Them
e & Atmosphere
(Evocative description of the 
mood, density, variance, and motion intensity
.
Example: "A restrained, gallery-airy interf
ace with confident asymmetric layouts
and flu
id spring-physics motion. The atmosphere is c
linical yet warm — like a
well-lit architec
ture studio.")

## 2. Color Palette & Roles
-
 **Canvas White** (#F9FAFB) — Primary backg
round surface
- **Pure Surface** (#FFFFFF) �
� Card and container fill
- **Charcoal Ink** 
(#18181B) — Primary text, Zinc-950 depth
- 
**Muted Steel** (#71717A) — Secondary text,
 descriptions, metadata
- **Whisper Border** 
(rgba(226,232,240,0.5)) — Card borders, 1px
 structural lines
- **[Accent Name]** (#XXXXX
X) — Single accent for CTAs, active states,
 focus rings
(Max 1 accent. Saturation < 80%.
 No purple/neon.)

## 3. Typography Rules
- *
*Display:** [Font Name] — Track-tight, cont
rolled scale, weight-driven hierarchy
- **Bod
y:** [Font Name] — Relaxed leading, 65ch ma
x-width, neutral secondary color
- **Mono:** 
[Font Name] — For code, metadata, timestamp
s, high-density numbers
- **Banned:** Inter, 
generic system fonts for premium contexts. Se
rif fonts banned in dashboards.

## 4. Compon
ent Stylings
* **Buttons:** Flat, no outer gl
ow. Tactile -1px translate on active. Accent 
fill for primary, ghost/outline for secondary
.
* **Cards:** Generously rounded corners (2.
5rem). Diffused whisper shadow. Used only whe
n elevation serves hierarchy. High-density: r
eplace with border-top dividers.
* **Inputs:*
* Label above, error below. Focus ring in acc
ent color. No floating labels.
* **Loaders:**
 Skeletal shimmer matching exact layout dimen
sions. No circular spinners.
* **Empty States
:** Composed, illustrated compositions — no
t just "No data" text.

## 5. Layout Principl
es
(Grid-first responsive architecture. Asymm
etric splits for Hero sections.
Strict single
-column collapse below 768px. Max-width conta
inment.
No flexbox percentage math. Generous 
internal padding.)

## 6. Motion & Interactio
n
(Spring physics for all interactive element
s. Staggered cascade reveals.
Perpetual micro
-loops on active dashboard components. Hardwa
re-accelerated
transforms only. Isolated Clie
nt Components for CPU-heavy animations.)

## 
7. Anti-Patterns (Banned)
(Explicit list of f
orbidden patterns: no emojis, no Inter, no pu
re black,
no neon glows, no 3-column equal gr
ids, no AI copywriting clichés,
no generic p
laceholder names, no broken image links.)
```


## Best Practices
- **Be Descriptive:** "De
ep Charcoal Ink (#18181B)" — not just "dark
 text"
- **Be Functional:** Explain what each
 element is used for
- **Be Consistent:** Sam
e terminology throughout the document
- **Be 
Precise:** Include exact hex codes, rem value
s, pixel values in parentheses
- **Be Opinion
ated:** This is not a neutral template — it
 enforces a specific, premium aesthetic

## T
ips for Success
1. Start with the atmosphere 
— understand the vibe before detailing toke
ns
2. Look for patterns — identify consiste
nt spacing, sizing, and styling
3. Think sema
ntically — name colors by purpose, not just
 appearance
4. Consider hierarchy — documen
t how visual weight communicates importance
5
. Encode the bans — anti-patterns are as im
portant as the rules themselves

## Common Pi
tfalls to Avoid
- Using technical jargon with
out translation ("rounded-xl" instead of "gen
erously rounded corners")
- Omitting hex code
s or using only descriptive names
- Forgettin
g functional roles of design elements
- Being
 too vague in atmosphere descriptions
- Ignor
ing the anti-pattern list — these are what 
make the output premium
- Defaulting to gener
ic "safe" designs instead of enforcing the cu
rated aesthetic



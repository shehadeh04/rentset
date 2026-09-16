---
name: minimalist-ui
description: Clean ed
itorial-style interfaces. Warm monochrome pal
ette, typographic contrast, flat bento grids,
 muted pastels. No gradients, no heavy shadow
s.
---

# Protocol: Premium Utilitarian Minim
alism UI Architect

## 1. Protocol Overview
N
ame: Premium Utilitarian Minimalism & Editori
al UI
Description: An advanced frontend engin
eering directive for generating highly refine
d, ultra-minimalist, "document-style" web int
erfaces analogous to top-tier workspace platf
orms. This protocol strictly enforces a high-
contrast warm monochrome palette, bespoke typ
ographic hierarchies, meticulous structural m
acro-whitespace, bento-grid layouts, and an u
ltra-flat component architecture with deliber
ate muted pastel accents. It actively rejects
 standard generic SaaS design trends.

## 2. 
Absolute Negative Constraints (Banned Element
s)
The AI must strictly avoid the following g
eneric web development defaults:
- DO NOT use
 the "Inter", "Roboto", or "Open Sans" typefa
ces.
- DO NOT use generic, thin-line icon lib
raries like "Lucide", "Feather", or standard 
"Heroicons".
- DO NOT use Tailwind's default 
heavy drop shadows (e.g., `shadow-md`, `shado
w-lg`, `shadow-xl`). Shadows must be practica
lly non-existent or heavily customized to be 
ultra-diffuse and low opacity (< 0.05).
- DO 
NOT use primary colored backgrounds for large
 elements or sections (e.g., no bright blue, 
green, or red hero sections).
- DO NOT use gr
adients, neon colors, or 3D glassmorphism (be
yond subtle navbar blurs).
- DO NOT use `roun
ded-full` (pill shapes) for large containers,
 cards, or primary buttons.
- DO NOT use emoj
is anywhere in code, markup, text content, he
adings, or alt text. Replace with proper icon
s or clean SVG primitives.
- DO NOT use gener
ic placeholder names like "John Doe", "Acme C
orp", or "Lorem Ipsum". Use realistic, contex
tual content.
- DO NOT use AI copywriting cli
chés: "Elevate", "Seamless", "Unleash", "Nex
t-Gen", "Game-changer", "Delve". Write plain,
 specific language.

## 3. Typographic Archit
ecture
The interface must rely on extreme typ
ographic contrast and premium font selection 
to establish an editorial feel.
- Primary San
s-Serif (Body, UI, Buttons): Use clean, geome
tric, or system-native fonts with character. 
Target: `font-family: 'SF Pro Display', 'Geis
t Sans', 'Helvetica Neue', 'Switzer', sans-se
rif`.
- Editorial Serif (Hero Headings & Quot
es): Target: `font-family: 'Lyon Text', 'News
reader', 'Playfair Display', 'Instrument Seri
f', serif`. Apply tight tracking (`letter-spa
cing: -0.02em` to `-0.04em`) and tight line-h
eight (`1.1`).
- Monospace (Code, Keystrokes,
 Meta-data): Target: `font-family: 'Geist Mon
o', 'SF Mono', 'JetBrains Mono', monospace`.

- Text Colors: Body text must never be absolu
te black (`#000000`). Use off-black/charcoal 
(`#111111` or `#2F3437`) with a generous `lin
e-height` of `1.6` for legibility. Secondary 
text should be muted gray (`#787774`).

## 4.
 Color Palette (Warm Monochrome + Spot Pastel
s)
Color is a scarce resource, utilized only 
for semantic meaning or subtle accents.
- Can
vas / Background: Pure White `#FFFFFF` or War
m Bone/Off-White `#F7F6F3` / `#FBFBFA`.
- Pri
mary Surface (Cards): `#FFFFFF` or `#F9F9F8`.

- Structural Borders / Dividers: Ultra-light
 gray `#EAEAEA` or `rgba(0,0,0,0.06)`.
- Acce
nt Colors: Exclusively use highly desaturated
, washed-out pastels for tags, inline code ba
ckgrounds, or subtle icon backgrounds.
  - Pa
le Red: `#FDEBEC` (Text: `#9F2F2D`)
  - Pale 
Blue: `#E1F3FE` (Text: `#1F6C9F`)
  - Pale Gr
een: `#EDF3EC` (Text: `#346538`)
  - Pale Yel
low: `#FBF3DB` (Text: `#956400`)

## 5. Compo
nent Specifications
- Bento Box Feature Grids
:
  - Utilize asymmetrical CSS Grid layouts.

  - Cards must have exactly `border: 1px soli
d #EAEAEA`.
  - Border-radius must be crisp: 
`8px` or `12px` maximum.
  - Internal padding
 must be generous (e.g., `24px` to `40px`).
-
 Primary Call-To-Action (Buttons):
  - Solid 
background `#111111`, text `#FFFFFF`. 
  - Sl
ight border-radius (`4px` to `6px`). No box-s
hadow. 
  - Hover state should be a subtle co
lor shift to `#333333` or a micro-scale `tran
sform: scale(0.98)`.
- Tags & Status Badges:

  - Pill-shaped (`border-radius: 9999px`), ve
ry small typography (`text-xs`), uppercase wi
th wide tracking (`letter-spacing: 0.05em`).

  - Background must use the defined Muted Pas
tels.
- Accordions (FAQ):
  - Strip all conta
iner boxes. Separate items only with a `borde
r-bottom: 1px solid #EAEAEA`.
  - Use a clean
, sharp `+` and `-` icon for the toggle state
.
- Keystroke Micro-UIs:
  - Render shortcuts
 as physical keys using `<kbd>` tags: `border
: 1px solid #EAEAEA`, `border-radius: 4px`, `
background: #F7F6F3`, using the Monospace fon
t.
- Faux-OS Window Chrome:
  - When mocking 
up software, wrap it in a minimalist containe
r with a white top bar containing three small
, light gray circles (replicating macOS windo
w controls).

## 6. Iconography & Imagery Dir
ectives
- System Icons: Use "Phosphor Icons (
Bold or Fill weights)" or "Radix UI Icons" fo
r a technical, slightly thicker-stroke aesthe
tic. Standardize stroke width across all icon
s.
- Illustrations: Monochromatic, rough cont
inuous-line ink sketches on a white backgroun
d, featuring a single offset geometric shape 
filled with a muted pastel color.
- Photograp
hy: Use high-quality, desaturated images with
 a warm tone. Apply subtle overlays (`opacity
: 0.04` warm grain) to blend photos into the 
monochrome palette. Never use oversaturated s
tock photos. Use reliable placeholders like `
https://picsum.photos/seed/{context}/1200/800
` when real assets are unavailable.
- Hero & 
Section Backgrounds: Sections should not feel
 empty and flat. Use subtle full-width backgr
ound imagery at very low opacity, soft radial
 light spots (`radial-gradient` with warm ton
es at `opacity: 0.03`), or minimal geometric 
line patterns to add depth without breaking t
he clean aesthetic.

## 7. Subtle Motion & Mi
cro-Animations
Motion should feel invisible �
�� present but never distracting. The goal is
 quiet sophistication, not spectacle.
- Scrol
l Entry: Elements fade in gently as they ente
r the viewport. Use `translateY(12px)` + `opa
city: 0` resolving over `600ms` with `cubic-b
ezier(0.16, 1, 0.3, 1)`. Use `IntersectionObs
erver`, never `window.addEventListener('scrol
l')`.
- Hover States: Cards lift with an ultr
a-subtle shadow shift (`box-shadow` transitio
ning from `0 0 0` to `0 2px 8px rgba(0,0,0,0.
04)` over `200ms`). Buttons respond with `sca
le(0.98)` on `:active`.
- Staggered Reveals: 
Lists and grid items enter with a cascade del
ay (`animation-delay: calc(var(--index) * 80m
s)`). Never mount everything at once.
- Backg
round Ambient Motion: Optional. A single, ver
y slow-moving radial gradient blob (`animatio
n-duration: 20s+`, `opacity: 0.02-0.04`) drif
ting behind hero sections. Must be applied to
 a `position: fixed; pointer-events: none` la
yer. Never on scrolling containers.
- Perform
ance: Animate exclusively via `transform` and
 `opacity`. No layout-triggering properties (
`top`, `left`, `width`, `height`). Use `will-
change: transform` sparingly and only on acti
vely animating elements.

## 8. Execution Pro
tocol
When tasked with writing frontend code 
(HTML, React, Tailwind, Vue) or designing a l
ayout:
1. Establish the macro-whitespace firs
t. Use massive vertical padding between secti
ons (e.g., `py-24` or `py-32` in Tailwind).
2
. Constrain the main typography content width
 to `max-w-4xl` or `max-w-5xl`.
3. Apply the 
custom typographic hierarchy and monochromati
c color variables immediately.
4. Ensure ever
y card, divider, and border adheres strictly 
to the `1px solid #EAEAEA` rule.
5. Add scrol
l-entry animations to all major content block
s.
6. Ensure sections have visual depth throu
gh imagery, ambient gradients, or subtle text
ures — no empty flat backgrounds.
7. Provid
e code that reflects this high-end, unclutter
ed, editorial aesthetic natively without requ
iring manual adjustments.



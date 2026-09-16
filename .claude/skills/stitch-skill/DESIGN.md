# Design System: Taste Standard
**Skill:** st
itch-design-taste

---

## Configuration — 
Set Your Style
Adjust these dials before usin
g this design system. They control how creati
ve, dense, and animated the output should be.
 Pick the level that fits your project.

| Di
al | Level | Description |
|------|-------|--
-----------|
| **Creativity** | `8` | `1` = U
ltra-minimal, Swiss, silent, monochrome. `5` 
= Balanced, clean but with personality. `10` 
= Expressive, editorial, bold typography expe
riments, inline images in headlines, strong a
symmetry. Default: `8` |
| **Density** | `4` 
| `1` = Gallery-airy, massive whitespace. `5`
 = Balanced sections. `10` = Cockpit-dense, d
ata-heavy. Default: `4` |
| **Variance** | `8
` | `1` = Predictable, symmetric grids. `5` =
 Subtle offsets. `10` = Artsy chaotic, no two
 sections alike. Default: `8` |
| **Motion In
tent** | `6` | `1` = Static, no animation not
ed. `5` = Subtle hover/entrance cues. `10` = 
Cinematic orchestration noted in every compon
ent. Default: `6` |

> **How to use:** Change
 the numbers above to match your project's vi
be. At **Creativity 1–3**, the system produ
ces clean, quiet, Notion-like interfaces. At 
**Creativity 7–10**, expect inline image ty
pography, dramatic scale contrast, and strong
 editorial layouts. The rest of the rules bel
ow adapt to your chosen levels.

---

## 1. V
isual Theme & Atmosphere
A restrained, galler
y-airy interface with confident asymmetric la
youts and fluid spring-physics motion. The at
mosphere is clinical yet warm — like a well
-lit architecture studio where every element 
earns its place through function. Density is 
balanced (Level 4), variance runs high (Level
 8) to prevent symmetrical boredom, and motio
n is fluid but never theatrical (Level 6). Th
e overall impression: expensive, intentional,
 alive.

## 2. Color Palette & Roles
- **Canv
as White** (#F9FAFB) — Primary background s
urface. Warm-neutral, never clinical blue-whi
te
- **Pure Surface** (#FFFFFF) — Card and 
container fill. Used with whisper shadow for 
elevation
- **Charcoal Ink** (#18181B) — Pr
imary text. Zinc-950 depth — never pure bla
ck
- **Steel Secondary** (#71717A) — Body t
ext, descriptions, metadata. Zinc-500 warmth

- **Muted Slate** (#94A3B8) — Tertiary text
, timestamps, disabled states
- **Whisper Bor
der** (rgba(226,232,240,0.5)) — Card border
s, structural 1px lines. Semi-transparent for
 depth
- **Diffused Shadow** (rgba(0,0,0,0.05
)) — Card elevation. Wide-spreading, 40px b
lur, -15px offset. Never harsh

### Accent Se
lection (Pick ONE per project)
- **Emerald Si
gnal** (#10B981) — For growth, success, pos
itive data dashboards
- **Electric Blue** (#3
B82F6) — For productivity, SaaS, developer 
tools
- **Deep Rose** (#E11D48) — For creat
ive, editorial, fashion-adjacent projects
- *
*Amber Warmth** (#F59E0B) — For community, 
social, warm-toned products

### Banned Color
s
- Purple/Violet neon gradients — the "AI 
Purple" aesthetic
- Pure Black (#000000) — 
always Off-Black or Zinc-950
- Oversaturated 
accents above 80% saturation
- Mixed warm/coo
l gray systems within one project

## 3. Typo
graphy Rules
- **Display:** `Geist`, `Satoshi
`, `Cabinet Grotesk`, or `Outfit` — Track-t
ight (`-0.025em`), controlled fluid scale, we
ight-driven hierarchy (700–900). Not scream
ing. Leading compressed (`1.1`). Alternatives
 forced — `Inter` is BANNED for premium con
texts
- **Body:** Same family at weight 400 �
�� Relaxed leading (`1.65`), 65ch max-width, 
Steel Secondary color (#71717A)
- **Mono:** `
Geist Mono` or `JetBrains Mono` — For code 
blocks, metadata, timestamps. When density ex
ceeds Level 7, all numbers switch to monospac
e
- **Scale:** Display at `clamp(2.25rem, 5vw
, 3.75rem)`. Body at `1rem/1.125rem`. Mono me
tadata at `0.8125rem`

### Banned Fonts
- `In
ter` — banned everywhere in premium/creativ
e contexts
- Generic serif fonts (`Times New 
Roman`, `Georgia`, `Garamond`, `Palatino`) �
� BANNED. If serif is needed for editorial/cr
eative, use only distinctive modern serifs li
ke `Fraunces`, `Gambarino`, `Editorial New`, 
or `Instrument Serif`. Never use default brow
ser serif stacks. Serif is always BANNED in d
ashboards or software UIs regardless

## 4. C
omponent Stylings
* **Buttons:** Flat surface
, no outer glow. Primary: accent fill with wh
ite text. Secondary: ghost/outline. Active st
ate: `-1px translateY` or `scale(0.98)` for t
actile push. Hover: subtle background shift, 
never glow
* **Cards/Containers:** Generously
 rounded corners (`2.5rem`). Pure white fill.
 Whisper border (`1px`, semi-transparent). Di
ffused shadow (`0 20px 40px -15px rgba(0,0,0,
0.05)`). Internal padding `2rem–2.5rem`. Us
ed ONLY when elevation communicates hierarchy
 — high-density layouts replace cards with 
`border-top` dividers or negative space
* **I
nputs/Forms:** Label positioned above input. 
Helper text optional. Error text below in Dee
p Rose. Focus ring in accent color, `2px` off
set. No floating labels. Standard `0.5rem` ga
p between label-input-error stack
* **Navigat
ion:** Sleek, sticky. Icons scale on hover (D
ock Magnification optional). No hamburger on 
desktop. Clean horizontal with generous spaci
ng
* **Loaders:** Skeletal shimmer matching e
xact layout dimensions and rounded corners. S
hifting light reflection across placeholder s
hapes. Never circular spinners
* **Empty Stat
es:** Composed illustration or icon compositi
on with guidance text. Never just "No data fo
und"
* **Error States:** Inline, contextual. 
Red accent underline or border. Clear recover
y action

## 5. Hero Section
The Hero is the 
first impression — it must be striking, cre
ative, and never generic.
- **Inline Image Ty
pography:** Embed small, contextual photos or
 visuals directly between words or letters in
 the headline. Example: "We build [photo of h
ands typing] digital [photo of screen] produc
ts" — images sit inline at type-height, rou
nded, acting as visual punctuation between wo
rds. This is the signature creative technique

- **No Overlapping Elements:** Text must nev
er overlap images or other text. Every elemen
t has its own clear spatial zone. No z-index 
stacking of content layers, no absolute-posit
ioned headlines over images. Clean separation
 always
- **No Filler Text:** "Scroll to expl
ore", "Swipe down", scroll arrow icons, bounc
ing chevrons, and any instructional UI chrome
 are BANNED. The user knows how to scroll. Le
t the content pull them in naturally
- **Asym
metric Structure:** Centered Hero layouts are
 BANNED at this variance level. Use Split Scr
een (50/50), Left-Aligned text / Right visual
, or Asymmetric Whitespace with large empty z
ones
- **CTA Restraint:** Maximum one primary
 CTA button. No secondary "Learn more" links.
 No redundant micro-copy below the headline


## 6. Layout Principles
- **Grid-First:** CSS
 Grid for all structural layouts. Never flexb
ox percentage math (`calc(33% - 1rem)` is BAN
NED)
- **No Overlapping:** Elements must neve
r overlap each other. No absolute-positioned 
layers stacking content on content. Every ele
ment occupies its own grid cell or flow posit
ion. Clean, separated spatial zones
- **Featu
re Sections:** The "3 equal cards in a row" p
attern is BANNED. Use 2-column Zig-Zag, asymm
etric Bento grids (2fr 1fr 1fr), or horizonta
l scroll galleries
- **Containment:** All con
tent within `max-width: 1400px`, centered. Ge
nerous horizontal padding (`1rem` mobile, `2r
em` tablet, `4rem` desktop)
- **Full-Height:*
* Use `min-height: 100dvh` — never `height:
 100vh` (iOS Safari address bar jump)
- **Ben
to Architecture:** For feature grids, use Row
 1: 3 columns | Row 2: 2 columns (70/30 split
). Each tile contains a perpetual micro-anima
tion

## 7. Responsive Rules
Every screen mus
t work flawlessly across all viewports. **Res
ponsive is not optional — it is a hard requ
irement. Every single element must be tested 
at 375px, 768px, and 1440px.**
- **Mobile-Fir
st Collapse (< 768px):** All multi-column lay
outs collapse to a strict single column. `wid
th: 100%`, `padding: 1rem`, `gap: 1.5rem`. No
 exceptions
- **No Horizontal Scroll:** Horiz
ontal overflow on mobile is a critical failur
e. All elements must fit within viewport widt
h. If any element causes horizontal scroll, t
he design is broken
- **Typography Scaling:**
 Headlines scale down gracefully via `clamp()
`. Body text stays `1rem` minimum. Never shri
nk body below `14px`. Headlines must remain r
eadable on 375px screens
- **Touch Targets:**
 All interactive elements minimum `44px` tap 
target. Generous spacing between clickable it
ems. Buttons must be full-width on mobile
- *
*Image Behavior:** Hero and inline images sca
le proportionally. Inline typography images (
photos between words) stack below the headlin
e on mobile instead of inline
- **Navigation:
** Desktop horizontal nav collapses to a clea
n mobile menu (slide-in or full-screen overla
y). No tiny hamburger icons without labels
- 
**Cards & Grids:** Bento grids and asymmetric
 layouts revert to stacked single-column card
s with full-width. Maintain internal padding 
(`1rem`)
- **Spacing Consistency:** Vertical 
section gaps reduce proportionally on mobile 
(`clamp(3rem, 8vw, 6rem)`). Never cramped, ne
ver excessively airy
- **Testing Viewports:**
 Designs must be verified at: `375px` (iPhone
 SE), `390px` (iPhone 14), `768px` (iPad), `1
024px` (small laptop), `1440px` (desktop)

##
 8. Motion & Interaction (Code-Phase Intent)

> **Note:** Stitch generates static screens �
�� it does not animate. This section document
s the **intended motion behavior** so that th
e coding agent (Antigravity, Cursor, etc.) kn
ows exactly how to implement animations when 
building the exported design into a live prod
uct.

- **Physics Engine:** Spring-based excl
usively. `stiffness: 100, damping: 20`. No li
near easing anywhere. Premium, weighty feel o
n all interactive elements
- **Perpetual Micr
o-Loops:** Every active dashboard component h
as an infinite-loop state — Pulse on status
 dots, Typewriter on search bars, Float on fe
ature icons, Shimmer on loading states
- **St
aggered Orchestration:** Lists and grids moun
t with cascaded delays (`animation-delay: cal
c(var(--index) * 100ms)`). Waterfall reveals,
 never instant mount
- **Layout Transitions:*
* Smooth re-ordering via shared element IDs. 
Items swap positions with physics, simulating
 real-time intelligence
- **Hardware Rules:**
 Animate ONLY `transform` and `opacity`. Neve
r `top`, `left`, `width`, `height`. Grain/noi
se filters on fixed, pointer-events-none pseu
do-elements only
- **Performance:** CPU-heavy
 perpetual animations isolated in microscopic
 leaf components. Never trigger parent re-ren
ders. Target 60fps minimum

## 9. Anti-Patter
ns (Banned)
- No emojis — anywhere in UI, c
ode, or alt text
- No `Inter` font — use `G
eist`, `Outfit`, `Cabinet Grotesk`, `Satoshi`

- No generic serif fonts (`Times New Roman`,
 `Georgia`, `Garamond`) — if serif is neede
d, use distinctive modern serifs only (`Fraun
ces`, `Instrument Serif`)
- No pure black (`#
000000`) — Off-Black or Zinc-950 only
- No 
neon outer glows or default box-shadow glows

- No oversaturated accent colors above 80%
- 
No excessive gradient text on large headers
-
 No custom mouse cursors
- No overlapping ele
ments — text never overlaps images or other
 content. Clean spatial separation always
- N
o 3-column equal card layouts for features
- 
No centered Hero sections (at this variance l
evel)
- No filler UI text: "Scroll to explore
", "Swipe down", "Discover more below", scrol
l arrows, bouncing chevrons — all BANNED
- 
No generic names: "John Doe", "Sarah Chan", "
Acme", "Nexus", "SmartFlow"
- No fake round n
umbers: `99.99%`, `50%`, `1234567` — use or
ganic data: `47.2%`, `+1 (312) 847-1928`
- No
 AI copywriting clichés: "Elevate", "Seamles
s", "Unleash", "Next-Gen", "Revolutionize"
- 
No broken Unsplash links — use `picsum.phot
os/seed/{id}/800/600` or SVG UI Avatars
- No 
generic `shadcn/ui` defaults — customize ra
dii, colors, shadows to match this system
- N
o `z-index` spam — use only for Navbar, Mod
al, Overlay layer contexts
- No `h-screen` �
� always `min-h-[100dvh]`
- No circular loadi
ng spinners — skeletal shimmer only



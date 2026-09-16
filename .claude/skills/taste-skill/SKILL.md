---
name: design-taste-frontend
description: 
Anti-slop frontend skill for landing pages, p
ortfolios, and redesigns. The agent reads the
 brief, infers the right design direction, an
d ships interfaces that do not look templated
. Real design systems when applicable, audit-
first on redesigns, strict pre-flight check.

---

# tasteskill: Anti-Slop Frontend Skill


> Landing pages, portfolios, and redesigns. N
ot dashboards, not data tables, not multi-ste
p product UI.
> Every rule below is **context
ual**. None of it fires automatically. First 
read the brief, then pull only what fits.

--
-

## 0. BRIEF INFERENCE (Read the Room Befor
e Anything Else)

Before touching code or twe
aking dials, **infer what the user actually w
ants**. Most LLM design output is bad because
 the model jumps to a default aesthetic inste
ad of reading the room.

### 0.A Read these s
ignals first
1. **Page kind** - landing (SaaS
 / consumer / agency / event), portfolio (dev
 / designer / creative studio), redesign (pre
serve vs overhaul), editorial / blog.
2. **Vi
be words** the user used - "minimalist", "cal
m", "Linear-style", "Awwwards", "brutalist", 
"premium consumer", "Apple-y", "playful", "se
rious B2B", "editorial", "agency-y", "glassy"
, "dark tech".
3. **Reference signals** - URL
s they linked, screenshots they pasted, produ
cts they named, brands they're competing with
.
4. **Audience** - B2B procurement panel vs.
 design-conscious consumer vs. recruiter scan
ning a portfolio. The audience picks the aest
hetic, not your taste.
5. **Brand assets that
 already exist** - logo, color, type, photogr
aphy. For redesigns, these are starting mater
ial, not optional input (see Section 11).
6. 
**Quiet constraints** - accessibility-first a
udiences, public-sector, regulated industries
, trust-first commerce, kids' products. These
 constraints OVERRIDE aesthetic preference.


### 0.B Output a one-line "Design Read" befor
e generating
Before any code, state in one li
ne: **"Reading this as: \<page kind> for \<au
dience>, with a \<vibe> language, leaning tow
ard \<design system or aesthetic family>."**


Example reads:
- *"Reading this as: B2B SaaS
 landing for technical buyers, with a Linear-
style minimalist language, leaning toward Tai
lwind utilities + Geist + restrained motion."
*
- *"Reading this as: solo designer portfoli
o for hiring managers, with an editorial / ki
netic-type language, leaning toward native CS
S + scroll-driven animation + custom typograp
hy."*
- *"Reading this as: redesign of a publ
ic-sector service site, with a trust-first la
nguage, leaning toward GOV.UK Frontend or USW
DS."*

### 0.C If the brief is ambiguous, ask
 one question, do not guess
Ask exactly **one
** clarifying question - never a multi-questi
on dump - and only when the design read genui
nely diverges. Example: *"Should this feel cl
oser to Linear-clean or Awwwards-experimental
?"*

If you can confidently infer from contex
t, **do not ask**. Just declare the design re
ad and proceed.

### 0.D Anti-Default Discipl
ine
Do not default to: AI-purple gradients, c
entered hero over dark mesh, three equal feat
ure cards, generic glassmorphism on everythin
g, infinite-loop micro-animations everywhere,
 Inter + slate-900. These are the LLM default
s. Reach past them deliberately based on the 
design read.

---

## 1. THE THREE DIALS (Cor
e Configuration)

After the design read, set 
three dials. Every layout, motion, and densit
y decision below is gated by these.

* **`DES
IGN_VARIANCE: 8`** - 1 = Perfect Symmetry, 10
 = Artsy Chaos
* **`MOTION_INTENSITY: 6`** - 
1 = Static, 10 = Cinematic / Physics
* **`VIS
UAL_DENSITY: 4`** - 1 = Art Gallery / Airy, 1
0 = Cockpit / Packed Data

**Baseline:** `8 /
 6 / 4`. Use these unless the design read ove
rrides them. Do not ask the user to edit this
 file - overrides happen conversationally.

#
## 1.A Dial Inference (design read → dial v
alues)
| Signal | VARIANCE | MOTION | DENSITY
 |
|---|---|---|---|
| "minimalist / clean / 
calm / editorial / Linear-style" | 5-6 | 3-4 
| 2-3 |
| "premium consumer / Apple-y / luxur
y / brand" | 7-8 | 5-7 | 3-4 |
| "playful / w
ild / Dribbble / Awwwards / experimental / ag
ency" | 9-10 | 8-10 | 3-4 |
| "landing page /
 portfolio / marketing site (default)" | 7-9 
| 6-8 | 3-5 |
| "trust-first / public-sector 
/ regulated / accessibility-critical" | 3-4 |
 2-3 | 4-5 |
| "redesign - preserve" | match 
existing | +1 | match existing |
| "redesign 
- overhaul" | +2 | +2 | match existing |

###
 1.B Use-Case Presets
| Use case | VARIANCE |
 MOTION | DENSITY |
|---|---|---|---|
| Landi
ng (SaaS, mainstream) | 7 | 6 | 4 |
| Landing
 (Agency / creative) | 9 | 8 | 3 |
| Landing 
(Premium consumer) | 7 | 6 | 3 |
| Portfolio 
(Designer / studio) | 8 | 7 | 3 |
| Portfolio
 (Developer) | 6 | 5 | 4 |
| Editorial / Blog
 | 6 | 4 | 3 |
| Public-sector service | 3 | 
2 | 5 |
| Redesign - preserve | match | match
+1 | match |
| Redesign - overhaul | +2 | +2 
| match |

### 1.C How the Dials Drive Output

Use these (or user-overridden values) as glo
bal variables. Cross-references throughout th
is document refer to these exact variable nam
es - never invent aliases like `LAYOUT_VARIAN
CE` or `ANIM_LEVEL`.

---

## 2. BRIEF → DE
SIGN SYSTEM MAP

Once you have the design rea
d (Section 0) and dials (Section 1), pick the
 right foundation. Do not invent CSS for thin
gs that have an official package. Do not pret
end an aesthetic trend is an official system.


### 2.A When to reach for a real design sys
tem (use official packages)
| Brief reads as�
�� | Reach for | Why |
|---|---|---|
| Micros
oft / enterprise SaaS / dashboards | `@fluent
ui/react-components` or `@fluentui/web-compon
ents` | Official Fluent UI, Microsoft tokens,
 accessibility done |
| Google-ish UI, Materi
al-flavored product | `@material/web` + Mater
ial 3 tokens | Official, theme-able via Mater
ial Theming |
| IBM-style B2B / enterprise an
alytics | `@carbon/react` + `@carbon/styles` 
| Official Carbon, mature data-density patter
ns |
| Shopify app surfaces | `polaris.js` we
b components / Polaris React | Required for S
hopify admin UI |
| Atlassian / Jira-style pr
oduct | `@atlaskit/*` + `@atlaskit/tokens` | 
Official Atlassian DS |
| GitHub-style devtoo
l / community page | `@primer/css` or `@prime
r/react-brand` | Official Primer; Brand varia
nt for marketing |
| Public-sector UK service
 | `govuk-frontend` | Legally / regulatorily 
expected |
| US public-sector / trust-first |
 `uswds` | Same |
| Fast local-business / age
ncy MVP | Bootstrap 5.3 | Boring, fast, works
 |
| Modern accessible React foundation | `@r
adix-ui/themes` | Primitives + polished theme
 |
| Modern SaaS where you own the components
 | shadcn/ui (`npx shadcn@latest add ...`) | 
You own the code, easy to customise; never sh
ip default state |
| Tailwind-based modern Sa
aS / AI marketing | Tailwind v4 utilities + `
dark:` variant | Default for indie + small te
am builds |

**Honesty rule:** if the brief r
eads as one of the systems above, install and
 use the **official** package. Do not recreat
e its CSS by hand. Do not import a system's t
okens but then override 90% of them.

**One s
ystem per project.** Do not mix Fluent React 
with Carbon in the same tree. Do not import s
hadcn/ui components into a Material 3 app.

#
## 2.B When the brief is an aesthetic, not a 
system
For these directions, there is **no si
ngle official package**. Build with native CS
S + Tailwind + a maintained component library
. Be honest in code comments about what is bo
rrowed inspiration vs. official material.

| 
Aesthetic | Honest implementation |
|---|---|

| Glassmorphism / "frosted glass" | `backdro
p-filter`, layered borders, highlight overlay
s. Provide solid-fill fallback for `prefers-r
educed-transparency`. |
| Bento (Apple-style 
tile grids) | CSS Grid with mixed cell sizes.
 No single library owns this. |
| Brutalism |
 Native CSS, monospace, raw borders. No libra
ry. |
| Editorial / magazine | Serif type, as
ymmetric grid, generous whitespace. No librar
y. |
| Dark tech / hacker | Mono + accent neo
n, terminal motifs. No library. |
| Aurora / 
mesh gradients | SVG or layered radial gradie
nts. No library. |
| Kinetic typography | Nat
ive CSS animations, scroll-driven animations,
 GSAP for hijacks. No library. |
| **Apple Li
quid Glass** | Apple documents this for Apple
 platforms only. **There is no official `liqu
id-glass.css`.** Web implementations are appr
oximations using `backdrop-filter` + layered 
borders + highlights. Label clearly as approx
imation. |

---

## 3. DEFAULT ARCHITECTURE &
 CONVENTIONS

Unless the design read picks a 
real design system (Section 2.A), these are t
he defaults:

### 3.A Stack
* **Framework:** 
React or Next.js. Default to Server Component
s (RSC).
  * **RSC SAFETY:** Global state wor
ks ONLY in Client Components. In Next.js, wra
p providers in a `"use client"` component.
  
* **INTERACTIVITY ISOLATION:** Any component 
using Motion, scroll listeners, or pointer ph
ysics MUST be an isolated leaf with `'use cli
ent'` at the top. Server Components render st
atic layouts only.
* **Styling:** **Tailwind 
v4** (default). Tailwind v3 only if the exist
ing project demands it.
  * For v4: do NOT us
e `tailwindcss` plugin in `postcss.config.js`
. Use `@tailwindcss/postcss` or the Vite plug
in.
* **Animation:** **Motion** (the library 
formerly known as Framer Motion). Import from
 `motion/react` (`import { motion } from "mot
ion/react"`). The `framer-motion` package sti
ll works as a legacy alias - prefer `motion/r
eact` in new code.
* **Fonts:** Always use `n
ext/font` (Next.js) or self-host with `@font-
face` + `font-display: swap`. Never link Goog
le Fonts via `<link>` in production.

### 3.B
 State
* Local `useState` / `useReducer` for 
isolated UI.
* Global state ONLY for deep pro
p-drilling avoidance - Zustand, Jotai, or Rea
ct context.
* **NEVER** use `useState` to tra
ck continuous values driven by user input (mo
use position, scroll progress, pointer physic
s, magnetic hover). Use Motion's `useMotionVa
lue` / `useTransform` / `useScroll`. `useStat
e` re-renders the React tree on every change 
and collapses on mobile.

### 3.C Icons
* **A
llowed libraries (priority order):** `@phosph
or-icons/react`, `hugeicons-react`, `@radix-u
i/react-icons`, `@tabler/icons-react`.
* **Di
scouraged:** `lucide-react`. Acceptable only 
when the user explicitly asks for it or the p
roject already depends on it.
* **NEVER hand-
roll SVG icons.** If a glyph is missing, inst
all a second library or compose from primitiv
es - do not draw icon paths from scratch.
* *
*One family per project.** Do not mix Phospho
r with Lucide in the same component tree.
* *
*Standardize `strokeWidth` globally** (e.g. `
1.5` or `2.0`).

### 3.D Emoji Policy
Discour
aged by default in code, markup, and visible 
text. Replace symbols with icon-library glyph
s. **Override:** allow emojis only when the u
ser explicitly asks for a playful / chat-styl
e / social-native vibe - and even then use th
em sparingly with intent.

### 3.E Responsive
ness & Layout Mechanics
* Standardize breakpo
ints (`sm 640`, `md 768`, `lg 1024`, `xl 1280
`, `2xl 1536`).
* Contain page layouts using 
`max-w-[1400px] mx-auto` or `max-w-7xl`.
* **
Viewport Stability:** NEVER use `h-screen` fo
r full-height Hero sections. ALWAYS use `min-
h-[100dvh]` to prevent layout jumping on mobi
le (iOS Safari address bar).
* **Grid over Fl
ex-Math:** NEVER use complex flexbox percenta
ge math (`w-[calc(33%-1rem)]`). ALWAYS use CS
S Grid (`grid grid-cols-1 md:grid-cols-3 gap-
6`).

### 3.F Dependency Verification (mandat
ory)
Before importing ANY 3rd-party library, 
check `package.json`. If the package is missi
ng, output the install command first. **Never
** assume a library exists.

---

## 4. DESIG
N ENGINEERING DIRECTIVES (Bias Correction)

L
LMs default to clichés. Override these defau
lts proactively. Each rule has a context-awar
e override path.

### 4.1 Typography
* **Disp
lay / Headlines:** Default `text-4xl md:text-
6xl tracking-tighter leading-none`.
* **Body 
/ Paragraphs:** Default `text-base text-gray-
600 leading-relaxed max-w-[65ch]`.
* **Sans f
ont choice:**
  * **Discouraged as default:**
 `Inter`. Pick `Geist`, `Outfit`, `Cabinet Gr
otesk`, `Satoshi`, or a brand-appropriate ser
if first.
  * **Override:** Inter is acceptab
le when the user explicitly asks for a neutra
l / standard / Linear-style feel, or when the
 brief is a public-sector / accessibility-fir
st site.
* **Pairings to know:** `Geist` + `G
eist Mono`, `Satoshi` + `JetBrains Mono`, `Ca
binet Grotesk` + `Inter Tight`, `GT America` 
+ `IBM Plex Mono`.

* **SERIF DISCIPLINE (VER
Y DISCOURAGED AS DEFAULT):**
  * Serif is **v
ery discouraged as the default font for any p
roject.** "It feels creative / premium / edit
orial" is NOT a reason to reach for serif. Th
e agent's default mental model that "creative
 brief = serif" is the single most-tested AI 
tell in production rounds.
  * **Serif is onl
y acceptable when ONE of these is explicitly 
true:**
    - The brand brief literally names
 a serif font, OR
    - The aesthetic family 
is genuinely editorial / luxury / publication
 / manuscript / heritage / vintage AND you ca
n articulate why this specific serif fits thi
s specific brand
  * For everything else (cre
ative agency, design studio, modern brand, pr
emium consumer, portfolio, lifestyle), **defa
ult sans-serif display** (Geist Display, ABC 
Diatype, Söhne Breit, Cabinet Grotesk Displa
y, Migra Sans, GT Walsheim, Inter Display, PP
 Neue Montreal). Sans display fonts are not "
boring" — they are the default for the same
 reason black is the default in fashion.
  * 
**EMPHASIS RULE (related):** When you want to
 emphasize a word within a headline (the kine
tic "and `spatial` design" type move), use **
italic or bold of the SAME font**. Do NOT inj
ect a random serif word into a sans headline 
(or vice versa) just to add visual interest. 
Mixed-family emphasis is amateur. Italic/bold
 emphasis in the same family is the right mov
e.
  * **Specifically BANNED as defaults:** `
Fraunces` and `Instrument_Serif` (the two LLM
-favorite display serifs).
  * **If a serif i
s justified** (rare, per the above), rotate f
rom this pool, do NOT reuse the same serif ac
ross consecutive projects: PP Editorial New, 
GT Sectra Display, Cardinal Grotesque, Reckle
ss Neue, Tiempos Headline, Recoleta, Cormoran
t Garamond, Playfair Display, EB Garamond, Iv
yPresto, Migra, Editorial Old, Saol Display, 
Söhne Breit Kursiv, Domaine Display, Canela,
 Schnyder, Tobias, NB Architekt, ITC Galliard
.

* **ITALIC DESCENDER CLEARANCE (mandatory)
:** When italic is used in display type and t
he word contains a descender letter (`y g j p
 q`), `leading-[1]` or `leading-none` will cl
ip the descender. Use `leading-[1.1]` minimum
 and add `pb-1` or `mb-1` reserve on the wrap
ping element. Audit every italic word in disp
lay headlines before shipping.

### 4.2 Color
 Calibration
* Max 1 accent color. Saturation
 < 80% by default.
* **THE LILA RULE:** The "
AI Purple / Blue glow" aesthetic is discourag
ed as a default. No automatic purple button g
lows, no random neon gradients. Use neutral b
ases (Zinc / Slate / Stone) with high-contras
t singular accents (Emerald, Electric Blue, D
eep Rose, Burnt Orange, etc.).
* **Override:*
* if the brand or brief explicitly asks for p
urple / violet / lila, embrace it. But execut
e with intent: consistent palette, harmonised
 neutrals, restrained gradients. Not generic 
AI gradient slop.
* **One palette per project
.** Do not fluctuate between warm and cool gr
ays within the same project.
* **COLOR CONSIS
TENCY LOCK (mandatory):** Once an accent colo
r is chosen for a page, it is used on the WHO
LE page. A warm-grey site does not suddenly g
et a blue CTA in section 7. A rose-accented s
ite does not get a teal status badge in the f
ooter. Pick one accent, lock it, audit every 
component before shipping.

* **PREMIUM-CONSU
MER PALETTE BAN (mandatory, second-most-recur
ring AI-tell):**
  * For premium-consumer bri
efs (cookware, wellness, artisan, luxury, her
itage craft, DTC home goods, etc.) the LLM de
fault is **warm beige/cream + brass/clay/oxbl
ood/ochre + espresso/ink dark text**. Concret
ely banned hex families as default background
s and accents:
    - Backgrounds: `#f5f1ea`, 
`#f7f5f1`, `#fbf8f1`, `#efeae0`, `#ece6db`, `
#faf7f1`, `#e8dfcb` (all "warm paper / cream 
/ chalk / bone")
    - Accents: `#b08947`, `#
b6553a`, `#9a2436`, `#9c6e2a`, `#bc7c3a`, `#7
d5621` (all "brass / clay / oxblood / ochre")

    - Text: `#1a1714`, `#1a1814`, `#1b1814` 
(all "espresso / warm near-black")
  * This p
alette is BANNED as the default reach for pre
mium-consumer briefs. Every premium-consumer 
site you have ever shipped uses this exact pa
lette. The brand becomes invisible.
  * **Def
ault alternatives (rotate, do not reuse):**
 
   - **Cold Luxury:** silver-grey + chrome + 
smoke (think Tesla, Apple Watch Hermes-withou
t-the-leather)
    - **Forest:** deep green +
 bone + amber accent (think Filson, Patagonia
 premium)
    - **Black and Tan:** true off-b
lack + warm tan, sharp contrast, no beige
   
 - **Cobalt + Cream:** saturated blue against
 a single neutral, no brass
    - **Terracott
a + Slate:** warm rust against cool grey, no 
brass
    - **Olive + Brick + Paper:** muted 
olive plus brick-red accent
    - **Pure mono
chrome + single saturated pop:** off-white + 
off-black + one bright accent (electric blue,
 emerald, hot pink, etc.)
  * **Palette-rotat
ion rule:** if the previous premium-consumer 
project you generated used the beige+brass fa
mily, this one MUST use a different family. D
o not ship the same warm-craft palette twice 
in a row.
  * **Override:** the beige+brass+e
spresso palette is acceptable ONLY when the b
rand brief explicitly names those colors, or 
when the brand identity is genuinely vintage 
/ artisan / warm-craft AND you can articulate
 why this specific palette fits this specific
 brand. Default-reaching for it because "this
 is a cookware brief" is banned.

### 4.3 Lay
out Diversification
* **ANTI-CENTER BIAS:** C
entered Hero / H1 sections are avoided when `
DESIGN_VARIANCE > 4`. Force "Split Screen" (5
0/50), "Left-aligned content / right-aligned 
asset", "Asymmetric white-space", or scroll-p
inned structures.
* **Override:** centered he
ro is OK for editorial / manifesto / launch-a
nnouncement briefs where the message itself i
s the design.

### 4.4 Materiality, Shadows, 
Cards
* Use cards ONLY when elevation communi
cates real hierarchy. Otherwise group with `b
order-t`, `divide-y`, or negative space.
* Wh
en a shadow is used, tint it to the backgroun
d hue. No pure-black drop shadows on light ba
ckgrounds.
* For `VISUAL_DENSITY > 7`: generi
c card containers are banned. Data metrics br
eathe in plain layout.
* **SHAPE CONSISTENCY 
LOCK (mandatory):** Pick ONE corner-radius sc
ale for the page and stick to it. Options: al
l-sharp (radius 0), all-soft (radius 12-16px)
, all-pill (full radius for interactive). Mix
ed systems are allowed only when there is a d
ocumented rule (e.g. "buttons are full-pill, 
cards are 16px, inputs are 8px") and that rul
e is followed everywhere. Round buttons in a 
square layout, or square cards on a pill-butt
on page, is broken design.

### 4.5 Interacti
ve UI States
LLMs default to "static successf
ul state only." Always implement full cycles:

* **Loading:** Skeletal loaders matching the
 final layout's shape. Avoid generic circular
 spinners.
* **Empty States:** Beautifully co
mposed; indicate how to populate.
* **Error S
tates:** Clear, inline (forms), or contextual
 (toasts only for transient).
* **Tactile Fee
dback:** On `:active`, use `-translate-y-[1px
]` or `scale-[0.98]` to simulate a physical p
ush.
* **BUTTON CONTRAST CHECK (mandatory, a1
1y):** Before shipping any button, verify the
 button text is readable against the button b
ackground. White button + white text, `bg-whi
te` CTA with `text-white` label, transparent 
button against the page background with no bo
rder → all banned. Audit every CTA: contras
t ratio WCAG AA min (4.5:1 for body, 3:1 for 
large text 18px+). Same rule applies to ghost
 buttons over photographic backgrounds (use a
 backdrop, scrim, or stroke).
* **CTA BUTTON 
WRAP BAN (mandatory):** Button text MUST fit 
on one line at desktop. If a label like "VIEW
 SELECTED WORK" wraps to 2 or 3 lines, the bu
tton is broken. Fix by EITHER shortening the 
label (3 words max for primary CTAs, ideally 
1-2) OR widening the button (do not artificia
lly constrain `max-width` on CTAs). Wrapped C
TAs at desktop are a Pre-Flight Fail.
* **NO 
DUPLICATE CTA INTENT (mandatory):** Two CTAs 
with the same intent on one page is a Pre-Fli
ght Fail. Examples of same intent: "Get in to
uch" + "Contact us" + "Let's talk" + "Start a
 project" + "Start something" + "Reach out" =
 all "contact" intent → pick ONE label and 
use it everywhere on the page (nav, hero, foo
ter). Same for "Try free" + "Get started" + "
Sign up free" (all "signup" intent) and "View
 work" + "See selected work" + "Browse projec
ts" (all "portfolio" intent). One label per i
ntent.
* **FORM CONTRAST CHECK (mandatory, a1
1y):** Form inputs, placeholder text, focus r
ings, helper text, and error text all pass WC
AG AA contrast against the section background
. Light placeholders on a near-white form, wh
ite form on white page section, form labels g
rayer than 4.5:1 contrast → all banned. Aud
it every form before shipping.

### 4.6 Data 
& Form Patterns
* Label ABOVE input. Helper t
ext optional but present in markup. Error tex
t BELOW input. Standard `gap-2` for input blo
cks.
* No placeholder-as-label. Ever.

### 4.
7 Layout Discipline (Hard Rules. Failing any 
of these is shipping broken work)

* **Hero M
UST fit in the initial viewport.** Headline m
ax 2 lines on desktop, subtext max **20 words
** AND max 3-4 lines, CTAs visible without sc
roll. If the copy is too long: reduce font sc
ale OR cut copy. If you cannot describe the v
alue-prop in 20 words of subtext, the value-p
rop is unclear, not the rule too tight. Never
 let the hero overflow and force scroll to fi
nd the CTA.
* **Hero font-scale discipline.**
 Plan font size and image size *together*. If
 the hero asset is large and the headline is 
more than 6 words, do not start at `text-7xl/
text-8xl`. Default sensible range: `text-4xl 
md:text-5xl lg:text-6xl` for most heroes; `te
xt-6xl md:text-7xl` only when the headline is
 3-5 words. A 4-line hero headline is always 
a font-size error, never a copy-length error.

* **HERO TOP PADDING CAP (mandatory):** Hero
 top padding max `pt-24` (≈6rem) at desktop
. More than that means the hero content float
s halfway down the viewport and reads as a la
yout bug, not as intentional space. If your h
ero needs more breathing room, increase font 
scale or asset size, not top padding.
* **HER
O STACK DISCIPLINE (max 4 text elements).** T
he hero is a single moment, not a feature lis
t. Allowed text elements, max 4 in total:
  1
. Eyebrow (small uppercase label) OR brand st
rip OR neither - pick zero or one
  2. Headli
ne (max 2 lines, see above)
  3. Subtext (max
 20 words, max 4 lines)
  4. CTAs (1 primary 
+ max 1 secondary)
  - **BANNED in the hero:*
* tiny tagline below CTAs ("Works with GitHub
, GitLab, and self-hosted Git"), trust micro-
strip ("Used by engineering teams at..."), pr
icing teaser ("Free for solo, $10/user for te
ams"), feature bullet list, social-proof avat
ar row. All of those move to dedicated sectio
ns directly below the hero.
  - If you have a
n eyebrow AND a tagline below CTAs in the sam
e hero, drop the tagline. If you have a brand
 strip AND a tagline, drop the tagline. One s
mall text element per hero, max.
* **"Used by
" / "Trusted by" logo wall belongs UNDER the 
hero, never inside it.** The hero is for the 
value prop and primary CTA. The logo wall is 
a separate section directly below. Do not stu
ff trust logos into the same flex row as the 
hero copy.
* **Navigation MUST render on a si
ngle line on desktop.** If items don't fit at
 `lg` (1024px), condense labels, drop seconda
ry items, or move to a hamburger. A two-line 
nav at desktop is broken design.
* **Navigati
on height cap: 80px max desktop, default 64-7
2px.** No huge "agency" nav bars that eat 15%
 of the viewport.
* **Bento grids MUST have r
hythm, not one-sided repetition.** Do not sta
ck 6 left-image / right-text rows. Vary the c
omposition: alternate full-width feature rows
, asymmetric tile sizes, vertical breaks.
* *
*BENTO CELL COUNT RULE (mandatory):** A bento
 grid has EXACTLY as many cells as you have c
ontent for. 3 items → 3 cells (1+2 split, o
r 2+1, or asymmetric trio). 5 items → 5 cel
ls (2+3, 3+2, hero+4, etc.). If your grid has
 an empty cell in the middle or at the end, y
ou planned wrong. Re-shape the grid; do not p
aste a blank tile.
* **Section-Layout-Repetit
ion Ban.** Once you use a layout family for a
 section (e.g., 3-column-image-cards, full-wi
dth-quote, split-text-image), that family can
 appear at most ONCE on the page. "Selected c
ommissions" must not look like "What we do." 
A landing page with 8 sections must use at le
ast 4 different layout families.
* **ZIGZAG A
LTERNATION CAP (mandatory).** Alternating "le
ft-image + right-text" then "left-text + righ
t-image" zigzag layout = banal. Max 2 section
s in a row with this image+text-split pattern
. The 3rd consecutive image+text split is a P
re-Flight Fail. Break the pattern with a full
-width section, a vertical-stack section, a b
ento grid, a marquee, or a different layout f
amily.
* **EYEBROW RESTRAINT (mandatory, the 
#1 violated rule in production tests).** An "
eyebrow" is the small uppercase wide-tracking
 label sitting above a section headline (e.g.
 `FOUR COLORWAYS`, `SELECTED WORK`, `THE HARD
WARE`, `Git-native task management`). Typical
 CSS signature: `text-[11px] uppercase tracki
ng-[0.18em]`, `font-mono text-[10.5px] upperc
ase tracking-[0.22em]`. Every AI-built site p
uts an eyebrow above EVERY section header, pr
oducing the same templated rhythm. Hard rule:

  - **Maximum 1 eyebrow per 3 sections.** He
ro counts as 1. So a page with 9 sections may
 use at most 3 eyebrows total.
  - If section
 A has an eyebrow, the next 2 sections cannot
 have one.
  - **Pre-Flight Check is mechanic
al:** count instances of `uppercase tracking`
 (or similar small-caps mono labels above hea
dlines) across all section components. If cou
nt > ceil(sectionCount / 3), the output fails
.
  - **What to do instead of an eyebrow:** d
rop it entirely. The headline alone is enough
. If you need to categorize a section, the se
ction's location on the page already categori
zes it; no label needed.
* **SPLIT-HEADER BAN
 (mandatory).** The pattern "left big headlin
e + right small explainer paragraph" as a sec
tion header (left col-span-7/8, right col-spa
n-4/5 with a small body paragraph floating in
 the right column) is **banned as default**. 
Sections should have ONE focused message. If 
you genuinely need both a headline and an exp
lainer paragraph, stack them vertically (head
line on top, body below, max-width 65ch). Rea
ch for the split-header pattern only when the
re is a real compositional reason (e.g., the 
right column carries a visual or interactive 
element, not just filler text).
* **Bento Bac
kground Diversity (mandatory).** Bento and fe
ature-grid sections cannot be 6 white-on-whit
e cards with text inside. At least 2-3 cells 
in any multi-cell grid need real visual varia
tion: a real image, a brand-appropriate gradi
ent (not AI-purple), a pattern, a tinted back
ground. A cream-on-cream bento with only typo
graphy inside reads as boring AI default, eve
n when the rest of the page is good.
* **Mobi
le collapse must be explicit per section.** F
or every multi-column layout, declare the `< 
768px` fallback in the same component. No "it
'll work, Tailwind handles it" assumptions.


### 4.8 Image & Visual Asset Strategy

Landin
g pages and portfolios are **visual products*
*. Text-only pages with fake-screenshot divs 
are slop.

**Priority order for visual assets
:**
1. **Image-generation tool first.** If AN
Y image-gen tool is available in the environm
ent (`generate_image`, MCP image tool, IDE-in
tegrated gen, OpenAI image tools, etc.) you M
UST use it to create section-specific assets:
 hero photography, product shots, texture bac
kgrounds, mood images. Generate at the right 
aspect ratio for the section. Do not skip thi
s step because hand-rolled CSS feels faster.

2. **Real web images second.** When no gen to
ol is available, use real photography sources
. Acceptable defaults:
   * `https://picsum.p
hotos/seed/{descriptive-seed}/{w}/{h}` for pl
aceholder photography (seed should describe t
he section, e.g. `marrow-cookware-kitchen`)
 
  * Actual stock or brand URLs when the brief
 provides them
   * Open-license sources (Uns
plash via direct URL, Pexels) if explicitly a
llowed
3. **Last resort: tell the user.** If 
neither is possible, do NOT fill the page wit
h hand-rolled SVG illustrations or div-based 
"fake screenshots." Instead, leave clearly-la
beled placeholder slots (`<!-- TODO: hero pro
duct photo, 1600x1200 -->`) and at the end of
 the response say: *"This page needs real ima
ges at: \[list of placements\]. Please genera
te or provide them."*

**Even minimalist site
s need real images.** A pure-text page is not
 minimalism. It is incomplete work. Even an e
ditorial Linear-style site needs at least 2-3
 real images (hero, one product/lifestyle sho
t, one supporting image). Generate B&W minima
list photography if the brief is restrained; 
do not skip images entirely because the dial 
is low.

**Real company logos for social proo
f.** When the brief calls for a "Trusted by /
 Used by / Customers" logo wall, do NOT defau
lt to plain text wordmarks (`<span>Acme Co</s
pan>` styled in a row). Use real SVG logos:
*
 **Source: Simple Icons** (`https://cdn.simpl
eicons.org/{slug}/ffffff` for any color, or `
simple-icons` npm package). Covers most known
 brands.
* **Alternative: devicon** for tech-
stack logos (`@svgr/cli` or CDN).
* **Make-up
 the brand name? Then make-up an SVG mark too
.** Generate a simple monogram (one letter in
 a circle, two-letter ligature, abstract glyp
h) rendered as an inline `<svg>` matching the
 page style. Plain text wordmarks for invente
d brand names look generic.
* **Always** ensu
re logos render in both light and dark mode (
white-on-dark, black-on-light, or single-colo
r theme variable).
* **LOGO-ONLY rule (mandat
ory):** logo wall = logos and nothing else. D
o NOT print industry / category labels below 
each logo (no `Vercel` + `hosting` underneath
, no `Stripe` + `payments`, no `Cloudflare` +
 `infra`). The logo is the credibility, the l
abel adds nothing the user does not already k
now. Optional: brand name as alt-text for scr
een readers, optional link to the brand's sit
e. That is it.

**Hand-rolled illustrations:*
*
* SVG icons from libraries: fine (see Secti
on 3.C).
* Hand-rolled decorative SVGs (custo
m illustrations, logos, marks): **strongly di
scouraged**, never as default. Acceptable onl
y when:
  - The brief explicitly calls for it
 ("draw me an SVG logo")
  - It's a single, s
imple geometric mark (a square, a circle, a w
ordmark in display type)
  - You're confident
 in the output quality

**Div-based fake scre
enshots are banned.** A "hand-built product p
review" rendered with `<div>` rectangles, fak
e task lists, fake dashboards, fake terminal 
windows is a Tell. If you need to show a prod
uct:
* Use a real screenshot URL if one exist
s
* Generate one via image tool
* Use a real 
component preview (an actual mini-version of 
the UI inside the page)
* Or skip the preview
 entirely and use editorial photography

**He
ro needs a real visual.** Text + gradient blo
b is not a hero - it's a placeholder.

### 4.
9 Content Density

Landing pages live on the 
**first impression**, not the full read. Cut 
ruthlessly.

* **Default content shape per se
ction:** short headline (≤ 8 words) + short
 sub-paragraph (≤ 25 words) + one visual as
set OR one CTA. Anything more must be justifi
ed by the section's job.
* **No data-dump sec
tions.** A 20-row publication table, a 30-row
 award list, a giant pricing matrix on a mark
eting page = wrong layout. Use:
  - Top 3-5 h
ighlights + "View full list" link
  - Marquee
 / carousel for breadth
  - Different page en
tirely if the data is the product
* **Long li
sts need a different UI component, not a long
er list.** Default `<ul>` with bullets / `div
ide-y` rows is the lazy choice. If you have >
 5 items, reach for one of these instead:
  -
 2-column split with grouped items
  - Card g
rid with image + label per item
  - Tabs / ac
cordion if items are categorisable
  - Horizo
ntal scroll-snap pills
  - Carousel for bread
th-heavy lists (testimonials, logos, capabili
ties)
  - Marquee for "lots-of-things-that-do
n't-need-individual-attention"
  A spec sheet
 with 10 rows + a hairline under every row is
 the WORST default. Either group rows into 2-
3 chunks with sparse dividers, or move to a c
ard-per-spec layout.
* **Spec sheets specific
ally (the Marrow-cookware pattern).** A long 
product specification table with `border-b` o
n every row is the AI default for cookware / 
hardware / apparel / artisan-goods briefs. Ba
nned. Concrete alternatives:
  - **2-col card
 grid:** each spec gets its own card with the
 spec name, the value (large display number),
 and a one-line "why it matters" body. Cards 
arranged 2-col on desktop, 1-col mobile.
  - 
**Scroll-snap horizontal pills:** each spec i
s a pill, user can flick through.
  - **Group
ed chunks:** group 10 specs into 3 logical cl
usters (e.g. "Materials", "Cooking", "Warrant
y"), each cluster gets ONE soft divider and a
 cluster heading.
  - **Featured-vs-rest:** 3
-4 hero specs visualised as large display til
es, the rest collapsed under a "View full spe
cifications" disclosure.

* **COPY SELF-AUDIT
 (mandatory before ship):** Before declaring 
any task done, re-read every visible string o
n the page (headlines, subheads, eyebrows, bu
tton labels, body copy, captions, alt text, f
ooter text, error messages). Flag any string 
that is:
  - **Grammatically broken** ("free 
on its past", "two plans but one is honest", 
"to put it on the table" out of context)
  - 
**Has unclear referents** ("we plan to stay t
hat way" without prior context)
  - **Sounds 
like AI hallucination** (cute-but-wrong wordp
lay, forced metaphors that don't track, "eleg
ant nothing" phrases)
  - **Reads like an LLM
 trying to sound thoughtful** (passive-aggres
sive humility, fake-craftsman labels, mock-po
etic micro-meta)
  Rewrite every flagged stri
ng. If unsure whether a string makes sense, r
eplace it with a plain functional sentence. A
I-generated cute copy is worse than boring co
py.
* **Fake-precise numbers are flagged.** N
umbers like `92%`, `4.1×`, `48k`, `5.8 mm`, 
`13.4 lb` either:
  - Come from real data (br
ief, brand guidelines, public metrics) - fine

  - Are explicitly labeled as mock (`<!-- mo
ck -->`, "example", "sample data") - fine
  -
 Are AI-invented spec aesthetics - banned. Do
n't fake engineering precision the brand does
n't claim.
* **One copy register per page.** 
Don't mix technical mono ("47 tasks · 0.6 ct
x-switches/day"), editorial prose, and market
ing punch in the same composition unless the 
brand voice explicitly calls for it.

### 4.1
0 Quotes & Testimonials

* **Max 3 lines** of
 quote body. Never 6. If the original quote i
s longer → cut it. A landing-page quote is 
a snippet, not the full review.
* For very sm
all font sizes (e.g. footer-style testimonial
s), the line cap can stretch slightly. Spirit
: "fits in a glance."
* **No em-dashes inside
 the quote text** as design flourish (long pa
uses, kinetic em-dashes, em-dash-bullets). Se
e Section 9.G - em-dash is completely banned.

* Attribution: name + role + (optionally) co
mpany. Never name only ("- Sarah").
* Quote m
arks: use real typographic quotes ( " " ) or 
none at all. Not straight ASCII ( " ).

### 4
.11 Page Theme Lock (Light / Dark Mode Consis
tency)

The page has ONE theme. Sections do n
ot invert.

* If the page is dark mode, ALL s
ections are dark mode. No light-mode-warm-pap
er section sandwiched between dark sections (
or vice versa). The user must not feel they w
alked into a different website mid-scroll.
* 
The exception: if the brief explicitly calls 
for a "Color Block Story" or "Theme Switch on
 Scroll" device AND that is a deliberate comp
osition (one full theme switch with a strong 
transition, not random alternation), it is al
lowed once per page.
* Default behaviour: pic
k light, dark, or auto (`prefers-color-scheme
`) at the page level and lock it. Section-lev
el background tints within the same theme fam
ily are fine (`bg-zinc-950` next to `bg-zinc-
900`); flipping to `bg-amber-50` in the middl
e of a `bg-zinc-950` page is broken.
* When u
sing a design system with built-in theming (R
adix Themes, shadcn/ui with `<Theme>`), set t
he theme ONCE in `layout.tsx` or the page roo
t. Do not let individual sections override.


---

## 5. CONTEXT-AWARE PROACTIVITY

These a
re tools, not defaults. Use them when the des
ign read calls for them. **None of these fire
 automatically.**

* **Liquid Glass / Glassmo
rphism:** Appropriate for premium consumer, A
pple-adjacent, luxury brand, or media-overlay
 vibes. Inappropriate for dashboards, public-
sector, or "boring B2B." When used, go beyond
 `backdrop-blur`: add a 1px inner border (`bo
rder-white/10`) and a subtle inner shadow (`s
hadow-[inset_0_1px_0_rgba(255,255,255,0.1)]`)
 for physical edge refraction. Provide a soli
d-fill fallback under `prefers-reduced-transp
arency`.
* **Magnetic Micro-physics:** Use wh
en `MOTION_INTENSITY > 5` AND the brief reads
 premium / playful / agency. Implement EXCLUS
IVELY with Motion's `useMotionValue` / `useTr
ansform` outside the React render cycle. Neve
r `useState`. See Section 3.B.
* **Perpetual 
Micro-Interactions** (Pulse, Typewriter, Floa
t, Shimmer, Carousel): Use when `MOTION_INTEN
SITY > 5` AND the section actively benefits f
rom motion (status indicators, live feeds, AI
-feel). **Not every card needs an infinite lo
op.** If a section is informational, leave it
 still. Apply Spring Physics (`type: "spring"
, stiffness: 100, damping: 20`) - no linear e
asing.
* **"Motion claimed, motion shown."** 
If `MOTION_INTENSITY > 4`, the page must actu
ally move: entry transitions on hero, scroll-
reveal on key sections, hover physics on CTAs
, at minimum. A static page that claims `MOTI
ON_INTENSITY: 7` is broken. Conversely, if yo
u cannot ship working motion in the available
 scope, drop the dial to 3 and ship a clean s
tatic page. Never half-build motion that brea
ks (cut-off ScrollTriggers, jumpy enters, mis
sing cleanups).
* **MOTION MUST BE MOTIVATED 
(mandatory).** Before adding any animation, a
sk: "what does this animation communicate?" V
alid answers: hierarchy (drawing attention to
 the right thing), storytelling (revealing co
ntent in sequence that matches a narrative), 
feedback (acknowledging a user action), state
 transition (showing something changed). Inva
lid answer: "it looked cool". GSAP everywhere
 because GSAP is available is amateur. Each S
crollTrigger, each marquee, each pinned secti
on needs a reason. If you cannot articulate t
he reason in one sentence, drop the animation
.
* **MARQUEE MAX-ONE-PER-PAGE (mandatory).**
 Horizontal scrolling text marquees ("logos e
ndlessly scrolling", "manifesto scrolling sid
eways", "kinetic word strip") are appropriate
 at most ONCE per page. Two or more marquees 
on the same page reads as lazy filler. Pick t
he one section where the marquee actually ser
ves the content; the others get a different l
ayout.
* **GSAP Sticky-Stack Pattern (when sc
roll-stack is used).** A "card stack on scrol
l" must be a REAL sticky-stack, not a sequent
ial reveal list. See Section 5.A below for th
e canonical code skeleton. Common failure: tr
igger fires halfway through scroll instead of
 pinning at viewport top. Fix: `start: "top t
op"` not `start: "top center"` or `"top 80%"`
.
* **GSAP Horizontal-Pan Pattern (when horiz
ontal scroll-hijack is used).** See Section 5
.B below for the canonical skeleton. Common f
ailure: animation starts before the section i
s pinned, so the user sees half a slide. Same
 fix: `start: "top top"`, pin the wrapper, sc
rub the inner track.

### 5.A Sticky-Stack - 
Canonical Skeleton

```tsx
"use client";
impo
rt { useRef, useEffect } from "react";
import
 { gsap } from "gsap";
import { ScrollTrigger
 } from "gsap/ScrollTrigger";
import { useRed
ucedMotion } from "motion/react";

gsap.regis
terPlugin(ScrollTrigger);

export function St
ickyStack({ cards }: { cards: React.ReactNode
[] }) {
  const ref = useRef<HTMLDivElement>(
null);
  const reduce = useReducedMotion();


  useEffect(() => {
    if (reduce || !ref.cu
rrent) return;
    const ctx = gsap.context((
) => {
      const cardEls = gsap.utils.toArr
ay<HTMLElement>(".stack-card");
      cardEls
.forEach((card, i) => {
        if (i === car
dEls.length - 1) return;
        ScrollTrigge
r.create({
          trigger: card,
         
 start: "top top",                           
   // pin at viewport top
          endTrigge
r: cardEls[cardEls.length - 1],
          end
: "top top",
          pin: true,
          p
inSpacing: false,
        });
        gsap.to
(card, {
          scale: 0.92,
          opa
city: 0.55,
          ease: "none",
         
 scrollTrigger: {
            trigger: cardEl
s[i + 1],
            start: "top bottom",
  
          end: "top top",
            scrub: 
true,
          },
        });
      });
    
}, ref);
    return () => ctx.revert();
  }, 
[reduce]);

  return (
    <div ref={ref} cla
ssName="relative">
      {cards.map((card, i)
 => (
        <div
          key={i}
        
  className="stack-card sticky top-0 min-h-[1
00dvh] flex items-center justify-center"
    
    >
          {card}
        </div>
      )
)}
    </div>
  );
}
```

Critical points: `s
tart: "top top"`, `pin: true`, every card exc
ept the last is pinned, the scale/opacity tra
nsform is driven by the NEXT card's scroll tr
igger (so previous card shrinks as next one a
rrives).

### 5.B Horizontal-Pan - Canonical 
Skeleton

```tsx
"use client";
import { useRe
f, useEffect } from "react";
import { gsap } 
from "gsap";
import { ScrollTrigger } from "g
sap/ScrollTrigger";
import { useReducedMotion
 } from "motion/react";

gsap.registerPlugin(
ScrollTrigger);

export function HorizontalPa
n({ children }: { children: React.ReactNode }
) {
  const wrap = useRef<HTMLDivElement>(nul
l);
  const track = useRef<HTMLDivElement>(nu
ll);
  const reduce = useReducedMotion();

  
useEffect(() => {
    if (reduce || !wrap.cur
rent || !track.current) return;
    const ctx
 = gsap.context(() => {
      const distance 
= track.current!.scrollWidth - window.innerWi
dth;
      gsap.to(track.current, {
        x
: -distance,
        ease: "none",
        sc
rollTrigger: {
          trigger: wrap.curren
t,
          start: "top top",               
               // pin starts when section top
 hits viewport top
          end: () => `+=${
distance}`,                    // scroll dist
ance = track width minus viewport
          p
in: true,
          scrub: 1,
          inval
idateOnRefresh: true,
        },
      });
  
  }, wrap);
    return () => ctx.revert();
  
}, [reduce]);

  return (
    <section ref={w
rap} className="relative overflow-hidden">
  
    <div ref={track} className="flex h-[100dv
h] items-center">
        {children}
      </
div>
    </section>
  );
}
```

Critical poin
ts: `start: "top top"`, `pin: true`, `end: "+
=${distance}"` (scroll length = horizontal tr
avel needed), `scrub: 1`. The wrapper is pinn
ed, the inner track slides horizontally as th
e user scrolls vertically.

### 5.C Scroll-Re
veal Stagger - Canonical Skeleton (lighter al
ternative)

For simple "items appear as they 
enter viewport" (no pinning), prefer Motion's
 `whileInView` over GSAP - lighter, no Scroll
Trigger needed:

```tsx
"use client";
import 
{ motion, useReducedMotion } from "motion/rea
ct";

export function RevealStagger({ items }
: { items: string[] }) {
  const reduce = use
ReducedMotion();
  return (
    <ul className
="grid gap-6">
      {items.map((item, i) => 
(
        <motion.li
          key={item}
   
       initial={reduce ? false : { opacity: 0
, y: 24 }}
          whileInView={{ opacity: 
1, y: 0 }}
          viewport={{ once: true, 
amount: 0.3 }}
          transition={{
      
      duration: 0.6,
            delay: i * 0
.06,
            ease: [0.16, 1, 0.3, 1],
   
       }}
        >
          {item}
        
</motion.li>
      ))}
    </ul>
  );
}
```


Use this for: feature lists, testimonial grid
s, logo walls, anything that just needs "ente
r on scroll." Save GSAP for actual pin/scrub 
work.

### 5.D Forbidden Animation Patterns


* **`window.addEventListener("scroll", ...)`*
* is banned. It runs on every scroll frame, j
ank-prone, no batching. Use Motion's `useScro
ll()`, GSAP's `ScrollTrigger`, IntersectionOb
server, or CSS `scroll-driven animations` (`a
nimation-timeline: view()`).
* **Custom scrol
l progress calculations using `window.scrollY
`** in React state. Same reason. Re-renders o
n every frame.
* **`requestAnimationFrame` lo
ops that touch React state.** Use motion valu
es (`useMotionValue` + `useTransform`) instea
d.
* **Layout Transitions:** Use Motion's `la
yout` and `layoutId` props for visible state 
changes (re-ordering lists, expanding modals,
 shared elements between routes). Do not wrap
 static content in `layout` props "for safety
" - it costs measurement work.
* **Staggered 
Orchestration:** Use `staggerChildren` (Motio
n) or CSS cascade (`animation-delay: calc(var
(--index) * 100ms)`) for reveal moments where
 sequence matters. For `staggerChildren`, par
ent (`variants`) and children MUST share the 
same Client Component tree.

---

## 6. PERFO
RMANCE & ACCESSIBILITY GUARDRAILS

### 6.A Ha
rdware Acceleration
* Animate ONLY `transform
` and `opacity`. Never animate `top`, `left`,
 `width`, `height`.
* Use `will-change: trans
form` sparingly - only on elements that will 
actually animate.

### 6.B Reduced Motion (ma
ndatory)
* **Any motion above `MOTION_INTENSI
TY > 3` MUST honor `prefers-reduced-motion`.*
* This is non-negotiable.
* In Motion: wrap w
ith `useReducedMotion()` and degrade to stati
c.
* In CSS: gate animations behind `@media (
prefers-reduced-motion: no-preference)` or pr
ovide an override block under `@media (prefer
s-reduced-motion: reduce)` that disables.
* I
nfinite loops, parallax, scroll-hijack, and m
agnetic physics MUST collapse to static / ins
tant under reduced motion.

### 6.C Dark Mode
 (mandatory for any consumer-facing page)
* D
esign for **both modes from the start**. Neve
r ship light-only or dark-only without explic
it user instruction.
* Use Tailwind `dark:` v
ariant OR CSS variables for tokens. Pick one 
strategy per project.
* **Do not prescribe sp
ecific dark-mode colors here.** The brief dec
ides. Maintain visual hierarchy, brand identi
ty, and WCAG AA contrast (AAA for body) acros
s both modes.
* Respect `prefers-color-scheme
: dark`. Default to system preference unless 
the brand insists on one mode.

### 6.D Core 
Web Vitals Targets
* **LCP** < 2.5s. Hero ima
ge must be `next/image priority` or preloaded
.
* **INP** < 200ms. Heavy work off main thre
ad.
* **CLS** < 0.1. Reserve space for images
, fonts, embeds.
* Run Lighthouse before decl
aring a page done.

### 6.E DOM Cost
* Apply 
grain / noise filters EXCLUSIVELY to fixed, `
pointer-events-none` pseudo-elements (e.g., `
fixed inset-0 z-[60] pointer-events-none`). N
EVER on scrolling containers - continuous GPU
 repaints destroy mobile FPS.
* Be aware of b
undle size. Motion is not tiny. Three.js is l
arge. Lazy-load anything that's not above-the
-fold.

### 6.F Z-Index Restraint
NEVER spam 
arbitrary `z-50` or `z-10`. Use z-index stric
tly for systemic layer contexts (sticky navba
rs, modals, overlays, grain). Document the z-
index scale in a project constants file.

---


## 7. DIAL DEFINITIONS (Technical Reference
)

### DESIGN_VARIANCE (Level 1-10)
* **1-3 (
Predictable):** Symmetrical CSS Grid (12-col,
 equal fr-units), equal paddings, centered al
ignment.
* **4-7 (Offset):** `margin-top: -2r
em` overlaps, varied image aspect ratios (4:3
 next to 16:9), left-aligned headers over cen
ter-aligned data.
* **8-10 (Asymmetric):** Ma
sonry layouts, CSS Grid with fractional units
 (`grid-template-columns: 2fr 1fr 1fr`), mass
ive empty zones (`padding-left: 20vw`).
* **M
OBILE OVERRIDE:** For levels 4-10, asymmetric
 layouts above `md:` MUST collapse to strict 
single-column (`w-full`, `px-4`, `py-8`) on v
iewports `< 768px`.

### MOTION_INTENSITY (Le
vel 1-10)
* **1-3 (Static):** No automatic an
imations. CSS `:hover` and `:active` states o
nly. `prefers-reduced-motion` is the default 
mode anyway.
* **4-7 (Fluid CSS):** `transiti
on: all 0.3s cubic-bezier(0.16, 1, 0.3, 1)`. 
`animation-delay` cascades for load-ins. Focu
s on `transform` and `opacity`.
* **8-10 (Adv
anced Choreography):** Complex scroll-trigger
ed reveals, parallax, scroll-driven animation
 (CSS `animation-timeline` or GSAP ScrollTrig
ger). Use Motion hooks. **NEVER use `window.a
ddEventListener('scroll')`** - it is a hard b
an, not a "prefer-not." See Section 5.D for t
he allowed alternatives.

### VISUAL_DENSITY 
(Level 1-10)
* **1-3 (Art Gallery):** Lots of
 white space. Huge section gaps (`py-32` to `
py-48`). Expensive, clean.
* **4-7 (Daily App
):** Standard web app spacing (`py-16` to `py
-24`).
* **8-10 (Cockpit):** Tight paddings. 
No card boxes; 1px lines separate data. Manda
tory: `font-mono` for all numbers.

---

## 8
. DARK MODE PROTOCOL

Dual-mode by default. N
ever assume light-only unless the brief is pr
int-emulating editorial.

### 8.A Token Strat
egy (pick one, stick to it)
* **Tailwind `dar
k:` variant** (default for utility-first proj
ects): every color utility paired with its da
rk variant (`bg-white dark:bg-zinc-950`, `tex
t-gray-900 dark:text-gray-100`).
* **CSS vari
ables** (for shadcn/ui, Radix Themes, or comp
onent libraries with theming): define semanti
c tokens (`--surface`, `--surface-elevated`, 
`--text-primary`, `--accent`) and swap values
 under `[data-theme="dark"]` or `@media (pref
ers-color-scheme: dark)`.

### 8.B Do Not Pre
scribe Specific Colors Here
The brief and bra
nd decide. This skill enforces only:
* **Cont
rast** - WCAG AA minimum for body text, AAA t
arget for hero copy.
* **Hierarchy parity** -
 visual hierarchy that works in light must wo
rk in dark. If a CTA pops in light, it pops i
n dark.
* **Brand fidelity** - primary brand 
color stays recognisable. Don't desaturate th
e brand into a dark mode.
* **No pure `#00000
0` and no pure `#ffffff`** - use off-black (z
inc-950, near-black warm gray) and off-white.
 Pure values kill depth.

### 8.C Default Mod
e
Respect `prefers-color-scheme` unless the b
rand insists. Add a manual toggle if either m
ode would lose key brand expression.

### 8.D
 Test in Both Modes Before Finishing
Open the
 page in both modes during development. Do no
t ship a page you've only seen in one mode.


---

## 9. AI TELLS (Forbidden Patterns)

Avo
id these signatures unless the brief explicit
ly asks for them.

### 9.A Visual & CSS
* **N
O neon / outer glows** by default. Use inner 
borders or subtle tinted shadows.
* **NO pure
 black (`#000000`).** Off-black, zinc-950, or
 charcoal.
* **NO oversaturated accents.** De
saturate to blend with neutrals.
* **NO exces
sive gradient text** for large headers.
* **N
O custom mouse cursors.** Outdated, accessibi
lity-hostile, perf-hostile.

### 9.B Typograp
hy
* **AVOID Inter as default.** See Section 
4.1. Override path exists.
* **NO oversized H
1s** that just scream. Control hierarchy with
 weight + color, not raw scale.
* **Serif con
straints:** Serif for editorial / luxury / pu
blication. Not for dashboards.

### 9.C Layou
t & Spacing
* **Mathematically perfect** padd
ing and margins. No floating elements with aw
kward gaps.
* **NO 3-column equal feature car
ds.** The generic "three identical cards hori
zontally" feature row is banned. Use 2-column
 zig-zag, asymmetric grid, scroll-pinned, or 
horizontal-scroll alternative.

### 9.D Conte
nt & Data ("Jane Doe" Effect)
* **NO generic 
names.** "John Doe", "Sarah Chan", "Jack Su" 
→ use creative, realistic, locale-appropria
te names.
* **NO generic avatars.** No SVG "e
gg" or Lucide user icons → use believable p
hoto placeholders or specific styling.
* **NO
 fake-perfect numbers.** Avoid `99.99%`, `50%
`, `1234567`. Use organic, messy data (`47.2%
`, `+1 (312) 847-1928`).
* **NO startup-slop 
brand names.** "Acme", "Nexus", "SmartFlow", 
"Cloudly" → invent contextual, premium name
s that sound real.
* **NO filler verbs.** "El
evate", "Seamless", "Unleash", "Next-Gen", "R
evolutionize" → concrete verbs only.

### 9
.E External Resources & Components
* **NO han
d-rolled SVG icons.** Use Phosphor / HugeIcon
s / Radix / Tabler. Lucide on explicit reques
t only.
* **Hand-rolled decorative SVGs stron
gly discouraged** as default (see Section 4.8
).
* **NO div-based fake screenshots.** Never
 build a fake product UI out of `<div>` recta
ngles to simulate a screenshot. Use real imag
es, generated images, or skip the preview.
* 
**NO broken Unsplash links.** Use `https://pi
csum.photos/seed/{descriptive-string}/{w}/{h}
`, or generated photo placeholders, or actual
 assets.
* **shadcn/ui customization:** Allow
ed, but NEVER in default state. Customize rad
ii, colors, shadows, typography to the projec
t aesthetic.
* **Production-Ready Cleanliness
:** Code visually clean, memorable, meticulou
sly refined.

### 9.F Production-Test Tells (
banned outright)

These patterns came out of 
real LLM-generated landing-page tests. They a
re the signatures the model defaults to when 
it tries to "look designed." Treat them as ha
rd bans unless the brief explicitly calls for
 one.

**Hero & top-of-page**
* **NO version 
labels in the hero.** `V0.6`, `v2.0`, `BETA`,
 `INVITE-ONLY PREVIEW`, `EARLY ACCESS`, `ALPH
A` - banned as default eyebrows. Only accepta
ble when the brief is explicitly about a prod
uct launch / preview status.
* **NO "Brand ·
 No. 01"-style sub-eyebrows.** "Marrow · No.
 01 · The 6-quart" type micro-meta lines. Sk
ip them.

**Section numbering & micro-labels*
*
* **NO section-number eyebrows.** `00 / IND
EX`, `001 · Capabilities`, `002 · Featured 
commission`, `06 · how it works`, `05 · The
 honest table` - banned. Eyebrows should name
 the topic in plain language, not enumerate.

* **NO `01 / 4`-style pagination on images or
 bento tiles.** If the user can count, they d
on't need the label.
* **NO `Scroll · 001 Ca
pabilities`-style scroll cues.** A simple arr
ow or "Scroll" is enough; no section-number p
refix.
* **NO "Index of Work, 2018 - 2026"-st
yle range labels** as eyebrows. Just say what
 the section is.

**Separators & dots**
* **T
he middle-dot (`·`) is rationed.** Maximum 1
 per line in metadata strips. Do NOT use it a
s the default separator for everything ("foo 
· bar · baz · qux · quux"). If you need a
 separator family, prefer line breaks, hairli
nes, or columns.
* **NO decorative colored st
atus dots on every list/nav/badge.** A colore
d dot before "ONE Q4 SLOT OPEN" or before eve
ry nav link, or every task row - banned by de
fault. Acceptable only when the dot conveys a
ctual semantic state (a server status, an ava
ilability flag) and is used sparingly.

**Em-
dashes & typography flourishes**
* **NO em-da
sh (`—`) as a design element OR anywhere el
se.** See Section 9.G below for the complete,
 non-negotiable ban. The em-dash character is
 forbidden in headlines, eyebrows, pills, bod
y copy, quotes, attribution, captions, button
 text, and alt text. Use the regular hyphen (
`-`).
* **NO `<br>`-broken-and-italicized hea
dlines** as a default "design move." "for thi
rty\<br\>*years.*" type splits. Headlines sho
uld read naturally first, get clever only whe
n the brief demands it.
* **NO vertical rotat
ed text** ("INDEX OF WORK, 2018 - 2026" rotat
ed 90°). Agency-portfolio cliché. Use it on
ly when the brief is explicitly agency / Awww
ards / experimental AND it serves a real comp
osition purpose.
* **NO crosshair / hairline 
grid lines as decoration.** Vertical and hori
zontal lines drawn just to make the page "fee
l designed" - banned. Use them only when they
 organize real content.

**Fake product previ
ews**
* **NO div-based fake product UI in the
 hero** (fake task list, fake terminal, fake 
dashboard built from styled divs). It is the 
#1 LLM-design Tell. Use a real screenshot, a 
generated image, a real component preview, or
 none at all.
* **NO fake version footers** (
"v0.6.2-rc.1", "last sync 4s ago · main") in
side fake screenshots. Adds nothing, screams 
AI.

**Marketing-copy Tells**
* **NO "Quietly
 in use at" / "Quietly trusted by"** social-p
roof headers. Use natural language: "Trusted 
by", "Used at", "Customers include", or skip 
the heading entirely if the logos speak.
* **
NO "From the field" / "Field notes" / "Curren
tly on the bench" / "On our desks" / "Loose p
lates" style poetic labels** on quote, blog, 
or sidebar sections. Reads as performative-cr
aftsman. Use plain functional labels ("Testim
onials", "Latest writing", "Now working on") 
or skip the label.
* **NO "We respect the Fre
nch ones"-style** mock-humble industry-refere
nces in body copy. Cute and AI-y.
* **NO weat
her / locale strips** ("LIS 14:23 · 18°C") 
in headers/footers unless the brief is explic
itly about a place / time-zone-distributed st
udio.
* **NO micro-meta-sentences under eyebr
ows.** Sentences like *"Each of these is a fe
ature we ship today, not a roadmap promise. T
he list will stay short on purpose."* sitting
 under a section heading are clutter. Eyebrow
 + Headline + Body is enough.
* **NO generic 
step labels.** "Stage 1 / Stage 2 / Stage 3",
 "Step 1 / Step 2 / Step 3", "Phase 01 / Phas
e 02 / Phase 03", "Pass One / Pass Two / Pass
 Three". Banned. The actual step content is t
he label. If you must show progression, use t
he verb-noun directly ("Install", "Configure"
, "Ship") not "Stage 1: Install".

**Pills, l
abels and version stamps**
* **NO pills/label
s/tags overlaid on images.** No `<span>` over
lays on photos with tags like `Brand · 02`, 
`PLATE · BRAND`, `Field notes - journal`. Ei
ther let the image speak alone, or add a capt
ion directly below (outside the image).
* **N
O photo-credit captions as decoration.** Stri
ngs like `Field study no. 12 · Ines Caetano`
, `Plate 03 · House archive`, `Frame XII · 
35mm` under stock/picsum images are pretentio
us. Photo credit is allowed ONLY when there i
s a real photographer being credited for a re
al photo (with permission). Otherwise: skip t
he caption or use a one-line functional capti
on ("The 6-quart, in Sage.").
* **NO version 
footers on marketing pages.** Footer strings 
like `v1.4.2`, `Build 0048`, `last sync 4s ag
o · main` are CLI / devtool fixtures, not la
nding-page content. Banned on marketing/landi
ng/portfolio pages.
* **NO "Reservation 412 o
f 800"-style live-stock counters** as decorat
ion. Only if the brief is explicitly a limite
d-run waitlist with real data.

**Decoration 
text strips**
* **NO decoration text strip at
 hero bottom.** Patterns like `BRAND. MOTION.
 SPATIAL.`, `TYPE / FORM / MOTION`, `DESIGN �
� BUILD · SHIP`, `ESTD. 2018 · LISBON · BR
AND. MOTION. SPATIAL.` as a small mono-caps s
trip across the bottom of the hero are an age
ncy-portfolio cliché. Banned by default. Onl
y acceptable when the strip carries real, nav
igable links (sticky bottom nav) or real stat
us info (cookie banner, build info on a docs 
site).
* **NO floating top-right sub-text in 
section headings.** Pattern: section has a gi
ant left-aligned headline; in the top-right c
orner of the same section header there is a s
mall explainer paragraph floating with no cle
ar alignment to anything else. That floater i
s the Tell. Either put the sub-text directly 
under the headline, or build a clean 2-column
 header (left: headline, right: aligned body)
, but not a tiny corner paragraph.

**Lists, 
dividers and scoring**
* **NO `border-t` + `b
order-b` on every row of a long list / spec t
able.** Pick one (bottom-border between rows 
OR top-border above the group) and use it spa
rsely. A 10-row spec table with hairlines und
er each row is the laziest layout - see Secti
on 4.9 for alternative UI components.
* **NO 
scoring/progress bars with filled background 
tracks** as comparison visuals. If you need t
o show "X out of Y" comparisons, prefer a num
ber + small icon, or a tiny inline bar WITHOU
T a background track. Big filled `bg-zinc-200
` tracks with a partial fill on top are dashb
oard-UI clutter on a landing page.

**Locale,
 time, scroll cues**
* **Locale / city-name /
 time / weather strips are banned for 99% of 
briefs.** "Lisbon, working with founders" in 
the hero, "1200-690 Lisbon, Portugal" in the 
footer, "Lisbon 14:23 · 18°C" in the nav. T
hese are agency-portfolio decoration tells. A
llowed ONLY when: the brief explicitly descri
bes a globally-distributed studio with timezo
ne-relevant work, OR a travel-focused brand, 
OR a real-world physical venue. A single cont
act-address mention in the footer is fine; an
 atmospheric locale strip is not.
* **Scroll 
cues are banned.** `Scroll`, `↓ scroll`, `S
croll to explore`, `Scroll to walk through it
`, animated mouse-wheel icons. If the user ha
s not scrolled yet, they are looking at the h
ero. They know what scroll is. The bottom of 
the viewport does not need a label.
* **ZERO 
decorative status dots by default.** A colour
ed dot before nav items, before list rows, be
fore badges, before status labels is a Tell. 
Only acceptable when conveying real semantic 
state (a live indicator on actual server stat
us, a live availability flag) and limited to 
one per page section.

### 9.G EM-DASH BAN (t
he single most-violated Tell)

**Em-dash (`�
�`) is COMPLETELY banned.** It is the LLM's s
ignature stylistic crutch and it is the #1 vi
sual Tell in production tests. There is no "l
imited use" allowance, no "natural language f
requency" allowance, no "in body copy is fine
" allowance. None.

* **Banned in headlines.*
* Use a period or a comma.
* **Banned in eyeb
rows / labels / pills / button text / image c
aptions / nav items.** Replace with line brea
ks, columns, or hairlines.
* **Banned in body
 copy.** Restructure the sentence: two senten
ces with a period, OR a comma, OR parentheses
, OR a colon.
* **Banned in quote attribution
.** Use a normal hyphen with spaces (` - `) o
r a line break + smaller-weight name.
* **Ban
ned in en-dash form too (`–`) when used as 
a separator.** Date ranges (`2018-2026`) use 
a hyphen. Number ranges (`€40-80k`) use a h
yphen.

The ONLY permitted dash characters on
 the page are:
* Regular hyphen `-` (for comp
ound words, ranges, line dividers in markup)

* Minus sign in math (`-5°C`)

If your outpu
t contains a single `—` or `–` anywhere v
isible to the user, the output fails the Pre-
Flight Check and must be rewritten.

This rul
e is non-negotiable. The agent has historical
ly ignored em-dash limits when phrased as "us
e sparingly." The phrasing here is binary: ze
ro em-dashes.

---

## 10. REFERENCE VOCABULA
RY (Pattern Names the Agent Should Know)

Thi
s is a vocabulary, not a library. The agent s
hould KNOW these pattern names to communicate
 about them, design with them in mind, and re
ach for them when the design read calls for t
hem. **Implementations and code sketches live
 in the Block Library (Section 12), which is 
populated iteratively.**

### Hero Paradigms

* **Asymmetric Split Hero** - Text on one sid
e, asset on the other, generous white space.

* **Editorial Manifesto Hero** - Large type, 
no asset, almost-poster.
* **Video / Media Ma
sk Hero** - Type cut out as mask over video b
ackground.
* **Kinetic-Type Hero** - Animated
 typography as the primary visual.
* **Curtai
n-Reveal Hero** - Hero parts on scroll like a
 curtain.
* **Scroll-Pinned Hero** - Hero sta
ys pinned while content scrolls behind.

### 
Navigation & Menus
* **Mac OS Dock Magnificat
ion** - Edge nav, icons scale fluidly on hove
r.
* **Magnetic Button** - Pulls toward curso
r.
* **Gooey Menu** - Sub-items detach like v
iscous liquid.
* **Dynamic Island** - Morphin
g pill for status / alerts.
* **Contextual Ra
dial Menu** - Circular menu expanding at clic
k point.
* **Floating Speed Dial** - FAB spri
nging into curved secondary actions.
* **Mega
 Menu Reveal** - Full-screen dropdown, stagge
r-fade content.

### Layout & Grids
* **Bento
 Grid** - Asymmetric tile grouping (Apple Con
trol Center).
* **Masonry Layout** - Staggere
d grid, no fixed row height.
* **Chroma Grid*
* - Borders / tiles with subtle animating gra
dients.
* **Split-Screen Scroll** - Two halve
s sliding in opposite directions.
* **Sticky-
Stack Sections** - Sections that pin and stac
k on scroll.

### Cards & Containers
* **Para
llax Tilt Card** - 3D tilt tracking mouse coo
rdinates.
* **Spotlight Border Card** - Borde
rs illuminate under cursor.
* **Glassmorphism
 Panel** - Frosted glass with inner refractio
n.
* **Holographic Foil Card** - Iridescent r
ainbow shift on hover.
* **Tinder Swipe Stack
** - Physical card stack, swipe-away.
* **Mor
phing Modal** - Button expands into its own d
ialog.

### Scroll Animations
* **Sticky Scro
ll Stack** - Cards stick and physically stack
.
* **Horizontal Scroll Hijack** - Vertical s
croll → horizontal pan.
* **Locomotive / Se
quence Scroll** - Video / 3D sequence tied to
 scrollbar.
* **Zoom Parallax** - Central bac
kground image zooming on scroll.
* **Scroll P
rogress Path** - SVG line drawing along scrol
l.
* **Liquid Swipe Transition** - Page trans
ition like viscous liquid.

### Galleries & M
edia
* **Dome Gallery** - 3D panoramic galler
y.
* **Coverflow Carousel** - 3D carousel wit
h angled edges.
* **Drag-to-Pan Grid** - Boun
dless draggable canvas.
* **Accordion Image S
lider** - Narrow strips expanding on hover.
*
 **Hover Image Trail** - Mouse leaves popping
 image trail.
* **Glitch Effect Image** - RGB
-channel shift on hover.

### Typography & Te
xt
* **Kinetic Marquee** - Endless text bands
 reversing on scroll.
* **Text Mask Reveal** 
- Massive type as transparent window to video
.
* **Text Scramble Effect** - Matrix-style d
ecoding on load / hover.
* **Circular Text Pa
th** - Text curving along spinning circle.
* 
**Gradient Stroke Animation** - Outlined text
 with running gradient.
* **Kinetic Typograph
y Grid** - Letters dodging the cursor.

### M
icro-Interactions & Effects
* **Particle Expl
osion Button** - CTA shatters into particles 
on success.
* **Liquid Pull-to-Refresh** - Re
load indicator like detaching droplets.
* **S
keleton Shimmer** - Shifting light reflection
 across placeholders.
* **Directional Hover-A
ware Button** - Fill enters from cursor's exa
ct side.
* **Ripple Click Effect** - Wave fro
m click coordinates.
* **Animated SVG Line Dr
awing** - Vectors drawing themselves in real 
time.
* **Mesh Gradient Background** - Organi
c lava-lamp blobs.
* **Lens Blur Depth** - Ba
ckground UI blurred to focus foreground actio
n.

### Animation Library Choice
* **Motion (
`motion/react`)** - default for UI / Bento / 
state-change motion.
* **GSAP + ScrollTrigger
** - for full-page scrolltelling and scroll h
ijacks. Isolate in dedicated leaf components 
with `useEffect` cleanup.
* **Three.js / WebG
L** - for canvas backgrounds and 3D scenes. S
ame isolation rule.
* **NEVER mix GSAP / Thre
e.js with Motion in the same component tree.*
* They fight over the same frames.

---

## 1
1. REDESIGN PROTOCOL

This skill handles **gr
eenfield builds AND redesigns**. Misclassifyi
ng the mode is the single biggest source of b
ad redesign output.

### 11.A Detect the Mode
 (first action)
* **Greenfield** - no existin
g site, or full overhaul approved. Dial basel
ine from Section 1.
* **Redesign - Preserve**
 - modernise without breaking the brand. Audi
t first, extract brand tokens, evolve gradual
ly.
* **Redesign - Overhaul** - new visual la
nguage on top of existing content. Treat as g
reenfield for visuals; preserve content and I
A.

If ambiguous, ask **once**: *"Should this
 redesign preserve the existing brand, or are
 we starting visually from scratch?"*

### 11
.B Audit Before Touching
Document the current
 state before proposing changes:
* **Brand to
kens** - primary / accent colors, type stack,
 logo treatment, radii.
* **Information archi
tecture** - page tree, primary nav, key conve
rsion paths.
* **Content blocks** - what exis
ts, what's doing work, what's filler.
* **Pat
terns to preserve** - signature interactions,
 recognisable hero, copy voice.
* **Patterns 
to retire** - AI-slop tells, broken layouts, 
dead links, generic stock imagery, perf traps
.
* **Dial reading of the existing site** - i
nfer current `DESIGN_VARIANCE` / `MOTION_INTE
NSITY` / `VISUAL_DENSITY`. That's your starti
ng point, not the baseline.
* **SEO baseline*
* - current ranking pages, meta titles, struc
tured data, OG cards. **SEO migration is the 
#1 redesign risk.**

### 11.C Preservation Ru
les
* **Do not change information architectur
e** unless asked. Keep page slugs, anchor IDs
, primary nav labels stable for SEO and muscl
e memory.
* **Extract brand colors before app
lying Section 4.2.** A brand that is already 
purple stays purple - apply the LILA RULE's o
verride.
* **Preserve copy voice** unless ask
ed for a rewrite. Visual modernisation ≠ co
ntent rewrite.
* **Honor existing accessibili
ty wins.** Do not regress focus states, alt t
ext, keyboard nav, contrast.
* **Respect exis
ting analytics events.** Do not rename button
s, form fields, section IDs that downstream t
racking depends on.

### 11.D Modernisation L
evers (priority order)
Apply in order - stop 
when the brief is satisfied:
1. **Typography 
refresh** - biggest visual lift per unit of r
isk.
2. **Spacing & rhythm** - increase secti
on padding, fix vertical rhythm.
3. **Color r
ecalibration** - desaturate, unify neutrals, 
keep brand accent.
4. **Motion layer** - add 
`MOTION_INTENSITY`-appropriate micro-interact
ions to existing components.
5. **Hero & key-
section recomposition** - restructure top-of-
funnel using Section 10 vocabulary.
6. **Full
 block replacement** - only when the existing
 block is unsalvageable.

### 11.E Decision T
ree: Targeted Evolution vs Full Redesign
* IA
, content, and SEO sound → **targeted evolu
tion** (Levers 1-4). ~70% of value at ~40% of
 risk.
* Visual debt is structural (broken IA
, no design system, broken mobile) → **full
 redesign** with strict content preservation.

* Brand itself is changing → **greenfield*
*.

### 11.F What Never Changes Silently
Neve
r modify without explicit user approval:
* UR
L structure / route slugs.
* Primary nav labe
ls.
* Form field names or order (breaks analy
tics + autofill).
* Brand logo or wordmark.
*
 Existing legal / consent / cookie copy.

---


## 12. THE BLOCK LIBRARY (Contract - Implem
entations Land Here Iteratively)

The Referen
ce Vocabulary (Section 10) names patterns. Th
e Block Library implements them with real pro
ps, real motion specs, and real code sketches
.

**Status:** schema defined here. Blocks wi
ll be added iteratively. Do not freelance new
 blocks without following this schema.

### 1
2.A File Location
```
skills/taste-skill/bloc
ks/
  hero/
    asymmetric-split.md
    edito
rial-manifesto.md
    kinetic-type.md
    ...

  feature/
    bento-grid.md
    sticky-scro
ll-stack.md
    zig-zag.md
    ...
  social-p
roof/
  pricing/
  cta/
  footer/
  navigatio
n/
  portfolio/
  transition/
```

### 12.B R
equired Frontmatter
```yaml
---
name: asymmet
ric-split-hero
category: hero
dial_compatibil
ity:
  variance: [6, 10]
  motion: [3, 10]
  
density: [2, 5]
when_to_use: "Landing pages w
ith one strong asset and one strong message. 
Default hero for SaaS, agency, premium consum
er."
not_for: "Editorial / manifesto launches
 where the message IS the design."
stack: ["r
eact", "next", "tailwind", "motion"]
---
```


### 12.C Required Body Sections
1. **Visual 
sketch** - short ASCII or description of the 
layout.
2. **Props API** - the component's in
terface.
3. **Code sketch** - minimal working
 implementation (Server Component default, Cl
ient island for motion).
4. **Mobile fallback
** - explicit collapse rules for `< 768px`.
5
. **Motion variants** - one variant per `MOTI
ON_INTENSITY` band (1-3, 4-7, 8-10). Reduced-
motion fallback explicit.
6. **Dark-mode note
s** - token strategy specific to this block.

7. **Anti-patterns** - common ways this block
 goes wrong.
8. **References** - links to rea
l examples in production.

### 12.D Block-Lib
rary Discipline
* One block per file. No mult
i-block files.
* Every block must work standa
lone (drop it into a page, it renders).
* Eve
ry block must pass the Pre-Flight Check (Sect
ion 14).
* Blocks that depend on a design sys
tem from Section 2.A live under `blocks/<cate
gory>/<name>--<system>.md` (e.g. `feature/ben
to-grid--material.md`).

---

## 13. OUT OF S
COPE

This skill is NOT for:
* Dashboards / d
ense product UI / admin panels (use Fluent, C
arbon, Atlassian, or Polaris from Section 2.A
).
* Data tables (use TanStack Table or AG Gr
id).
* Multi-step forms / wizards (use Form-s
pecific patterns; this skill won't make them 
better).
* Code editors (use Monaco / CodeMir
ror with their official skinning).
* Native m
obile (use Apple HIG / Material directly).
* 
Realtime collab UIs (presence, cursors, OT-aw
are - different problem class).

If the brief
 is one of the above, **say so explicitly**, 
point to the right tool, and only apply this 
skill's marketing-page / about-page / landing
-page parts to the surfaces where they apply.


---

## 14. FINAL PRE-FLIGHT CHECK

Run thi
s matrix before outputting code. This is the 
last filter.

**THIS IS NOT OPTIONAL. Run eve
ry box. If any box fails, the output is not d
one.**

- [ ] **Brief inference** declared (S
ection 0.B one-liner)?
- [ ] **Dial values** 
explicit and reasoned from the brief, not sil
ently using baseline?
- [ ] **Design system**
 chosen from Section 2 if applicable, or aest
hetic labeled honestly?
- [ ] **Redesign mode
** detected and audit performed (if applicabl
e, Section 11)?
- [ ] **ZERO em-dashes (`—`
) anywhere on the page.** Headlines, eyebrows
, pills, body, quotes, attribution, captions,
 buttons, alt text. Zero. (Section 9.G - non-
negotiable.)
- [ ] **Page Theme Lock**: ONE t
heme (light, dark, or auto) for the whole pag
e. No section flips to inverted mode mid-page
 (Section 4.11)?
- [ ] **Color Consistency Lo
ck**: one accent color used identically acros
s all sections (Section 4.2)?
- [ ] **Shape C
onsistency Lock**: one corner-radius system a
pplied consistently (Section 4.4)?
- [ ] **Bu
tton Contrast Check**: every CTA text is read
able against its background (no white-on-whit
e, WCAG AA 4.5:1)?
- [ ] **CTA Button Wrap**:
 no CTA label wraps to 2+ lines at desktop?
-
 [ ] **Form Contrast Check**: form inputs, pl
aceholders, focus rings, labels all pass WCAG
 AA against the section background?
- [ ] **S
erif discipline**: if a serif is used, it is 
NOT Fraunces or Instrument_Serif (or it is, w
ith explicit brand justification)? Different 
serif from your previous project?
- [ ] **Pre
mium-consumer palette check**: if the brief i
s premium-consumer (cookware / wellness / art
isan / luxury), the palette is NOT the AI-def
ault beige+brass+oxblood+espresso family? Dif
ferent family from your previous premium-cons
umer project?
- [ ] **Italic descender cleara
nce**: every italic word with `y g j p q` has
 `leading-[1.1]` min + `pb-1` reserve?
- [ ] 
**Hero fits the viewport**: headline ≤ 2 li
nes, subtext ≤ 20 words AND ≤ 4 lines, CT
A visible without scroll, font scale planned 
around image?
- [ ] **Hero top padding**: max
 `pt-24` at desktop, hero content does not fl
oat halfway down the viewport?
- [ ] **Hero s
tack discipline**: max 4 text elements in her
o (eyebrow OR brand strip, headline, subtext,
 CTAs)? No tiny tagline below CTAs, no trust 
micro-strip in hero?
- [ ] **EYEBROW COUNT (m
echanical)**: count instances of `uppercase t
racking` micro-labels above section headlines
 across all components. Count ≤ ceil(sectio
nCount / 3)? Hero counts as 1.
- [ ] **Split-
Header Ban**: no "left big headline + right s
mall explainer paragraph" pattern as a sectio
n header (vertical stack instead)?
- [ ] **Zi
gzag Alternation Cap**: no 3+ consecutive sec
tions with the same image+text-split layout?

- [ ] **No Duplicate CTA Intent**: no two CTA
s with the same intent ("Get in touch" + "Let
's talk" both on page = Fail)?
- [ ] **Logo w
all = logo only**: no industry / category lab
els printed below logos?
- [ ] **Bento Backgr
ound Diversity**: at least 2-3 bento cells ha
ve real visual variation (image, gradient, pa
ttern), not all white-on-white text cards?
- 
[ ] **"Used by / Trusted by" logo wall** live
s UNDER the hero, not inside it, uses REAL SV
G logos (Simple Icons / devicon) or generated
 SVG marks, NOT plain text wordmarks?
- [ ] *
*Copy Self-Audit**: every visible string re-r
ead, no grammatically-broken or AI-hallucinat
ed phrases ("free on its past" type) shipped?

- [ ] **Motion motivated**: every animation 
can be justified in one sentence (hierarchy /
 storytelling / feedback / state transition),
 no GSAP-for-show?
- [ ] **Marquee max-one-pe
r-page**: no two horizontal marquees on the s
ame page?
- [ ] **Navigation on ONE line** at
 desktop, height ≤ 80px?
- [ ] **Section-La
yout-Repetition** check: no two sections shar
e the same layout family (at least 4 differen
t families across 8 sections)?
- [ ] **Bento 
has rhythm AND exact cell count** (N items �
� N cells, no empty cells in middle or at end
)?
- [ ] **Long lists use the right UI compon
ent** (not default `<ul>` with `divide-y` for
 > 5 items - see Section 4.9 alternatives)?
-
 [ ] **Real images used** (gen-tool first, th
en Picsum-seed, then explicit placeholder slo
ts) - NO div-based fake screenshots, NO hand-
rolled decorative SVGs, NO pure-text minimali
sm?
- [ ] **No pills/labels overlaid on image
s** (no `Plate · Brand`, no `Field notes - j
ournal`)?
- [ ] **No photo-credit captions as
 decoration** (`Field study no. 12 · Ines Ca
etano`)?
- [ ] **No version footers** (`v1.4.
2`, `Build 0048`) on marketing pages?
- [ ] *
*No micro-meta-sentences** under eyebrows ("E
ach of these is a feature we ship today...")?

- [ ] **No decoration text strip at hero bot
tom** (`BRAND. MOTION. SPATIAL.`)?
- [ ] **No
 floating top-right sub-text** in section hea
dings?
- [ ] **No scoring/progress bars with 
filled background tracks** as comparison visu
als?
- [ ] **No locale / city-name / time / w
eather strips** unless brief is genuinely glo
bally-distributed or place-focused?
- [ ] **N
o scroll cues** (`Scroll`, `↓ scroll`, `Scr
oll to explore`)?
- [ ] **No version labels i
n hero** (V0.6, BETA, INVITE-ONLY) unless the
 brief is a launch?
- [ ] **No section-number
ing eyebrows** (`00 / INDEX`, `001 · Capabil
ities`, `06 · how it works`)?
- [ ] **No dec
orative dots** (zero by default, only for rea
l semantic state)?
- [ ] **No `border-t` + `b
order-b` on every row** of long lists / spec 
tables?
- [ ] **Content density** sane: no 20
-row data tables, no fake-precise specs witho
ut justification, ≤ 25-word sub-paragraphs 
by default?
- [ ] **Quotes ≤ 3 lines** of b
ody, attribution clean (no em-dash)?
- [ ] **
Motion claimed = motion shown**: if `MOTION_I
NTENSITY > 4`, page actually animates, not ju
st claimed?
- [ ] **GSAP sticky-stack / horiz
ontal-pan** implemented per Section 5.A / 5.B
 canonical skeleton (`start: "top top"`, `pin
: true`, correct scrub)?
- [ ] **No `window.a
ddEventListener('scroll')`** - using Motion `
useScroll()` / ScrollTrigger / IntersectionOb
server / CSS scroll-driven animations only?
-
 [ ] **Reduced motion** wrapped for everythin
g `MOTION_INTENSITY > 3`?
- [ ] **Dark mode**
 tokens defined and tested in both modes?
- [
 ] **Mobile collapse** explicit (`w-full`, `p
x-4`, `max-w-7xl mx-auto`) for high-variance 
layouts?
- [ ] **Viewport stability**: `min-h
-[100dvh]`, never `h-screen`?
- [ ] **`useEff
ect` animations** have strict cleanup functio
ns?
- [ ] **Empty / loading / error** states 
provided?
- [ ] **Cards omitted** in favor of
 spacing where possible?
- [ ] **Icons** from
 an allowed library only (Phosphor / HugeIcon
s / Radix / Tabler), no hand-rolled SVG paths
?
- [ ] **Motion** isolated in client-leaf co
mponents with `'use client'` at the top, memo
ized?
- [ ] **No AI Tells** from Section 9 (I
nter as default, AI-purple, three-equal cards
, Jane Doe, Acme, "Quietly in use at")?
- [ ]
 **Core Web Vitals** plausibly hit (LCP < 2.5
s, INP < 200ms, CLS < 0.1)?
- [ ] **One desig
n system** per project (no Material + shadcn 
mixed)?

If a single checkbox cannot be hones
tly ticked, the page is not done. Fix it befo
re delivering.

---

# APPENDICES - Real Sour
ce-Backed Reference Material

The sections be
low are vendored reference content. They give
 the agent real install commands, real canoni
cal doc links, and real working starter snipp
ets for each design system named in Section 2
. Use them to ground decisions in production 
reality, not training-data fiction.

## Appen
dix A - Install Commands per Design System

`
``bash
# Material Web (Material 3)
npm instal
l @material/web

# Fluent UI React (v9)
npm i
nstall @fluentui/react-components

# Fluent U
I Web Components (framework-free)
npm install
 @fluentui/web-components @fluentui/tokens

#
 IBM Carbon
npm install @carbon/react @carbon
/styles

# Radix Themes
npm install @radix-ui
/themes

# shadcn/ui (open code, owned compon
ents)
npx shadcn@latest init
npx shadcn@lates
t add button card badge separator input

# Pr
imer CSS (GitHub product/devtool UI)
npm inst
all --save @primer/css

# Primer Brand (GitHu
b marketing UI)
npm install @primer/react-bra
nd

# GOV.UK Frontend
npm install govuk-front
end

# USWDS (US Web Design System)
npm insta
ll uswds

# Atlassian Design System (Atlaskit
)
yarn add @atlaskit/css-reset @atlaskit/toke
ns @atlaskit/button @atlaskit/badge @atlaskit
/section-message @atlaskit/card

# Bootstrap 
5.3
npm install bootstrap

# Shopify Polaris 
Web Components (Shopify apps only)
# Add this
 to your app HTML head:
#   <meta name="shopi
fy-api-key" content="%SHOPIFY_API_KEY%" />
# 
  <script src="https://cdn.shopify.com/shopif
ycloud/polaris.js"></script>
```

## Appendix
 B - Canonical Sources (read these before rei
nventing)

### Material Web
- https://github.
com/material-components/material-web
- https:
//material-web.dev/theming/material-theming/

- https://m3.material.io/develop/web

### Flu
ent UI
- https://fluent2.microsoft.design/get
-started/develop
- https://fluent2.microsoft.
design/components/web/react/
- https://github
.com/microsoft/fluentui
- https://learn.micro
soft.com/en-us/fluent-ui/web-components/

###
 Carbon
- https://carbondesignsystem.com/
- h
ttps://github.com/carbon-design-system/carbon

- https://carbondesignsystem.com/developing/
react-tutorial/overview/
- https://carbondesi
gnsystem.com/developing/web-components-tutori
al/overview/

### Shopify Polaris
- https://s
hopify.dev/docs/api/app-home/web-components
-
 https://github.com/Shopify/polaris-react
- h
ttps://polaris-react.shopify.com/components


### Atlassian
- https://atlassian.design/get-
started/develop
- https://atlassian.design/co
mponents/button/examples
- https://atlaskit.a
tlassian.com/packages/design-system/button/ex
ample/disabled
- https://atlassian.design/tok
ens/design-tokens

### Primer
- https://prime
r.style/
- https://github.com/primer/css
- ht
tps://github.com/primer/brand

### GOV.UK
- h
ttps://design-system.service.gov.uk/component
s/button/
- https://design-system.service.gov
.uk/styles/layout/
- https://github.com/alpha
gov/govuk-frontend

### USWDS
- https://desig
nsystem.digital.gov/documentation/developers/

- https://designsystem.digital.gov/component
s/button/
- https://designsystem.digital.gov/
components/card/
- https://github.com/uswds/u
swds

### Bootstrap
- https://getbootstrap.co
m/docs/5.3/layout/grid/
- https://getbootstra
p.com/docs/5.3/components/card/

### Tailwind

- https://tailwindcss.com/docs/dark-mode
- h
ttps://tailwindcss.com/blog/tailwindcss-v4

#
## Radix
- https://www.radix-ui.com/themes/do
cs/components/theme
- https://www.radix-ui.co
m/themes/docs/components/card
- https://githu
b.com/radix-ui/themes

### shadcn/ui
- https:
//ui.shadcn.com/docs
- https://ui.shadcn.com/
docs/components/card
- https://github.com/sha
dcn-ui/ui

### Native CSS / W3C standards
- h
ttps://developer.mozilla.org/en-US/docs/Web/C
SS/Reference/Properties/backdrop-filter
- htt
ps://developer.mozilla.org/en-US/docs/Web/CSS
/Reference/At-rules/@media/prefers-color-sche
me
- https://developer.mozilla.org/en-US/docs
/Web/CSS/Reference/At-rules/@media/prefers-re
duced-motion
- https://developer.mozilla.org/
en-US/docs/Web/CSS/Guides/Grid_layout
- https
://developer.mozilla.org/en-US/docs/Web/CSS/G
uides/Scroll-driven_animations
- https://draf
ts.csswg.org/scroll-animations-1/

### Apple 
Liquid Glass (Apple platforms only)
- https:/
/developer.apple.com/design/human-interface-g
uidelines/materials
- https://developer.apple
.com/documentation/TechnologyOverviews/liquid
-glass
- https://developer.apple.com/document
ation/TechnologyOverviews/adopting-liquid-gla
ss
- https://developer.apple.com/documentatio
n/SwiftUI/Material

---

## Appendix C - Appl
e Liquid Glass: Honest Web Approximation

Do 
**not** treat random CSS snippets as official
 Apple Liquid Glass.

### What is official
Ap
ple documents Liquid Glass inside Apple's Hum
an Interface Guidelines and Developer Documen
tation for **Apple platforms**. It is a dynam
ic material used across Apple platform UI. Ap
ple's native implementation belongs to Apple 
platform APIs and system components, **not a 
public web CSS package**.

Relevant official 
docs:
- Apple Human Interface Guidelines → 
Materials
- Apple Developer Documentation →
 Liquid Glass
- Apple Developer Documentation
 → Adopting Liquid Glass
- SwiftUI → Mate
rial

### What is NOT official
There is no `l
iquid-glass.css` from Apple for normal websit
es.

A web approximation can use:
- `backdrop
-filter`
- transparent backgrounds
- layered 
borders
- highlight overlays
- gradients
- mo
tion
- strong contrast fallbacks

But that is
 **web glassmorphism / frosted-glass approxim
ation**, not official Apple Liquid Glass. Lab
el it as such in comments.

### Safer web app
roximation skeleton

```css
.liquid-glass-web
-approx {
  position: relative;
  isolation: 
isolate;
  overflow: hidden;
  border-radius:
 999px;
  border: 1px solid rgb(255 255 255 /
 .32);
  background:
    linear-gradient(135d
eg, rgb(255 255 255 / .30), rgb(255 255 255 /
 .08)),
    rgb(255 255 255 / .12);
  backdro
p-filter: blur(24px) saturate(180%) contrast(
1.05);
  -webkit-backdrop-filter: blur(24px) 
saturate(180%) contrast(1.05);
  box-shadow:

    inset 0 1px 0 rgb(255 255 255 / .48),
   
 inset 0 -1px 0 rgb(255 255 255 / .12),
    0
 18px 60px rgb(0 0 0 / .18);
}

.liquid-glass
-web-approx::before {
  content: "";
  positi
on: absolute;
  inset: 0;
  z-index: -1;
  bo
rder-radius: inherit;
  background:
    radia
l-gradient(circle at 20% 0%, rgb(255 255 255 
/ .55), transparent 34%),
    linear-gradient
(90deg, rgb(255 255 255 / .18), transparent 4
2%, rgb(255 255 255 / .14));
  pointer-events
: none;
}

.liquid-glass-web-approx::after {

  content: "";
  position: absolute;
  inset:
 1px;
  border-radius: inherit;
  border: 1px
 solid rgb(255 255 255 / .14);
  pointer-even
ts: none;
}

@media (prefers-color-scheme: da
rk) {
  .liquid-glass-web-approx {
    border
-color: rgb(255 255 255 / .18);
    backgroun
d:
      linear-gradient(135deg, rgb(255 255 
255 / .16), rgb(255 255 255 / .04)),
      rg
b(15 23 42 / .42);
    box-shadow:
      inse
t 0 1px 0 rgb(255 255 255 / .22),
      0 18p
x 60px rgb(0 0 0 / .42);
  }
}

@media (prefe
rs-reduced-transparency: reduce) {
  .liquid-
glass-web-approx {
    background: rgb(255 25
5 255 / .96);
    backdrop-filter: none;
    
-webkit-backdrop-filter: none;
  }
}
```

**I
mportant:** `prefers-reduced-transparency` ha
s uneven browser support; test it. Always pro
vide enough contrast even without blur.

---


**End of appendices.** Install commands abov
e are reality anchors. The Apple Liquid Glass
 skeleton is a labeled approximation, not an 
Apple-issued package. For canonical docs per 
design system, consult the system's official 
docs (links in Section 2 plus Appendix B).



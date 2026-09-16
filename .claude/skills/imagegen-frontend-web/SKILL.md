---
name: imagegen-frontend-web
description: 
Elite frontend image-direction skill for gene
rating premium, conversion-aware website desi
gn references. CRITICAL OUTPUT RULE — gener
ate ONE separate horizontal image FOR EVERY s
ection. A landing page with 8 sections produc
es 8 images. Never compress multiple sections
 into one image. Enforces composition variety
 (not always left-text / right-image), backgr
ound-image freedom, varied CTAs, varied hero 
scales (giant / mid / mini minimalist), narra
tive concept spine, second-read moments, and 
a single consistent palette across all images
. Optimized for landing pages, marketing site
s, and product comps that developers or codin
g models can accurately recreate.
---

# HARD
 OUTPUT RULE — READ FIRST

**Generate one s
eparate horizontal image PER section. Always.
 No exceptions.**

- 1 section requested -> 1
 image
- 4 sections requested -> 4 images
- 8
 sections requested -> 8 images
- 12 sections
 requested -> 12 images
- "landing page" with
 no count -> default to 6 sections -> 6 image
s
- "full website template" -> default to 8 s
ections -> 8 images

Each image is one sectio
n, generated as its own image call. Never com
bine multiple sections into one frame. Never 
return a single tall image that contains the 
whole page.

If you can only render one image
 at a time, output them sequentially in the s
ame response, one after the other, until ever
y section has its own image. Announce each on
e ("Section 1 of 8: Hero", "Section 2 of 8: T
rust bar", etc.).

This rule overrides any mo
del default that wants to collapse output int
o a single image.

---

# HERO COMPOSITION BI
AS — READ FIRST

The default **left-text / 
right-image hero is the most overused AI patt
ern**. It is allowed, but it should not be yo
ur first instinct.

Before reaching for it, c
onsider these alternatives and pick whichever
 fits the brand best:
- centered over backgro
und image
- bottom-left over image
- bottom-r
ight over image
- top-left lead
- stacked cen
ter
- image-as-canvas
- off-grid editorial
- 
mini minimalist
- right-text / left-image (in
verted classic)

Use left-text / right-image 
only when it is genuinely the strongest choic
e — not by default.

---

# CORE DIRECTIVE:
 AWWWARDS-LEVEL IMAGE ART DIRECTION
You are a
n elite frontend image art director.

Your jo
b is not to generate generic AI art.
Your job
 is to generate highly creative, premium, fro
ntend design reference images that feel like 
real high-end website concepts.

Standard ima
ge generation tends to collapse into repetiti
ve defaults:
- centered dark hero
- purple/bl
ue AI glow
- floating meaningless blobs
- gen
eric dashboard card spam
- weak typography hi
erarchy
- cloned sections
- "luxury" that is 
just beige serif text
- "creative" that is ac
tually messy and unreadable
- text-heavy layo
uts with not enough imagery
- overly dense se
ctions with no breathing room

Your goal is t
o aggressively break these defaults.

The out
put must feel:
- art-directed
- premium
- vis
ually memorable
- structured
- readable
- imp
lementation-friendly
- clearly usable as a fr
ontend reference

Do not generate random mood
 art unless explicitly asked.
Default to webs
ite design comps.

---

## 1. ACTIVE BASELINE
 CONFIGURATION

- DESIGN_VARIANCE: 8
  `(1 = 
rigid / symmetrical, 10 = artsy / asymmetric)
`
- VISUAL_DENSITY: 4
  `(1 = airy / gallery-
like, 10 = packed / intense)`
- ART_DIRECTION
: 8
  `(1 = safe commercial, 10 = bold creati
ve statement)`
- IMPLEMENTATION_CLARITY: 9
  
`(1 = loose moodboard, 10 = very codeable UI 
reference)`
- IMAGE_USAGE_PRIORITY: 9
  `(1 =
 mostly typographic, 10 = strongly image-led)
`
- SPACING_GENEROSITY: 8
  `(1 = compact / t
ight, 10 = very spacious / breathable)`
- LAY
OUT_VARIATION: 8
  `(1 = same anchor repeats,
 10 = bold composition variety across section
s)`
- CONVERSION_DISCIPLINE: 8
  `(1 = pure a
rt moodboard, 10 = clear funnel + premium des
ign balance)`

AI Instruction:
Use these as g
lobal defaults unless the user clearly asks f
or something else.
Do not ask the user to edi
t this file.
Adapt these values dynamically f
rom the prompt.

Interpretation:
- **Adaptati
on priority**: the user's brief always overri
des defaults. Read the prompt carefully, then
 adjust dials, hero scale, background mode, g
radient use, and composition variety to match
 — never force a recipe that contradicts th
e brief.
- If the user says "clean", reduce d
ensity and increase clarity.
- If the user sa
ys "crazy creative", increase variance and ar
t direction.
- If the user says "premium SaaS
", keep clarity high and art direction contro
lled.
- If the user says "editorial", allow s
tronger type and more asymmetry.
- Bias towar
d stronger visual concepts, not safe layouts 
— but never against the brief.
- Use imager
y as a core design material — including as 
**full-bleed backgrounds**, not only as inlin
e assets, **when the brief allows it**.
- Var
y composition: do not default to "text left, 
image right". Move text to bottom-left, cente
r, top-right, etc. across sections.
- Keep se
ctions breathable. Do not over-pack the page.

- Prefer slightly more whitespace between se
ctions than default.
- Stay conversion-aware:
 every section has a job (hook / proof / educ
ate / convert).

### Brief-to-direction mappi
ng
Read the brief. Then bias the picks like t
his:

If the user says **"minimalist" / "clea
n" / "typography-only" / "swiss" / "ultra sim
ple"**:
- Hero Scale: Mini Minimalist
- Backg
round Mode: solid surfaces, subtle texture, o
ptional ONE color-blocked diptych
- Gradients
: skip or use only the softest tonal gradient

- Composition: stacked center, generous nega
tive space
- Skip the "must include full-blee
d" rule

If the user says **"editorial" / "ma
gazine" / "art-directed" / "fashion"**:
- Her
o Scale: Mid Editorial or Giant Statement
- B
ackground Mode: editorial side-image, duotone
 treated image, atmospheric photo grade
- Gra
dients: subtle tonal grades only
- Compositio
n: off-grid editorial offset, asymmetric pull
s
- Strong typography contrast

If the user s
ays **"cinematic" / "atmospheric" / "premium"
 / "luxury" / "bold"**:
- Hero Scale: Giant S
tatement
- Background Mode: full-bleed image 
with tonal overlay, soft radial vignette + pr
oduct, micro-noise gradient
- Gradients: cine
matic palette-matched welcomed
- Composition:
 bottom-left over background image, centered 
low, image-as-canvas

If the user says **"Saa
S" / "product" / "dashboard" / "fintech" / "i
nfra"**:
- Hero Scale: Mid Editorial
- Backgr
ound Mode: solid + inline asset, flat block +
 detail crop, occasional editorial side-image

- Gradients: very subtle, palette-matched on
ly
- Composition: clear product framing, trus
t-driven anchors
- Slightly higher implementa
tion clarity

If the user says **"agency" / "
creative studio" / "portfolio"**:
- Hero Scal
e: Giant Statement OR Mini Minimalist (decisi
ve)
- Background Mode: vary boldly (full-blee
d image, color-blocked diptych, duotone)
- Gr
adients: editorial color washes acceptable
- 
Composition: off-grid, poster-like

If the us
er says **"e-commerce" / "shop" / "store" / "
product page"**:
- Hero Scale: Mid Editorial 
with strong product focus
- Background Mode: 
full-bleed product photo, soft radial vignett
e + crop, flat block + detail
- Gradients: su
btle, never competing with product
- Composit
ion: product-led; CTAs unmistakable

If the b
rief is silent on style:
- Use defaults from 
§1 + §2 with confident background variety
-
 Pick one Hero Scale decisively, do not split
 the difference

Never force backgrounds, gra
dients, or full-bleed treatments where the br
ief asks for restraint. Never strip them out 
where the brief asks for atmosphere.

---

##
 2. THE COMBINATORIAL VARIATION ENGINE
To avo
id repetitive AI-looking output, internally c
hoose one option from each category based on 
the prompt and commit to it consistently.

Do
 not mash everything together into chaos.
Pic
k a strong combination and execute it clearly
.

### Theme Paradigm
Choose 1:
1. Pristine L
ight Mode
   Off-white / cream / paper tones,
 sharp dark text, editorial confidence.
2. De
ep Dark Mode
   Charcoal / graphite / zinc, e
legant glow only when justified.
3. Bold Stud
io Solid
   Strong controlled color fields li
ke oxblood, royal blue, forest, vermilion, or
 emerald with crisp contrasting UI.
4. Quiet 
Premium Neutral
   Bone, sand, taupe, stone, 
smoke, muted contrast, restrained luxury.

##
# Background Character
Choose 1:
1. Subtle te
chnical grid / dotted field
2. Pure solid fie
ld with soft ambient gradient depth
3. Full-b
leed cinematic imagery with proper contrast c
ontrol
4. Quiet textured paper / material / t
actile surface feel

### Typography Character

Choose 1:
1. Satoshi-like clean grotesk
2. N
eue-Montreal-like refined grotesk
3. Cabinet 
/ Clash-like expressive display
4. Monument-l
ike compressed statement typography
5. Elegan
t editorial serif + sans pairing
6. Swiss rat
ional sans with very strong hierarchy

Never 
drift into boring default web typography ener
gy.

### Hero Architecture
Choose 1:
1. Cinem
atic Centered Minimalist
2. Asymmetric Split 
Hero
3. Floating Polaroid Scatter
4. Inline T
ypography Behemoth
5. Editorial Offset Compos
ition
6. Massive Image-First Hero with restra
ined text

### Section System
Choose 1 domina
nt structure:
1. Strict modular bento rhythm

2. Alternating editorial blocks
3. Poster-lik
e stacked storytelling
4. Gallery-led visual 
cadence
5. Swiss grid discipline
6. Asymmetri
c premium marketing flow

### Signature Compo
nent Set
Choose exactly 4 unique components:

- Diagonal Staggered Square Masonry
- 3D Casc
ading Card Deck
- Hover-Accordion Slice Layou
t
- Pristine Gapless Bento Grid
- Infinite Br
and Marquee Strip
- Turning Polaroid Arc
- Ve
rtical Rhythm Lines
- Off-Grid Editorial Layo
ut
- Product UI Panel Stack
- Split Testimoni
al Quote Wall
- Oversized Metrics Strip
- Lay
ered Image Crop Frames

### Motion-Implied La
nguage
Choose exactly 2:
- scrubbing text rev
eal energy
- pinned narrative section energy

- staggered float-up energy
- parallax image 
drift energy
- smooth accordion expansion ene
rgy
- cinematic fade-through energy

### Comp
osition Anchor (per-section)
The **left-text 
/ right-image** layout is allowed, but it is 
the most overused AI pattern — do not use i
t as the default. Reach for it only when it i
s the genuinely best fit.

Each section picks
 1 anchor; across the site at least 3 differe
nt anchors must appear; vary the hero so the 
page does not open on the AI default.
- Cente
red statement
- Top-left lead, support bottom
-right
- Bottom-left text over background ima
ge
- Bottom-right CTA cluster
- Left-third ca
ption + right-two-thirds visual (classic — 
use sparingly, never twice in a row)
- Right-
third caption + left-two-thirds visual (inver
ted classic)
- Centered low (text in lower 40
% over hero image)
- Off-grid editorial offse
t (asymmetric pull)
- Stacked center (label /
 headline / sub / CTA all centered, ultra min
imalist)
- Image-as-canvas with text overlaid
 in a clean safe area

### Background Mode (p
er-section)
Pick 1 per section; vary across t
he page so it is never all the same mode. Be 
**confident** with backgrounds — they are a
 primary tool, not a risk.
- Solid surface wi
th inline asset
- Subtle texture / paper / gr
id as background
- Full-bleed image backgroun
d with tonal overlay (text remains highly rea
dable)
- Editorial side-image (50/50, 60/40, 
40/60 — invertible)
- Image as the entire v
isual + text overlaid in a clean safe area
- 
Flat color block + small product / detail cro
p as accent
- Cinematic tonal gradient (palet
te-matched, low chroma, professional)
- Atmos
pheric photo with strong color grade (single-
tone graded for brand mood)
- Duotone treated
 image (two-color photo treatment, palette-lo
cked)
- Soft radial vignette + product crop (
luxury / editorial feel)
- Micro-noise gradie
nt over solid (premium tactile depth, not fla
shy)
- Color-blocked diptych (two flat fields
 meeting, modernist)

### CTA Variation
Pick 
the CTA style that fits each section, not a d
efault pill every time:
- Classic primary pil
l
- Outline / ghost
- Underlined inline link 
with arrow
- Banner-style full-width CTA
- Ov
ersized headline + tiny CTA hint
- CTA as cap
tion under a strong visual

Across the site, 
vary CTA style at least once. The page's prim
ary action stays unmistakable.

### Hero Scal
e (per-page)
Pick 1 — must match brand mood
:
- Giant Statement Hero (massive type, large
 image, dominant first viewport)
- Mid Editor
ial Hero (balanced type/image, cinematic but 
not screen-filling)
- Mini Minimalist Hero (t
iny logo + short statement + thin CTA, almost
 no image, lots of negative space)

Mini does
 not mean weak — it means confident restrai
nt.

### Narrative / Concept Spine
Pick 1 and
 let it thread through visuals and short copy
 across the page.
- Artifact / collectible �
� proof, specimen, treasured object framing
-
 Journey / pilgrimage — directional flow, w
aypoint sections, roadmap feeling
- Tool / pr
ecision instrument — machined detail, calib
rated UI, tactile controls
- Living system / 
garden — organic growth metaphor, branching
 layout, nurtured tone
- Stage / spotlight �
� theatrical contrast, performer + audience f
raming
- Archive / dossier — indexed rows, 
captions, understated authority

### Second-R
ead Moment
Pick exactly 1 unobvious but legib
le motif and place it deliberately, once acro
ss the page:
- asymmetric bleed that still re
spects hierarchy
- one oversized punctuation 
or numeral serving structure
- a single unexp
ected material switch (paper vs gloss vs meta
l accent)
- a narrow vertical side-rail edito
rial note style
- a macro crop that carries b
rand color naturally
Avoid gimmick-for-gimmic
k: the moment must aid scan order or brand re
call.

Important:
These are not coding instru
ctions.
They are visual-direction cues the ge
nerated design should imply.

---

## 3. FRON
TEND REFERENCE RULE
Every generated image mus
t clearly communicate:
- layout
- section hie
rarchy
- spacing
- typography scale
- visual 
rhythm
- CTA priority
- component styling
- i
mage treatment
- overall design system

A dev
eloper or coding model should be able to look
 at the image and understand how to build it.


Do not produce vague abstract artwork when 
the request is for frontend.

---

## 4. HERO
 MINIMALISM RULES
The hero must feel cinemati
c, clear, and intentional.

### Hero Composit
ion Bias
The **left-text / right-image hero i
s the most overused AI hero pattern**. It is 
allowed, but it should not be your default st
arting point.

Prefer one of these instead, u
nless left-text / right-image is genuinely th
e strongest fit:
- Centered statement over fu
ll-bleed image (text in lower 40%)
- Bottom-l
eft text over background image
- Bottom-right
 text over background image
- Top-left lead, 
support bottom-right
- Stacked center (label 
/ headline / sub / CTA all centered)
- Image-
as-canvas with text overlaid in a clean safe 
area
- Right-text / left-image (inverted clas
sic)
- Off-grid editorial offset
- Mini Minim
alist Hero (tiny logo + short statement + thi
n CTA, mostly negative space)

### Pre-output
 check
Before rendering the hero image, ask y
ourself: "Am I drafting the default text-left
 / image-right layout out of habit?" If yes, 
prefer a different anchor from the list above
 unless the brief or brand truly requires the
 classic.

### Absolute Hero Rules
- the hero
 must feel like a strong opening scene
- keep
 the hero composition clean
- do not overcrow
d the first viewport
- the main headline must
 feel short and powerful
- headline should us
ually read like 5-10 strong words, not a para
graph
- keep supporting text concise
- priori
tize negative space and contrast
- avoid stuf
fing the hero with pills, fake stats, badges,
 tiny logos, and nonsense detail

### Headlin
e Rule
The H1 should visually read like a pre
mium statement.
Do not let it feel long, weak
, or overly wrapped.

### Typography Executio
n
Prefer:
- medium / normal / light elegance

- tight tracking
- controlled line count
- st
rong scale contrast

Avoid:
- random extra-bo
ld shouting everywhere
- gradient text as a l
azy premium effect
- 6-line startup headings

- text treatment that looks generated

### Gr
aphic Restraint
Do not default to:
- giant me
aningless outline numbers
- cheap SVG-looking
 filler graphics
- generic AI blobs
- random 
orb clutter

Use:
- typography
- image crops

- real layout tension
- premium materials
- s
trong framing
instead.

---

## 5. IMAGE COUN
T & PAGE SLICING

### THIS IS THE PRIMARY OUT
PUT RULE
Generate **one separate horizontal i
mage PER section**. Always.

- never combine 
multiple sections in a single image
- never r
eturn a single tall slice that contains the w
hole page
- never return one "best" image and
 skip the rest
- never replace several sectio
ns with one collage

If the request is ambigu
ous about section count, **default high**:
- 
"hero" -> 1 image
- "landing page" / "site te
mplate" -> default to 6 sections -> 6 images

- "full website" -> default to 8 sections -> 
8 images
- "marketing site" -> default to 8 s
ections -> 8 images
- "product page" -> defau
lt to 6 sections -> 6 images
- "portfolio" ->
 default to 6 sections -> 6 images

If the mo
del can only render one image per call, gener
ate them **sequentially in the same response*
*, one after the other, labeled "Section X of
 N: <name>" until the full set is delivered.


### Format
- Always horizontal (16:9, 16:10,
 or 21:9 depending on density)
- Each image r
enders one focused section in high fidelity
-
 Hero usually 16:9 or 21:9; narrower content 
sections may be 16:10

### Counting rule
- 1 
section -> 1 horizontal image
- 4 sections ->
 4 horizontal images
- 8 sections -> 8 horizo
ntal images
- 12 sections -> 12 horizontal im
ages

Do not collapse multiple sections into 
one tall slice. Section size and density may 
still vary, but the canvas stays horizontal a
nd **one section per frame**.

### Section si
ze variety
Across the site, mix section ambit
ion deliberately:
- some sections are large, 
content-rich, art-directed
- some sections ar
e mini, ultra minimalist, mostly negative spa
ce
- some sections are medium editorial block
s

This rhythm creates a premium scrollscape,
 not uniform slabs.

### Continuity Rule
Acro
ss all per-section images, enforce one brand 
world:
- same palette and accent logic
- same
 typography family and scale
- same CTA famil
y (style variations are fine, identity is not
)
- same border radius language
- same image 
treatment (color grade, materials, framing)
-
 same tonal voice in any short copy

A viewer
 scrolling through all frames must read them 
as one site.

---

## 6. CREATIVITY ESCALATIO
N RULE
The design must show real creative amb
ition.

Do not settle for the first obvious l
ayout solution.
Push the work beyond generic 
SaaS patterns.

Actively increase at least 3 
of these:
- stronger composition
- more disti
nctive typography
- more confident scale cont
rast
- more memorable hero concept
- more int
eresting image treatment
- more expressive se
ction rhythm
- more original framing / croppi
ng
- more art-directed visual tension
- more 
surprising but clear layout structure

Creati
vity must feel intentional, not chaotic.

Do:

- make bold but controlled design decisions

- use asymmetry when it improves the page
- c
reate visual moments that feel premium and me
morable
- make the page feel designed, not au
to-generated

Do not:
- default to safe templ
ate layouts
- repeat the same block structure
 too often
- confuse creativity with clutter

- make the page overly dense

---

## 7. IMAG
E-FIRST ART DIRECTION
This skill must activel
y use images.

Images are not optional decora
tion.
Images are a core part of the frontend 
design language.

Strongly prefer:
- art-dire
cted photography
- product imagery
- editoria
l imagery
- image crops
- framed image panels

- layered image compositions
- image-led her
o sections
- image-supported storytelling blo
cks

Use images to:
- create visual hierarchy

- break up text-heavy layouts
- build mood a
nd brand character
- support section transiti
ons
- make the design easier to interpret and
 implement

Important:
- the design should no
t become text-only or card-only unless the us
er explicitly wants that
- if a page has mult
iple sections, several sections should meanin
gfully include imagery
- if a hero exists, it
 should usually contain a strong visual image
, product visual, or art-directed media eleme
nt
- imagery should feel premium and intentio
nal, not like stock filler

Avoid:
- tiny use
less thumbnails
- random decorative images wi
th no structural role
- one single image and 
then a completely text-heavy rest of page
- o
verusing fake UI panels instead of real visua
l variety

---

## 8. ANTI-AI-SLOP RULES
Stri
ctly avoid these patterns unless explicitly r
equested.

### Layout slop
- endless centered
 sections
- identical card rows repeated sect
ion after section
- cloned left-text/right-im
age blocks
- perfect but lifeless symmetry ev
erywhere
- fake complexity without hierarchy

- empty decorative space with no purpose

###
 Visual slop
- default purple/blue AI gradien
ts
- too many glowing edges
- floating sphere
s / blobs everywhere
- glassmorphism stacked 
without reason
- random futuristic details wi
th no structure
- over-rendered noise that hi
des the layout

### Typography slop
- giant h
eading + weak tiny subcopy
- too many font mo
ods in one page
- awkward line breaks
- lazy 
all-caps everywhere
- gradient headline as sh
ortcut for "premium"

### Content slop
Ban ge
neric copy vibes like:
- unleash
- elevate
- 
revolutionize
- next-gen
- seamless
- powerfu
l solution
- transformative platform

Avoid f
ake brand slop:
- Acme
- Nexus
- Flowbit
- Qu
antumly
- NovaCore
- obvious nonsense wordmar
ks

Use short, believable, design-friendly co
py.

### Density slop
- no over-packed sectio
ns
- no card overload in every block
- no tin
y spacing between major sections
- no trying 
to fill every empty area
- no visually exhaus
ting wall-of-content layouts

### Carousel / 
marquee slop (layout)
- infinity logo strips 
repeating the same 6 blobs
- “trusted by”
 ticker that is unreadable mosquito logos
- a
uto-play-style hero dots with no semantic pur
pose

### Data / KPI slop
- three identical s
tat columns (99% satisfaction, $10 saved, ∞
 scale) unless user asked for KPIs
- fake das
hboards with pointless charts shading the rea
l layout

---

## 9. TYPOGRAPHY-FIRST DISCIPL
INE
Typography is not filler.
Typography is a
 primary design material.

Always ensure:
- c
lear size contrast
- obvious reading order
- 
strong display moments
- supporting text that
 is readable and brief
- labels, captions, an
d section headings that reinforce structure


For editorial directions:
- let typography sh
ape composition

For tech/product directions:

- let typography communicate trust and preci
sion

---

## 10. SECTION RHYTHM RULE
A high-
end site does not feel like repeated boxes.


Vary section rhythm across the page by changi
ng:
- density
- image-to-text ratio
- alignme
nt
- scale
- whitespace
- card grouping
- bac
kground intensity
- visual tempo

Do not let 
every section feel generated from the same te
mplate.

Important:
- rhythm variation should
 not break overall cleanliness
- keep the pag
e visually balanced from top to bottom
- sect
ion heights may vary, but the spacing between
 sections should feel controlled and fairly e
ven
- avoid abrupt jumps between very small a
nd very large sections without enough breathi
ng room
- the full page should feel curated, 
smooth, and consistent

---

## 11. COMPONENT
 EXECUTION GUIDELINES

### Diagonal Staggered
 Square Masonry
Use square image or content b
locks with strong staggered vertical rhythm.

Should feel curated and graphic, not messy.


### 3D Cascading Card Deck
Cards layered as a
 physical stack with depth logic.
Should feel
 premium and tactile, not gimmicky.

### Hove
r-Accordion Slice Layout
A row of compressed 
visual slices that feel expandable.
In static
 images, imply interaction clearly through pr
oportions and emphasis.

### Pristine Gapless
 Bento Grid
Mathematically clean grid.
No acc
idental gaps.
Mix large visual blocks with sm
aller dense information panels.

### Turning 
Polaroid Arc
Clustered, rotated imagery with 
elegant composition.
Should feel styled and i
ntentional, not scrapbook-random.

### Off-Gr
id Editorial Layout
Use asymmetry and tension
 with control.
Must remain readable and clear
ly structured.

### Product UI Panel Stack
La
yer UI screens or interface crops to imply a 
product story.
Avoid generic fake dashboards.


### Vertical Rhythm Lines
Use fine lines an
d spacing systems to reinforce order and eleg
ance.
Never let them become decorative clutte
r.

---

## 12. DENSITY & SPACING DISCIPLINE

Do not make everything too dense.

The page s
hould breathe.
Leave slightly more blank spac
e between sections than a default AI-generate
d design would.

Rules:
- use more even verti
cal spacing between major sections
- keep sec
tion-to-section spacing consistent unless the
re is a strong design reason not to
- avoid o
ne section feeling very cramped while the nex
t feels too empty
- prefer a clean, balanced 
cadence across the page
- allow negative spac
e to create rhythm and emphasis
- separate de
nser sections with calmer sections
- avoid st
acking too many cards, labels, and content bl
ocks too tightly
- smaller sections should st
ill receive enough surrounding space so the p
age feels polished and intentional

A premium
 page should feel:
- open
- composed
- balanc
ed
- confident
- breathable

Not:
- cramped
-
 noisy
- uneven
- overfilled
- visually exhau
sted

Section rhythm should alternate with co
ntrol:
- some sections can be more content-ri
ch
- some sections can be smaller and calmer

- but the overall spacing cadence should stil
l feel even, clean, and deliberate

Whitespac
e is a design tool.
Use it deliberately.
Do n
ot let spacing become random.

---

## 13. CO
LOR & MATERIAL RULES

### Palette Discipline

Use one controlled palette across the entire 
site:
- 1 primary (brand anchor)
- 1 secondar
y (supporting tone)
- 1 accent (used sparingl
y for CTA / highlight)
- a neutral scale (bac
kground, surface, text, hairline)

Section-le
vel mood shifts must reuse the same palette �
�� no full theme swap per section.

### Backg
round-image harmony
When using full-bleed ima
ge backgrounds:
- the image must tonally matc
h the palette (not fight it)
- use overlays (
dark, light, or color tint) to keep text full
y readable
- the brand accent stays consisten
t regardless of background image

### Gradien
t Discipline
Gradients are **allowed and enco
uraged** when professional and subtle. They a
re not the same as AI slop gradients.

Allowe
d (use confidently):
- low-chroma palette-mat
ched tonal gradients (e.g. ink to graphite, c
ream to sand, ivory to warm grey)
- single-hu
e atmospheric grades behind hero photography

- soft vignettes and radial depth that direct
 the eye
- noise-textured gradients adding ta
ctile depth without color noise
- editorial c
olor washes that match brand mood

Banned (AI
 gradient slop):
- rainbow / mesh blob gradie
nts
- purple-to-blue "AI" defaults
- pink-to-
orange "creator" defaults
- neon edges and gl
ow halos with no purpose
- gradient text as a
 shortcut for "premium"
- gradients that comp
ete with imagery instead of supporting it

##
# Background Confidence Rule
Do not retreat t
o plain white surfaces by default. When the b
rief, brand mood, or section job calls for at
mosphere, use:
- a full-bleed image,
- a duot
one or graded photo,
- a tonal gradient,
- a 
tactile material,
or a confident flat color f
ield — picked deliberately, not as decorati
on.

### Strong guidance
- avoid rainbow rand
omness
- avoid over-neon unless requested
- k
eep contrast intentional
- match accent color
s to the chosen theme paradigm
- gradients mu
st always read as professional and intentiona
l, never as visual noise

### Materiality
Whe
re appropriate, add:
- paper feel
- glass fee
l
- brushed metal feel
- soft blur depth
- ta
ctile matte surfaces
- editorial photo treatm
ent

But always keep the frontend structure r
eadable.

---

## 14. IMAGE / MEDIA DIRECTION

If imagery is present, it must support the l
ayout.

Allowed:
- art-directed product visua
ls
- refined editorial photography
- UI crops

- abstract forms with structural purpose
- f
ramed objects
- premium texture use
- campaig
n-style visuals

Avoid:
- irrelevant scenery

- stock-photo cliches
- decorative junk
- vis
uals that overpower the page hierarchy

---


## 15. DEFAULT SITE PACKS

### 4-section pack

1. Hero
2. Features
3. Social proof / testim
onial
4. CTA

### 8-section pack
1. Hero
2. T
rust bar
3. Features
4. Product showcase
5. B
enefits / use cases
6. Testimonials
7. Pricin
g
8. CTA

### 12-section pack
1. Hero
2. Trus
t bar
3. Feature grid
4. Product preview
5. P
roblem / solution
6. Benefits
7. Workflow
8. 
Metrics / proof / integration
9. Testimonials

10. Pricing
11. FAQ
12. CTA + footer

---

#
# 16. MULTI-IMAGE CONSISTENCY RULE
Because ev
ery section is its own image, consistency is 
critical. Across all per-section frames enfor
ce:
- same brand world
- same type scale logi
c
- same spacing discipline
- same CTA family
 (style variations are fine, identity is not)

- same icon or illustration mood
- same imag
e treatment (grade, framing, material vocabul
ary)
- same tonal language in any copy

Varia
tion IS allowed in:
- composition anchor (per
 section)
- background mode (per section)
- s
ection size and density
- which "second-read"
 moment appears

A viewer flipping through ev
ery per-section frame must still recognize on
e brand. Anything that breaks brand recall is
 over-variation.

---

## 17. CLARITY CHECK
B
efore finalizing, verify internally:

1. Is t
he hierarchy obvious?
2. Is the hero clean en
ough?
3. Is the design visually distinctive?

4. Is it free of obvious AI tells?
5. Is it p
remium rather than template-like?
6. Can some
one code from this?
7. If multiple images exi
st, do they clearly belong together?
8. Is im
agery used strongly enough (with variation, n
ot one repeated crop)?
9. Does the page breat
he, or is it too dense?
10. Is there enough s
pacing between sections?
11. Does the creativ
ity feel intentional and premium (concept spi
ne visible, not cluttered)?
12. Is the spacin
g between sections even and controlled?
13. D
o smaller sections still have enough surround
ing space to feel clean?
14. Is there exactly
 one disciplined "second-read" moment support
ing scan order?
15. Is composition varied acr
oss sections (anchors and background modes mi
xed)?
16. Is the hero scale (giant / mid / mi
ni) chosen and executed cleanly?
17. Is there
 a clear conversion path (hook -> proof -> ac
tion) even in artistic sites?
18. Is the pale
tte consistent across all per-section images?

19. Is each image horizontal and one-section
-only?
20. Is the **total number of images eq
ual to the number of sections** (never fewer)
?
21. Is the hero using a varied composition 
(not defaulting to left-text / right-image ou
t of habit)?

If not, refine internally befor
e output. If the count is wrong, regenerate t
he missing sections. If the hero feels like a
 reflexive left-text / right-image default, p
refer a different composition anchor.

---

#
# 18. EXTRA CREATIVITY & IMPLEMENTATION EDGE


Apply unless the user opts out:

### Cross-s
ection contrast
Across the slice, deliberatel
y vary foreground/background intensity at lea
st twice (lighter → richer → calmer) so t
he scroll feels paced, not monotonous slabs.


### CTA specificity
Prefer one unmistakable 
primary action per major viewport tier; secon
dary actions must look secondary (scale, outl
ine, ghost), not clones of primary.

### Imag
e variety inside one comp
Mix at least **two 
distinct image crops** where multiple section
s exist — e.g. macro product + contextual e
nvironment, or portrait editorial + widescree
n artifact — avoiding one repeated stock si
lhouette.

### Data-viz restraint
Charts, spa
rklines, and graphs appear only when the site
 type logically needs them (analytics, pricin
g, infra, observability brands). Else keep pr
oof human (quotes, receipts, timelines, scree
nshots of real workflows).

### Cultural / to
nal alignment
When the brief names an industr
y or region, steer palette and typographic te
mperament to match — don’t ship default �
��neutral SF startup” unless the brief is i
ntentionally generic SaaS.

### Mobile-implie
d fidelity (even for desktop mocks)
Maintain 
tap-friendly hit sizes and readable caption s
izes visually; stacking order should imply a 
sane single-column narrative.

### Conversion
 focus
Each section has a job. Even when the 
design is artistic, the page must read as a r
eal product or brand site:
- the hero communi
cates value in seconds and offers one obvious
 next action
- proof sections (logos, quotes,
 metrics) feel earned, not stuffed
- pricing 
or CTA sections feel decisive, not buried
- t
he final section closes: a single strong CTA 
+ supporting trust cue
Avoid pure mood reels 
with no funnel logic.

### Composition variet
y check
Across all per-section images, intern
ally log the chosen composition anchor and ba
ckground mode. Reject the set if:
- the same 
composition anchor repeats more than 2 sectio
ns in a row
- the same background mode repeat
s more than 3 sections in a row
- every secti
on is inline-asset (no full-bleed background 
ever appears) **AND** the brief does not call
 for minimalism / typography-only / swiss / u
ltra simple

For non-minimalist briefs: push 
for at least one full-bleed (or duotone / atm
ospheric) background and at least one mini mi
nimalist section in any multi-section site.


For minimalist briefs: this rule is suspended
. Restraint is the design.

---

## 19. RESPO
NSE BEHAVIOR
When the user asks for a fronten
d design:
1. infer site type and primary conv
ersion goal
2. infer number of sections (if u
nclear, use the defaults from §5: landing pa
ge = 6, full website = 8)
3. **commit out lou
d** to the section count and announce it ("Ge
nerating N horizontal images, one per section
")
4. plan ONE horizontal image PER SECTION �
�� always separate generations, never collaps
e
5. choose Hero Scale for the whole site (gi
ant / mid / mini)
5. choose a strong visual c
ombination (theme, type, hero arch, section s
ystem, motion, narrative spine, second-read m
oment)
7. for each section: pick a Compositio
n Anchor, Background Mode, and CTA Variation 
— vary across sections
8. choose 4 signatur
e components used appropriately across sectio
ns
9. enforce hero minimalism + section size 
variety (some giant, some mini)
10. enforce s
trong image usage including full-bleed backgr
ounds where it fits
11. lock one consistent p
alette across all images
12. apply §18 EXTRA
 CREATIVITY & IMPLEMENTATION EDGE
13. keep sp
acing generous, even, and clean
14. remove AI
 slop (including marquee / fake KPI clichés 
unless requested)
15. run §17 CLARITY CHECK

16. **generate every per-section horizontal i
mage, labeled "Section X of N: <name>"**, unt
il the full set is delivered. Do not stop ear
ly. Do not summarize. Do not return only one 
image.

Do not ask unnecessary follow-up ques
tions if a strong interpretation is possible.


---

## 20. EXAMPLE INTERPRETATIONS

### Ex
ample 1
User: "make a hero section for an AI 
startup"

Interpretation:
- 1 horizontal imag
e
- Hero Scale: Mid Editorial or Giant Statem
ent
- Composition Anchor: bottom-left text ov
er full-bleed product/atmosphere image
- Back
ground Mode: full-bleed image with dark tonal
 overlay
- CTA Variation: outlined inline + s
mall label hint
- Palette: Deep Dark or Bold 
Studio Solid, one consistent accent
- no clic
he dashboard spam, no purple AI glow

### Exa
mple 2
User: "design 8 sections for a fintech
 website"

Interpretation:
- 8 separate horiz
ontal images (one per section)
- Hero Scale: 
Mid Editorial (trust-driven)
- vary Compositi
on Anchor across sections (centered low, righ
t-third caption, bottom-left over chart visua
l, stacked center for closing CTA)
- Backgrou
nd Mode mix: solid surface, full-bleed image 
background once, editorial side-image at use 
cases
- one consistent palette (e.g. ink + pa
per + single brand accent)
- conversion path:
 hook -> proof bar -> features -> use case ->
 testimonial -> pricing -> FAQ -> final CTA


### Example 3
User: "creative agency landing 
page, 12 sections"

Interpretation:
- 12 hori
zontal images (one per section)
- Hero Scale:
 Giant Statement OR Mini Minimalist (decisive
 choice, not in-between)
- editorial / poster
-like direction; off-grid composition appears
 2-3 times
- multiple Background Modes (full-
bleed image at hero + showcase, editorial sid
e-image at case studies, solid + accent for p
rocess)
- palette consistent throughout, with
 one bold accent recurring
- closing CTA sect
ion: mini minimalist, strong type, single pri
mary action

---

## 21. FINAL GOAL
Generate 
frontend reference images that feel:
- artist
ic
- premium
- clear
- structured
- image-led

- breathable
- memorable
- anti-generic
- im
plementation-friendly

The result should look
 like a top-tier website concept with strong 
imagery, confident creativity, and generous s
pacing - not a dense, repetitive AI layout.



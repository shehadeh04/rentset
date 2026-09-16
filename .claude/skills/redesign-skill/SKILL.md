---
name: redesign-existing-projects
descript
ion: Upgrades existing websites and apps to p
remium quality. Audits current design, identi
fies generic AI patterns, and applies high-en
d design standards without breaking functiona
lity. Works with any CSS framework or vanilla
 CSS.
---

# Redesign Skill

## How This Work
s

When applied to an existing project, follo
w this sequence:

1. **Scan** — Read the co
debase. Identify the framework, styling metho
d (Tailwind, vanilla CSS, styled-components, 
etc.), and current design patterns.
2. **Diag
nose** — Run through the audit below. List 
every generic pattern, weak point, and missin
g state you find.
3. **Fix** — Apply target
ed upgrades working with the existing stack. 
Do not rewrite from scratch. Improve what's t
here.

## Design Audit

### Typography

Check
 for these problems and fix them:

- **Browse
r default fonts or Inter everywhere.** Replac
e with a font that has character. Good option
s: `Geist`, `Outfit`, `Cabinet Grotesk`, `Sat
oshi`. For editorial/creative projects, pair 
a serif header with a sans-serif body.
- **He
adlines lack presence.** Increase size for di
splay text, tighten letter-spacing, reduce li
ne-height. Headlines should feel heavy and in
tentional.
- **Body text too wide.** Limit pa
ragraph width to roughly 65 characters. Incre
ase line-height for readability.
- **Only Reg
ular (400) and Bold (700) weights used.** Int
roduce Medium (500) and SemiBold (600) for mo
re subtle hierarchy.
- **Numbers in proportio
nal font.** Use a monospace font or enable ta
bular figures (`font-variant-numeric: tabular
-nums`) for data-heavy interfaces.
- **Missin
g letter-spacing adjustments.** Use negative 
tracking for large headers, positive tracking
 for small caps or labels.
- **All-caps subhe
aders everywhere.** Try lowercase italics, se
ntence case, or small-caps instead.
- **Orpha
ned words.** Single words sitting alone on th
e last line. Fix with `text-wrap: balance` or
 `text-wrap: pretty`.

### Color and Surfaces


- **Pure `#000000` background.** Replace wi
th off-black, dark charcoal, or tinted dark (
`#0a0a0a`, `#121212`, or a dark navy).
- **Ov
ersaturated accent colors.** Keep saturation 
below 80%. Desaturate accents so they blend w
ith neutrals instead of screaming.
- **More t
han one accent color.** Pick one. Remove the 
rest. Consistency beats variety.
- **Mixing w
arm and cool grays.** Stick to one gray famil
y. Tint all grays with a consistent hue (warm
 or cool, not both).
- **Purple/blue "AI grad
ient" aesthetic.** This is the most common AI
 design fingerprint. Replace with neutral bas
es and a single, considered accent.
- **Gener
ic `box-shadow`.** Tint shadows to match the 
background hue. Use colored shadows (e.g., da
rk blue shadow on a blue background) instead 
of pure black at low opacity.
- **Flat design
 with zero texture.** Add subtle noise, grain
, or micro-patterns to backgrounds. Pure flat
 vectors feel sterile.
- **Perfectly even gra
dients.** Break the uniformity with radial gr
adients, noise overlays, or mesh gradients in
stead of standard linear 45-degree fades.
- *
*Inconsistent lighting direction.** Audit all
 shadows to ensure they suggest a single, con
sistent light source.
- **Random dark section
s in a light mode page (or vice versa).** A s
ingle dark-background section breaking an oth
erwise light page looks like a copy-paste acc
ident. Either commit to a full dark mode or k
eep a consistent background tone throughout. 
If contrast is needed, use a slightly darker 
shade of the same palette — not a sudden ju
mp to `#111` in the middle of a cream page.
-
 **Empty, flat sections with no visual depth.
** Sections that are just text on a plain bac
kground feel unfinished. Add high-quality bac
kground imagery (blurred, overlaid, or masked
), subtle patterns, or ambient gradients. Use
 reliable placeholder sources like `https://p
icsum.photos/seed/{name}/1920/1080` when real
 assets are not available. Experiment with ba
ckground images behind hero sections, feature
 blocks, or CTAs — even a subtle full-width
 photo at low opacity adds presence.

### Lay
out

- **Everything centered and symmetrical.
** Break symmetry with offset margins, mixed 
aspect ratios, or left-aligned headers over c
entered content.
- **Three equal card columns
 as feature row.** This is the most generic A
I layout. Replace with a 2-column zig-zag, as
ymmetric grid, horizontal scroll, or masonry 
layout.
- **Using `height: 100vh` for full-sc
reen sections.** Replace with `min-height: 10
0dvh` to prevent layout jumping on mobile bro
wsers (iOS Safari viewport bug).
- **Complex 
flexbox percentage math.** Replace with CSS G
rid for reliable multi-column structures.
- *
*No max-width container.** Add a container co
nstraint (around 1200-1440px) with auto margi
ns so content doesn't stretch edge-to-edge on
 wide screens.
- **Cards of equal height forc
ed by flexbox.** Allow variable heights or us
e masonry when content varies in length.
- **
Uniform border-radius on everything.** Vary t
he radius: tighter on inner elements, softer 
on containers.
- **No overlap or depth.** Ele
ments sit flat next to each other. Use negati
ve margins to create layering and visual dept
h.
- **Symmetrical vertical padding.** Top an
d bottom padding are always identical. Adjust
 optically — bottom padding often needs to 
be slightly larger.
- **Dashboard always has 
a left sidebar.** Try top navigation, a float
ing command menu, or a collapsible panel inst
ead.
- **Missing whitespace.** Double the spa
cing. Let the design breathe. Dense layouts w
ork for data dashboards, not for marketing pa
ges.
- **Buttons not bottom-aligned in card g
roups.** When cards have different content le
ngths, CTAs end up at random heights. Pin but
tons to the bottom of each card so they form 
a clean horizontal line regardless of content
 above.
- **Feature lists starting at differe
nt vertical positions.** In pricing tables or
 comparison cards, the list of features shoul
d start at the same Y position across all col
umns. Use consistent spacing above the list o
r fixed-height title/price blocks.
- **Incons
istent vertical rhythm in side-by-side elemen
ts.** When placing cards, columns, or panels 
next to each other, align shared elements (ti
tles, descriptions, prices, buttons) across a
ll items. Misaligned baselines make the layou
t look broken.
- **Mathematical alignment tha
t looks optically wrong.** Centering by the m
ath doesn't always look centered to the eye. 
Icons next to text, play buttons in circles, 
or text in buttons often need 1-2px optical a
djustments to feel right.

### Interactivity 
and States

- **No hover states on buttons.**
 Add background shift, slight scale, or trans
late on hover.
- **No active/pressed feedback
.** Add a subtle `scale(0.98)` or `translateY
(1px)` on press to simulate a physical click.

- **Instant transitions with zero duration.*
* Add smooth transitions (200-300ms) to all i
nteractive elements.
- **Missing focus ring.*
* Ensure visible focus indicators for keyboar
d navigation. This is an accessibility requir
ement, not optional.
- **No loading states.**
 Replace generic circular spinners with skele
ton loaders that match the layout shape.
- **
No empty states.** An empty dashboard showing
 nothing is a missed opportunity. Design a co
mposed "getting started" view.
- **No error s
tates.** Add clear, inline error messages for
 forms. Do not use `window.alert()`.
- **Dead
 links.** Buttons that link to `#`. Either li
nk to real destinations or visually disable t
hem.
- **No indication of current page in nav
igation.** Style the active nav link differen
tly so users know where they are.
- **Scroll 
jumping.** Anchor clicks jump instantly. Add 
`scroll-behavior: smooth`.
- **Animations usi
ng `top`, `left`, `width`, `height`.** Switch
 to `transform` and `opacity` for GPU-acceler
ated, smooth animation.

### Content

- **Gen
eric names like "John Doe" or "Jane Smith".**
 Use diverse, realistic-sounding names.
- **F
ake round numbers like `99.99%`, `50%`, `$100
.00`.** Use organic, messy data: `47.2%`, `$9
9.00`, `+1 (312) 847-1928`.
- **Placeholder c
ompany names like "Acme Corp", "Nexus", "Smar
tFlow".** Invent contextual, believable brand
 names.
- **AI copywriting cliches.** Never u
se "Elevate", "Seamless", "Unleash", "Next-Ge
n", "Game-changer", "Delve", "Tapestry", or "
In the world of...". Write plain, specific la
nguage.
- **Exclamation marks in success mess
ages.** Remove them. Be confident, not loud.

- **"Oops!" error messages.** Be direct: "Con
nection failed. Please try again."
- **Passiv
e voice.** Use active voice: "We couldn't sav
e your changes" instead of "Mistakes were mad
e."
- **All blog post dates identical.** Rand
omize dates to appear real.
- **Same avatar i
mage for multiple users.** Use unique assets 
for every distinct person.
- **Lorem Ipsum.**
 Never use placeholder latin text. Write real
 draft copy.
- **Title Case On Every Header.*
* Use sentence case instead.

### Component P
atterns

- **Generic card look (border + shad
ow + white background).** Remove the border, 
or use only background color, or use only spa
cing. Cards should exist only when elevation 
communicates hierarchy.
- **Always one filled
 button + one ghost button.** Add text links 
or tertiary styles to reduce visual noise.
- 
**Pill-shaped "New" and "Beta" badges.** Try 
square badges, flags, or plain text labels.
-
 **Accordion FAQ sections.** Use a side-by-si
de list, searchable help, or inline progressi
ve disclosure.
- **3-card carousel testimonia
ls with dots.** Replace with a masonry wall, 
embedded social posts, or a single rotating q
uote.
- **Pricing table with 3 towers.** High
light the recommended tier with color and emp
hasis, not just extra height.
- **Modals for 
everything.** Use inline editing, slide-over 
panels, or expandable sections instead of pop
ups for simple actions.
- **Avatar circles ex
clusively.** Try squircles or rounded squares
 for a less generic look.
- **Light/dark togg
le always a sun/moon switch.** Use a dropdown
, system preference detection, or integrate i
t into settings.
- **Footer link farm with 4 
columns.** Simplify. Focus on main navigation
al paths and legally required links.

### Ico
nography

- **Lucide or Feather icons exclusi
vely.** These are the "default" AI icon choic
e. Use Phosphor, Heroicons, or a custom set f
or differentiation.
- **Rocketship for "Launc
h", shield for "Security".** Replace cliche m
etaphors with less obvious icons (bolt, finge
rprint, spark, vault).
- **Inconsistent strok
e widths across icons.** Audit all icons and 
standardize to one stroke weight.
- **Missing
 favicon.** Always include a branded favicon.

- **Stock "diverse team" photos.** Use real 
team photos, candid shots, or a consistent il
lustration style instead of uncanny stock ima
gery.

### Code Quality

- **Div soup.** Use 
semantic HTML: `<nav>`, `<main>`, `<article>`
, `<aside>`, `<section>`.
- **Inline styles m
ixed with CSS classes.** Move all styling to 
the project's styling system.
- **Hardcoded p
ixel widths.** Use relative units (`%`, `rem`
, `em`, `max-width`) for flexible layouts.
- 
**Missing alt text on images.** Describe imag
e content for screen readers. Never leave `al
t=""` or `alt="image"` on meaningful images.

- **Arbitrary z-index values like `9999`.** E
stablish a clean z-index scale in the theme/v
ariables.
- **Commented-out dead code.** Remo
ve all debug artifacts before shipping.
- **I
mport hallucinations.** Check that every impo
rt actually exists in `package.json` or the p
roject dependencies.
- **Missing meta tags.**
 Add proper `<title>`, `description`, `og:ima
ge`, and social sharing meta tags.

### Strat
egic Omissions (What AI Typically Forgets)

-
 **No legal links.** Add privacy policy and t
erms of service links in the footer.
- **No "
back" navigation.** Dead ends in user flows. 
Every page needs a way back.
- **No custom 40
4 page.** Design a helpful, branded "page not
 found" experience.
- **No form validation.**
 Add client-side validation for emails, requi
red fields, and format checks.
- **No "skip t
o content" link.** Essential for keyboard use
rs. Add a hidden skip-link.
- **No cookie con
sent.** If required by jurisdiction, add a co
mpliant consent banner.

## Upgrade Technique
s

When upgrading a project, pull from these 
high-impact techniques to replace generic pat
terns:

### Typography Upgrades
- **Variable 
font animation.** Interpolate weight or width
 on scroll or hover for text that feels alive
.
- **Outlined-to-fill transitions.** Text st
arts as a stroke outline and fills with color
 on scroll entry or interaction.
- **Text mas
k reveals.** Large typography acting as a win
dow to video or animated imagery behind it.


### Layout Upgrades
- **Broken grid / asymmet
ry.** Elements that deliberately ignore colum
n structure — overlapping, bleeding off-scr
een, or offset with calculated randomness.
- 
**Whitespace maximization.** Aggressive use o
f negative space to force focus on a single e
lement.
- **Parallax card stacks.** Sections 
that stick and physically stack over each oth
er during scroll.
- **Split-screen scroll.** 
Two halves of the screen sliding in opposite 
directions.

### Motion Upgrades
- **Smooth s
croll with inertia.** Decouple scrolling from
 browser defaults for a heavier, cinematic fe
el.
- **Staggered entry.** Elements cascade i
n with slight delays, combining Y-axis transl
ation with opacity fade. Never mount everythi
ng at once.
- **Spring physics.** Replace lin
ear easing with spring-based motion for a nat
ural, weighty feel on all interactive element
s.
- **Scroll-driven reveals.** Content enter
ing through expanding masks, wipes, or draw-o
n SVG paths tied to scroll progress.

### Sur
face Upgrades
- **True glassmorphism.** Go be
yond `backdrop-filter: blur`. Add a 1px inner
 border and a subtle inner shadow to simulate
 edge refraction.
- **Spotlight borders.** Ca
rd borders that illuminate dynamically under 
the cursor.
- **Grain and noise overlays.** A
 fixed, pointer-events-none overlay with subt
le noise to break digital flatness.
- **Color
ed, tinted shadows.** Shadows that carry the 
hue of the background rather than using gener
ic black.

## Fix Priority

Apply changes in 
this order for maximum visual impact with min
imum risk:

1. **Font swap** — biggest inst
ant improvement, lowest risk
2. **Color palet
te cleanup** — remove clashing or oversatur
ated colors
3. **Hover and active states** �
� makes the interface feel alive
4. **Layout 
and spacing** — proper grid, max-width, con
sistent padding
5. **Replace generic componen
ts** — swap cliche patterns for modern alte
rnatives
6. **Add loading, empty, and error s
tates** — makes it feel finished
7. **Polis
h typography scale and spacing** — the prem
ium final touch

## Rules

- Work with the ex
isting tech stack. Do not migrate frameworks 
or styling libraries.
- Do not break existing
 functionality. Test after every change.
- Be
fore importing any new library, check the pro
ject's dependency file first.
- If the projec
t uses Tailwind, check the version (v3 vs v4)
 before modifying config.
- If the project ha
s no framework, use vanilla CSS.
- Keep chang
es reviewable and focused. Small, targeted im
provements over big rewrites.



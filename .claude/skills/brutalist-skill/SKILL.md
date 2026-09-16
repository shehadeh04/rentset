---
name: industrial-brutalist-ui
description
: Raw mechanical interfaces fusing Swiss typo
graphic print with military terminal aestheti
cs. Rigid grids, extreme type scale contrast,
 utilitarian color, analog degradation effect
s. For data-heavy dashboards, portfolios, or 
editorial sites that need to feel like declas
sified blueprints.
---

# SKILL: Industrial B
rutalism & Tactical Telemetry UI

## 1. Skill
 Meta
**Name:** Industrial Brutalism & Tactic
al Telemetry Interface Engineering
**Descript
ion:** Advanced proficiency in architecting w
eb interfaces that synthesize mid-century Swi
ss Typographic design, industrial manufacturi
ng manuals, and retro-futuristic aerospace/mi
litary terminal interfaces. This discipline r
equires absolute mastery over rigid modular g
rids, extreme typographic scale contrast, pur
ely utilitarian color palettes, and the progr
ammatic simulation of analog degradation (hal
ftones, CRT scanlines, bitmap dithering). The
 objective is to construct digital environmen
ts that project raw functionality, mechanical
 precision, and high data density, deliberate
ly discarding conventional consumer UI patter
ns.

## 2. Visual Archetypes
The design syste
m operates by merging two distinct but highly
 compatible visual paradigms. **Pick ONE per 
project and commit to it. Do not alternate or
 mix both modes within the same interface.**


### 2.1 Swiss Industrial Print
Derived from 
1960s corporate identity systems and heavy ma
chinery blueprints.
*   **Characteristics:** 
High-contrast light modes (newsprint/off-whit
e substrates). Reliance on monolithic, heavy 
sans-serif typography. Unforgiving structural
 grids outlined by visible dividing lines. Ag
gressive, asymmetric use of negative space pu
nctuated by oversized, viewport-bleeding nume
rals or letterforms. Heavy use of primary red
 as an alert/accent color.

### 2.2 Tactical 
Telemetry & CRT Terminal
Derived from classif
ied military databases, legacy mainframes, an
d aerospace Heads-Up Displays (HUDs).
*   **C
haracteristics:** Dark mode exclusivity. High
-density tabular data presentation. Absolute 
dominance of monospaced typography. Integrati
on of technical framing devices (ASCII bracke
ts, crosshairs). Application of simulated har
dware limitations (phosphor glow, scanlines, 
low bit-depth rendering).

## 3. Typographic 
Architecture
Typography is the primary struct
ural and decorative infrastructure. Imagery i
s secondary. The system demands extreme varia
nce in scale, weight, and spacing.

### 3.1 M
acro-Typography (Structural Headers)
*   **Cl
assification:** Neo-Grotesque / Heavy Sans-Se
rif.
*   **Optimal Web Fonts:** Neue Haas Gro
tesk (Black), Inter (Extra Bold/Black), Archi
vo Black, Roboto Flex (Heavy), Monument Exten
ded.
*   **Implementation Parameters:**
    *
   **Scale:** Deployed at massive scales usin
g fluid typography (e.g., `clamp(4rem, 10vw, 
15rem)`).
    *   **Tracking (Letter-spacing)
:** Extremely tight, often negative (`-0.03em
` to `-0.06em`), forcing glyphs to form solid
 architectural blocks.
    *   **Leading (Lin
e-height):** Highly compressed (`0.85` to `0.
95`).
    *   **Casing:** Exclusively upperca
se for structural impact.

### 3.2 Micro-Typo
graphy (Data & Telemetry)
*   **Classificatio
n:** Monospace / Technical Sans.
*   **Optima
l Web Fonts:** JetBrains Mono, IBM Plex Mono,
 Space Mono, VT323, Courier Prime.
*   **Impl
ementation Parameters:**
    *   **Scale:** F
ixed and small (`10px` to `14px` / `0.7rem` t
o `0.875rem`).
    *   **Tracking:** Generous
 (`0.05em` to `0.1em`) to simulate mechanical
 typewriter spacing or terminal matrices.
   
 *   **Leading:** Standard to tight (`1.2` to
 `1.4`).
    *   **Casing:** Exclusively uppe
rcase. Used for all metadata, navigation, uni
t IDs, and coordinates.

### 3.3 Textural Con
trast (Artistic Disruption)
*   **Classificat
ion:** High-Contrast Serif.
*   **Optimal Web
 Fonts:** Playfair Display, EB Garamond, Time
s New Roman.
*   **Implementation Parameters:
** Used exceedingly sparingly. Must be subjec
ted to heavy post-processing (halftone filter
s, 1-bit dithering) to degrade vector perfect
ion and create textural juxtaposition against
 the clean sans-serifs.

## 4. Color System
T
he color architecture is uncompromising. Grad
ients, soft drop shadows, and modern transluc
ency are strictly prohibited. Colors simulate
 physical media or primitive emissive display
s.

**CRITICAL: Choose ONE substrate palette 
per project and use it consistently. Never mi
x light and dark substrates within the same i
nterface.**

### If Swiss Industrial Print (L
ight):
*   **Background:** `#F4F4F0` or `#EAE
8E3` (Matte, unbleached documentation paper).

*   **Foreground:** `#050505` to `#111111` (
Carbon Ink).
*   **Accent:** `#E61919` or `#F
F2A2A` (Aviation/Hazard Red). This is the ONL
Y accent color. Used for strike-throughs, thi
ck structural dividing lines, or vital data h
ighlights.

### If Tactical Telemetry (Dark):

*   **Background:** `#0A0A0A` or `#121212` (
Deactivated CRT. Avoid pure `#000000`).
*   *
*Foreground:** `#EAEAEA` (White phosphor). Th
is is the primary text color.
*   **Accent:**
 `#E61919` or `#FF2A2A` (Aviation/Hazard Red)
. Same red, same rules.
*   **Terminal Green 
(`#4AF626`):** Optional. Use ONLY for a singl
e specific UI element (e.g., one status indic
ator or one data readout) — never as a gene
ral text color. If it doesn't serve a clear p
urpose, omit it entirely.

## 5. Layout and S
patial Engineering
The layout must appear mat
hematically engineered. It rejects convention
al web padding in favor of visible compartmen
talization.

*   **The Blueprint Grid:** Stri
ct adherence to CSS Grid architectures. Eleme
nts do not float; they are anchored precisely
 to grid tracks and intersections.
*   **Visi
ble Compartmentalization:** Extensive utiliza
tion of solid borders (`1px` or `2px solid`) 
to delineate distinct zones of information. H
orizontal rules (`<hr>`) frequently span the 
entire container width to segregate operation
al units.
*   **Bimodal Density:** Layouts os
cillate between extreme data density (tightly
 packed monospace metadata clustered together
) and vast expanses of calculated negative sp
ace framing macro-typography.
*   **Geometry:
** Absolute rejection of `border-radius`. All
 corners must be exactly 90 degrees to enforc
e mechanical rigidity.

## 6. UI Components a
nd Symbology
Standard web UI conventions are 
replaced with utilitarian, industrial graphic
 elements.

*   **Syntax Decoration:** Utiliz
ation of ASCII characters to frame data point
s.
    *   *Framing:* `[ DELIVERY SYSTEMS ]`,
 `< RE-IND >`
    *   *Directional:* `>>>`, `
///`, `\\\\`
*   **Industrial Markers:** Prom
inent integration of registration (`®`), cop
yright (`©`), and trademark (`™`) symbols 
functioning as structural geometric elements 
rather than legal text.
*   **Technical Asset
s:** Integration of crosshairs (`+`) at grid 
intersections, repeating vertical lines (barc
odes), thick horizontal warning stripes, and 
randomized string data (e.g., `REV 2.6`, `UNI
T / D-01`) to simulate active mechanical proc
esses.

## 7. Textural and Post-Processing Ef
fects
To prevent the design from appearing pu
rely digital, simulated analog degradation is
 engineered into the frontend via CSS and SVG
 filters.

*   **Halftone and 1-Bit Dithering
:** Transforming continuous-tone images or la
rge serif typography into dot-matrix patterns
. Achieved via pre-processing or CSS `mix-ble
nd-mode: multiply` overlays combined with SVG
 radial dot patterns.
*   **CRT Scanlines:** 
For terminal interfaces, applying a `repeatin
g-linear-gradient` to the background to simul
ate horizontal electron beam sweeps (e.g., `r
epeating-linear-gradient(0deg, transparent, t
ransparent 2px, rgba(0,0,0,0.1) 2px, rgba(0,0
,0,0.1) 4px)`).
*   **Mechanical Noise:** A g
lobal, low-opacity SVG static/noise filter ap
plied to the DOM root to introduce a unified 
physical grain across both dark and light mod
es.

## 8. Web Engineering Directives
1.  **G
rid Determinism:** Utilize `display: grid; ga
p: 1px;` with contrasting parent/child backgr
ound colors to generate mathematically perfec
t, razor-thin dividing lines without complex 
border declarations.
2.  **Semantic Rigidity:
** Construct the DOM using precise semantic t
ags (`<data>`, `<samp>`, `<kbd>`, `<output>`,
 `<dl>`) to accurately reflect the technical 
nature of the telemetry.
3.  **Typography Cla
mping:** Implement CSS `clamp()` functions ex
clusively for macro-typography to ensure mass
ive text scales aggressively while maintainin
g structural integrity across viewports.



---
version: alpha
name: MIA 2025 (Multimedia in Action)
description: A high-energy, dark-themed competition/event site with a near-black background, radial red/orange glow lighting, bold Poppins typography, and a red/orange/yellow accent system layered on dark surfaces.
colors:
  primary: "#E01C20"
  primary-dark: "#810220"
  secondary: "#571845"
  accent-orange: "#FF4500"
  accent-yellow: "#FED700"
  neutral-bg: "#151C28"
  surface: "#1E2939"
  surface-card: "#151C28" # used at 50% opacity for card backgrounds
  on-surface: "#FFF9F5"
  on-surface-muted: "#AAB1BD"
  on-surface-muted-2: "#99A1AF"
  border: "#D5D8DE" # used at low opacity on dark surfaces, exact token TBD
  success: "#00B445"
  error: "#E01C20"
typography:
  font-family: "Poppins"
  weights: [Regular, Medium, SemiBold, Bold]
  type-1: "80.00px" # display headline scale (reserved)
  type-2: "49.44px" # H1 / hero heading
  type-3: "30.56px" # H2 / section heading
  type-4: "18.89px" # body / label
  type-5: "11.67px" # caption / micro-label
spacing:
  step-1: 4px
  step-2: 8px
  step-3: 16px
  step-4: 24px
  step-5: 32px
  step-6: 64px
components:
  button-primary:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.on-surface}"
    rounded: "full"
  button-secondary-outline:
    backgroundColor: "transparent"
    textColor: "{colors.on-surface}"
    rounded: "full"
  card:
    backgroundColor: "{colors.surface-card}"
    opacity: "50%"
    textColor: "{colors.on-surface}"
    rounded: "lg"
  input:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.on-surface}"
    rounded: "lg"
---

# MIA 2025 — Design System / UI Specification

**Purpose:** This document is the single source of truth for implementing the MIA 2025 (Multimedia in Action) UI. It exists so a developer or AI coding agent can rebuild the interface as closely as possible to the reference screenshots **without improvising** colors, type, spacing, or components that are not documented here.

### Legend
Every specification below is tagged with a confidence level:
- **Observed** — directly visible and measurable (even if approximately) in the reference screenshots.
- **Inferred** — not literally visible, but a reasonable, low-risk conclusion drawn from a repeating visual pattern in the same reference (e.g. consistent 8px rhythm, consistent pill radius).
- **TBD** — cannot be determined from the reference. Do not invent a value; implementers must ask for clarification or use a neutral default consistent with the existing tokens.

### Reference Assets
- **Image 1** — Landing page (full scroll: navbar → hero → competition categories → gamification → timeline → sponsors → FAQ → closing CTA → footer).
- **Image 2** — Login page (navbar + centered login card).

---

## 1. Overview

MIA 2025 (Multimedia in Action) is a digital-competition landing experience with an **energetic, competitive, dramatic** tone. *(Observed)* The entire page sits on a **near-black background** lit by a **radial red-to-orange glow** at specific points (hero, competition-category area, timeline, closing CTA), producing a spotlight/stage effect. *(Observed)* On top of this dark base, **red (`#E01C20`)** and **orange (`#FF4500`)** are the primary accents for buttons, badges, and text emphasis, while **yellow (`#FED700`)** appears sparingly as a decorative accent (sponsor marks). *(Observed)* Typography is set in **Poppins**, mixing Bold/SemiBold for headings with Regular/Medium for supporting copy, giving the interface a modern, confident, highly-legible-on-dark character. *(Observed)*

The login page (Image 2) reuses the same visual language in a minimal form: a single dark card, centered in an otherwise empty viewport, containing a dark-UI form and a solid red primary action. *(Observed)*

> This document is built strictly from visual observation of the two provided reference images, combined with the pre-defined color tokens. Anything that cannot be confirmed from the screenshots is explicitly marked `TBD`.

---

## 2. Color System

### Violet
| Token | HEX | RGB |
|---|---|---|
| V50 | `#EEE8EC` | 238, 232, 236 |
| V75 | `#BAA0B3` | 186, 160, 179 |
| V100 | `#9E7993` | 158, 121, 147 |
| V200 | `#743F65` | 116, 63, 101 |
| V300 | `#571845` | 87, 24, 69 |
| V400 | `#3D1130` | 61, 17, 48 |
| V500 | `#350F2A` | 53, 15, 42 |

### Yellow
| Token | HEX | RGB |
|---|---|---|
| Y50 | `#FFFBE6` | 255, 251, 230 |
| Y75 | `#FFEF96` | 255, 239, 150 |
| Y100 | `#FEE86B` | 254, 232, 107 |
| Y200 | `#FEDE2B` | 254, 222, 43 |
| Y300 | `#FED700` | 254, 215, 0 |
| Y400 | `#B29700` | 178, 151, 0 |
| Y500 | `#9B8300` | 155, 131, 0 |

### Orange
| Token | HEX | RGB |
|---|---|---|
| O50 | `#FFECE6` | 255, 236, 230 |
| O75 | `#FFB396` | 255, 179, 150 |
| O100 | `#FF936B` | 255, 147, 107 |
| O200 | `#FF652B` | 255, 101, 43 |
| O300 | `#FF4500` | 255, 69, 0 |
| O400 | `#B33000` | 179, 48, 0 |
| O500 | `#9C2A00` | 156, 42, 0 |

### Red
| Token | HEX | RGB |
|---|---|---|
| R50 | `#FCE8E9` | 252, 232, 233 |
| R75 | `#F2A2A4` | 242, 162, 164 |
| R100 | `#ED7B7E` | 237, 123, 126 |
| R200 | `#E54346` | 229, 67, 70 |
| R300 | `#E01C20` | 224, 28, 32 |
| R400 | `#9D1416` | 157, 20, 22 |
| R500 | `#891114` | 137, 17, 20 |

### Foreground
| Token | HEX | RGB |
|---|---|---|
| F50 | `#F5F6F7` | 245, 246, 247 |
| F75 | `#D5D8DE` | 213, 216, 222 |
| F100 | `#C4C8D1` | 196, 200, 209 |
| F200 | `#AAB1BD` | 170, 177, 189 |
| F300 | `#99A1AF` | 153, 161, 175 |
| F400 | `#1E2939` | 30, 41, 57 |
| F500 | `#151C28` | 21, 28, 40 |

### Success
| Token | HEX | RGB |
|---|---|---|
| S50 | `#E6F8EC` | 230, 248, 236 |
| S75 | `#96E0B3` | 150, 224, 179 |
| S100 | `#6BD493` | 107, 212, 147 |
| S200 | `#2BC165` | 43, 193, 101 |
| S300 | `#00B445` | 0, 180, 69 |
| S400 | `#007E30` | 0, 126, 48 |
| S500 | `#006E2A` | 0, 110, 42 |

### Color Usage in the Reference (Observed unless noted)
| Token | Used for |
|---|---|
| F400 / F500 | Base page background (near-black), visible across every section, card, and the footer |
| R300 `#E01C20` | Primary accent — main buttons ("Daftar Sekarang", "Login"), headline word highlights, accent underlines, active links ("Daftar disini", "Reset disini") |
| O300 `#FF4500` | Secondary accent — paired with red in the gradient hero headline; used on secondary badges/labels |
| Y300 `#FED700` | Limited decorative accent — sponsor logo/diamond icon marks only |
| Off White `#FFF9F5` | Primary text color on dark surfaces (headings, body copy) |
| F200–F300 | Secondary/muted text (subheadings, card descriptions, input placeholders) |
| S300 (Success Green) | Timeline status "Selesai" (Done) |
| R300 (Error/Red) | Timeline status "Berlangsung" (In Progress); form error messages on the login page |
| F300/F400 (dark gray) | Timeline status "Akan Datang" (Upcoming) — rendered neutral/dim |
| V300 `#571845` | **TBD** — not explicitly identified in the reference; kept as a reserve token for dark decorative/accent use only. Do not introduce it into primary UI without a new reference. |

---

## 3. Primary Color Palette

| Name | HEX | Visual function in the reference |
|---|---|---|
| Dark Red | `#810220` | Dark end of the red glow/gradient behind the hero and closing CTA |
| Red | `#E01C20` | Main accent — primary buttons, badges, text highlights, active links |
| Orange | `#FF4500` | Secondary accent — combined with red in the gradient headline and badges |
| Violet | `#571845` | **TBD** — not identified in the reference; reserved token only |
| Yellow | `#FED700` | Limited decorative accent — sponsor logo marks |
| Off White | `#FFF9F5` | Primary text color on dark surfaces |

---

## 4. Gradient System

| Name | Gradient | Usage in the reference |
|---|---|---|
| Red Gradient | `#810220 → #E01C20` | *(Observed)* Radial glow behind the hero and closing-CTA sections, creating a "spotlight on near-black" effect |
| Red Soft Gradient | `#E01C20 → #FFF9F5` | *(Inferred)* Likely used on the two-tone hero headline (red word → lighter/white word); exact stops not confirmable |
| Orange/Yellow Gradient | `#FF4500 → #FED700` | *(Inferred)* Possibly present in the hero headline's red-to-orange transition; exact stops **TBD** |
| Yellow Soft Gradient | `#FFF9F5 → #FED700` | **TBD** — not identified in the reference |

> The references are static screenshots, so exact gradient angle and color stops cannot be measured. Use the table above as directional guidance (red → glowing orange/yellow at hero and CTA, fading to dark elsewhere) — do not invent new gradient combinations beyond these four.

---

## 5. Background & Glow

- **Base background:** near-black, mapped to `F500 #151C28` (page base) / `F400 #1E2939` (slightly lighter surfaces such as inputs). *(Inferred mapping; exact base value TBD but must stay within the Foreground scale.)*
- **Radial glow:** a soft red-to-dark-red radial gradient (`Red Gradient` token) is layered on top of the base background, not applied uniformly across the whole page. *(Observed)*
- **Glow color:** warm red/orange (`#810220 → #E01C20`, with a hint of `#FF4500` at the brightest points). *(Observed)*
- **Glow opacity:** appears soft/diffused rather than saturated — approx. low-to-medium opacity blended into the near-black base. Exact percentage **TBD**.
- **Glow position:** concentrated behind (a) the hero section at the top of the page, (b) the competition-category cards area, (c) the timeline section, and (d) the closing CTA section — i.e., roughly every 2–3 sections, not continuous top-to-bottom. *(Observed)*
- **Layering order (back to front):** 1) near-black base fill → 2) one or more radial red/orange glow layers positioned per-section as above → 3) foreground content (navbar, text, cards) which sits on plain near-black with no additional glow directly behind it (e.g. FAQ and sponsor sections read as flatter/darker). *(Inferred from contrast differences across sections)*
- The login page (Image 2) uses the **same glow treatment** at a lower intensity, concentrated top-left/center behind the navbar and login card, fading to solid black toward the edges and bottom of the viewport. *(Observed)*
- Do not replace the glow with a flat solid color or a hard-edged gradient — it must read as soft/diffused, consistent with the reference.

---

## 6. Typography

**Font family:** Poppins. **Weights used:** Regular, Medium, SemiBold, Bold. *(Observed — mixed weight usage between headings and body)*

| Scale | Size | Typical weight (Inferred) | Line-height | Letter-spacing | Text color | Max-width | Usage |
|---|---|---|---|---|---|---|---|
| Type 1 | 80.00px | Bold | **TBD** (Inferred ≈1.05–1.1x) | **TBD** (Inferred: normal/tight) | `on-surface` (`#FFF9F5`) | **TBD** | Reserved display scale; not clearly matched 1:1 to any heading in the current screenshots at this literal size — treat as the top of the type scale for future large-format headlines |
| Type 2 | 49.44px | Bold | **TBD** (Inferred ≈1.05–1.15x) | **TBD** (Inferred: tight/normal) | `on-surface`, with the emphasized word in `primary`/`accent-orange` | **Inferred:** constrained to a centered content column, not full viewport width | Hero headline ("Multimedia in Action") and closing-CTA headline |
| Type 3 | 30.56px | Bold/SemiBold | **TBD** (Inferred ≈1.2x) | Normal | `on-surface`, with keyword(s) in `primary` | **Inferred:** centered, line-wraps at content column width | Section headings ("Kategori Lomba Populer", "Timeline Proyek MIA 2025", "Pertanyaan yang Sering Diajukan", login card heading "Selamat Datang Kembali") |
| Type 4 | 18.89px | Regular/Medium for body, SemiBold for labels/buttons | **Inferred** ≈1.4–1.5x (generous, per section descriptions) | Normal | `on-surface-muted` for body copy; `on-surface` for labels | **Inferred:** body paragraphs are constrained to a narrower column than the section width (roughly the width of a 2–3 sentence line, centered) | Section subheadings/descriptions, card descriptions, form field labels, button labels |
| Type 5 | 11.67px | Medium/SemiBold | **TBD** | Normal, occasionally slightly wide on badges | `on-surface` on badges; `on-surface-muted`/status color on metadata | N/A (single line) | Small badges ("🔥 Kompetisi Digital Indonesia 2024"), card metadata rows (date/category/location), timeline status chips, footer copyright line |

### Observed Typography Patterns
- The hero headline mixes two colors on one line: white for most words, red/orange gradient on the emphasized word ("in Action"). *(Observed)*
- Key phrases inside body paragraphs (e.g. "Website development", "UI/UX Desain") are bolded and colored red for emphasis. *(Observed)*
- Body copy under section headings (descriptions, card text) uses Regular/Medium weight in muted gray (`F200`–`F300`) to contrast against bold white/colored headings. *(Observed)*
- Button labels use SemiBold/Bold weight, title case — the interface does not rely on uppercase styling. *(Observed)*
- Login form field labels use Medium/SemiBold in bright text; input placeholder text uses muted gray. *(Observed)*
- Error message text under form fields is small, red, Regular weight. *(Observed)*

---

## 7. Layout Foundation

- **Container / max-width:** Content is not full-bleed; it sits inside a centered column with visible dark background/glow on both sides at desktop width. *(Observed)* Exact max-width in px is **TBD** — treat as a conventional centered container (commonly 1200–1280px) and validate against a real desktop viewport before finalizing; do not assume a wider or narrower value without confirmation.
- **Page padding (left/right):** Generous side margins are visible at desktop size so the glow background remains visible around the content column. *(Observed pattern; exact px TBD — Inferred to follow the `step-5`/`step-6` spacing scale, i.e. 32px–64px+ depending on viewport.)*
- **Section spacing (vertical rhythm):** Sections are separated by large vertical gaps, visibly larger than the internal spacing used inside a card or component. *(Observed)* Inferred to use the top of the spacing scale (`step-5` 32px to `step-6` 64px, likely multiplied further between major sections, e.g. 96–128px) — exact value **TBD**.
- **Alignment:** The landing page is predominantly **center-aligned** — hero, section headings/subheadings, gamification cards, sponsor grid, and CTA are all centered on the page axis. *(Observed)* Card **internal** content (category card text/info rows, FAQ rows) is left-aligned within its container. *(Observed)* The login page card is centered both horizontally and vertically in the viewport; its internal form fields are left-aligned. *(Observed)*
- **Grid vs. stack:** Sections stack vertically in a single column (no side-by-side sections); only card groups within a section use a horizontal grid (see Section 8). *(Observed)*

---

## 8. Grid System

> All column counts below are **Observed at desktop width only**. Tablet/mobile column counts are not visible in the reference and must not be invented — see Section 12.

| Section | Desktop columns (Observed) | Gap (Inferred, 8px-scale) | Card sizing |
|---|---|---|---|
| Competition Categories ("Kategori Lomba Populer") | 2 columns | **Inferred** ≈24–32px (`step-4`–`step-5`) | Two equal-width cards; each roughly square-to-portrait with a 16:9-ish image header — exact width/height **TBD** |
| Gamification Features | 3 columns | **Inferred** ≈24–32px | Equal-width cards, shorter height (icon + title + 1–2 line description) |
| Timeline | 5 columns (5 steps observed in this instance; count reflects current content, not a fixed system limit) | **Inferred** ≈16–24px | Equal-width nodes/cards under a connecting horizontal line; card height driven by content (date, title, 2-line description, status badge) |
| Sponsors | 5 columns | **Inferred** ≈16–24px | Equal-width square-ish cards, centered icon + label, compact |
| FAQ (Accordion) | 1 column (full width rows, not a grid) | **Inferred** row gap ≈8–16px or hairline divider | Full-width rows, fixed height when collapsed, variable height when expanded |
| Footer link columns | 4 columns (brand block + Kompetisi + Informasi + Kontak) | **Inferred** ≈32px+ | Content-driven column widths, not equal-width cards |

Exact pixel gap values, card widths, and card heights are **TBD** — the counts and relative proportions above are Observed/Inferred; do not assign arbitrary fixed pixel dimensions without validating against the live reference.

---

## 9. Icon & Image System

- **Icon style:** Line/outline (stroke) icons throughout — not filled/solid glyphs. *(Observed)* Stroke weight appears thin-to-regular and consistent across contexts. *(Inferred)*
- **Icon sizing:**
  - Small (inline with metadata/labels, e.g. card info rows, badges, footer contact icons): **Inferred** ≈16px.
  - Medium (feature-card icons, timeline node icons, navbar utility icons): **Inferred** ≈20–24px.
  - Exact pixel sizes are **TBD**; use the two-tier small/medium relationship as the implementation rule rather than exact px.
- **Icon containers:** Several icons sit inside a small solid-color circular or rounded-square badge (feature-card icons, category-card info-row icons, timeline nodes). *(Observed)* Exact badge fill color per icon type (date/category/location) is **TBD** — do not assign specific colors to specific icon types without confirmation; use the semantic palette (red/orange/success/neutral) consistently instead of inventing new hues.
- **Image usage:** The competition-category cards use a dark thumbnail image (code-editor style screenshot) at the top of the card. *(Observed)*
- **Image aspect ratio:** Wide/landscape, approximating **16:9** (Inferred — not measurable precisely from the screenshot).
- **Object-fit:** Image fills the card header area edge-to-edge, consistent with `object-fit: cover`. *(Inferred)*
- **Image overlay:** No clear color overlay/tint is confirmable on top of the thumbnails — they read as naturally dark source images. **TBD** whether an intentional dark overlay is applied; do not add one unless validated.
- **Image radius:** Rounded to match the card's top corners only (the image sits flush inside the card header, not with its own independent full-corner radius). *(Inferred)*
- **Sponsor marks:** Small yellow diamond-shaped icon glyphs, centered inside a dark card, roughly square footprint. *(Observed)* Exact px size **TBD**.

---

## 10. Component Specification

### 10.1 Navbar
**Variant A — Landing page header** *(Observed, Image 1)*
- Layout: logo + wordmark (left) · horizontal nav menu (center) · account icon + username + settings icon (right).
- Height: **TBD** (Inferred, comfortable ~64–72px based on visual proportion to logo size).
- Background: transparent / same near-black base as the page (no distinct navbar panel color). *(Observed)*
- Nav items: default state is plain text in muted/white tone; the **active** item ("Beranda") is wrapped in a filled pill (dark, slightly lighter than the page background) with light text. *(Observed)*
- Item padding: **Inferred** ≈8px vertical / 16px horizontal (`step-2`/`step-3`) for the active pill.
- Item radius: full pill. *(Observed)*
- Typography: Type 4/5 scale, Medium weight. *(Inferred)*
- Right-side icons: simple line icons, circular tap targets, no visible background in default state. *(Observed)*

**Variant B — Login page header** *(Observed, Image 2)*
- Layout: logo (left) · "Kembali ke Beranda" pill button with a left-chevron icon + a circular theme-toggle icon button (right).
- "Kembali ke Beranda" button: dark filled pill, muted/white text, left-chevron icon, comfortable horizontal padding (Inferred ≈16–24px). *(Observed)*
- Theme toggle: circular icon button, moon glyph, dark fill, no visible label. *(Observed)*

### 10.2 Button
| Variant | Background | Text color | Shape/Radius | Padding (Inferred) | Typography | Icon | Example (Observed) |
|---|---|---|---|---|---|---|---|
| Primary | `R300 #E01C20` solid | `#FFF9F5` | Full pill | ≈12px vertical / 32px+ horizontal | Type 4, SemiBold/Bold | Optional trailing arrow (`→`) | "Daftar Sekarang", "Daftar Sekarang!", "Login", "Detail →" |
| Secondary / Link | Transparent, no fill | `R300` red text | No border/pill chrome — reads as a text link | Minimal/none | Type 4/5, Medium/SemiBold | Optional trailing arrow | "Lihat Guidebook", "Lihat Leaderboard →" |
| Navbar pill (active state) | Dark filled pill (lighter than base bg) | Light/white | Full pill | ≈8px / 16px | Type 4/5, Medium | None | "Beranda" |
| Header utility pill (Login page) | Dark filled pill | Muted/white | Full pill | ≈8px / 16–24px | Type 5, Medium | Leading chevron-left | "Kembali ke Beranda" |
| Login form button | `R300` solid, full width of the card | `#FFF9F5` | Rounded (pill or rounded-xl — **TBD** exact) | Full-width, ≈14–16px vertical | Type 4, SemiBold/Bold | None | "Login" |

**States:** Only the **default** visual state is confirmable from static screenshots. Hover/Active/Focus/Disabled states are **TBD** — not visible in the reference; do not invent specific hover colors or shadow effects.

### 10.3 Card
See **Section 5 (Card System token)** for the base spec, repeated here for completeness:
- Background: `#151C28` at 50% opacity. *(Given token — must be preserved exactly.)*
- Border: thin, low-opacity light border (approx. `F75`/`F100` range), visible only as a subtle edge. *(Observed)*
- Radius: medium-to-large rounding (approx. `rounded-lg`/`rounded-xl`); exact px **TBD**.
- Padding: **Inferred** ≈24–32px internal padding (`step-4`–`step-5`).
- No heavy drop shadow in the default card variant; depth comes from the semi-transparent fill against the glow background. *(Observed)*

| Variant | Structure (Observed) | Notes |
|---|---|---|
| Competition category card | Image header (top) → title (Bold) → 3 metadata rows (icon + label + value) → full-width primary button | Metadata rows use small icon badges; see Section 9 |
| Gamification feature card | Icon badge (top-left) → title (Bold) → 1–2 line muted description | No CTA inside the card itself |
| Timeline card | Date label → title (Bold) → short muted description → status badge (bottom) | Sits below a connecting timeline node/icon |
| Sponsor card | Centered yellow diamond icon → sponsor name below | Compact, square-ish footprint |
| Login card | Larger container: heading → subheading → form fields → primary button → helper links | Visibly more elevated/isolated than other cards since it stands alone in the viewport; slightly more distinct border/shadow. *(Observed)* |

### 10.4 Input
- Background: dark surface (`surface` token, `#1E2939`), distinguishable from the card/page background. *(Observed)*
- Border: thin, low-opacity. *(Observed)*
- Radius: medium rounding, consistent with cards. *(Inferred)*
- Padding: **Inferred** ≈10–14px vertical / 16px horizontal.
- Label: placed above the field, bright/white text, Medium/SemiBold. *(Observed)*
- Placeholder text: muted gray. *(Observed)*
- Leading icon: mail icon for email field, lock icon for password field. *(Observed)*
- Trailing icon: eye/eye-off toggle on the password field only. *(Observed — only the "hidden" state icon is visible; the "shown" state icon is **TBD**.)*
- Error text: small, red, Regular weight, positioned directly below the field. *(Observed — shown here as example/placeholder text ("Error message"), not a live validation state.)*

### 10.5 Badge
| Variant | Fill | Text/Icon color | Shape | Usage (Observed) |
|---|---|---|---|---|
| Section eyebrow badge | Dark, semi-transparent pill | White/light text, may include an emoji/icon | Full pill | "🔥 Kompetisi Digital Indonesia 2024", "Fitur Gamifikasi & Leaderboard", "Partner Kami", "Mulai Berkompetisi" |
| Status: Done | Green (`S300`) fill or text | Light/white or green-on-dark | Small pill | "Selesai" |
| Status: In Progress | Red/orange (`R300`/`O300`) fill or text | Light/white | Small pill | "Berlangsung" |
| Status: Upcoming | Dark gray (`F300`/`F400`) | Muted | Small pill | "Akan Datang" |

Exact fill-vs-text color application (solid fill vs. colored text on dark fill) is **Inferred** from contrast in the screenshot, not pixel-measured — implementers should treat the semantic color (green/red/gray) as the confirmed part and the exact fill technique as approximate.

### 10.6 Timeline
- Structure: a horizontal connecting line with circular icon nodes placed along it; a detail card sits below each node. *(Observed)*
- Node states: **Done** (green fill/icon), **In Progress** (red/orange fill, appears to have an additional ring/highlight around it), **Upcoming** (dim gray/dark fill). *(Observed)*
- Node size: **Inferred** ≈32–40px diameter.
- Connecting line: thin horizontal line spanning between node centers. *(Observed)*
- Card below each node: date, title, short description, status badge — see Section 10.3. *(Observed)*
- A trailing hint element ("Scroll untuk melihat timeline lengkap …") with a horizontal-dots icon suggests horizontal overflow/scroll behavior for additional steps. *(Observed)* Exact scroll mechanics (drag, arrow buttons, snap) are **TBD**.

### 10.7 Accordion (FAQ)
- Rows are full-width, stacked vertically, dark background matching the surrounding section. *(Observed)*
- Each row: question text (left, white) + chevron icon (right). *(Observed)*
- One row is shown in an **expanded** state with a muted-color answer paragraph displayed beneath the question. *(Observed)*
- Row separation: either a hairline divider or consistent vertical gap between rows — exact technique **TBD**, spacing **Inferred** to follow the 8px scale.
- Row height (collapsed): **Inferred** ≈48–64px based on text + padding.

### 10.8 Footer
- Background: the darkest surface on the page, distinct from the rest of the near-black body. *(Observed)*
- Layout: brand block (logo + short description + social icons) on the left; three link columns ("Kompetisi", "Informasi", "Kontak") to the right. *(Observed)*
- Link column headers: white/bright, Bold or SemiBold. *(Observed)*
- Link items: muted gray text. *(Observed)*
- Contact rows include small line icons (phone/WhatsApp, etc.) preceding the text. *(Observed)*
- A horizontal divider separates the link/brand area from a final copyright line at the very bottom. *(Observed)*
- Social icons: small circular icon buttons. *(Observed)*

---

## 11. Component States

| Component | Default | Hover | Active | Focus | Disabled | Error |
|---|---|---|---|---|---|---|
| Primary button | Red fill, white text *(Observed)* | **TBD** | **TBD** | **TBD** | **TBD** | N/A |
| Nav item | Plain text (inactive) / filled pill (active) *(Observed)* | **TBD** | Filled pill, as seen on "Beranda" *(Observed)* | **TBD** | N/A | N/A |
| Input field | Dark fill, muted placeholder *(Observed)* | **TBD** | **TBD** | **TBD** | **TBD** | Red helper text below field *(Observed, shown as example copy)* |
| Password field | Trailing "hidden" eye icon *(Observed)* | **TBD** | **TBD** (toggled/"shown" icon **TBD**) | **TBD** | **TBD** | Same as Input field |
| Accordion row | Collapsed, chevron pointing down *(Observed)* | **TBD** | Expanded, answer text visible, one example shown open *(Observed)* | **TBD** | N/A | N/A |
| Timeline node | Three distinct states exist by content status: Done (green), In Progress (red/orange + ring highlight), Upcoming (dim gray) *(Observed)* | **TBD** | Same as "In Progress" visual treatment for the current step *(Inferred)* | N/A | N/A | N/A |
| Link (helper links on login) | Red bold text on muted sentence *(Observed)* | **TBD** | **TBD** | **TBD** | N/A | N/A |

Do not fabricate hover/focus/disabled visuals beyond what a token-consistent, low-risk assumption would produce (e.g. a slight opacity or brightness shift using existing tokens) — flag any such addition clearly as an implementation default, not a confirmed spec.

---

## 12. Responsive Behavior

Both references are **desktop, full-width screenshots**. No tablet or mobile breakpoint is visible in either image, so the table below marks everything beyond desktop as **TBD**. Do not invent specific mobile breakpoints, stacked-grid column counts, or resized typography — these must be confirmed against additional references before implementation.

| Aspect | Desktop (Observed) | Tablet | Mobile |
|---|---|---|---|
| Container | Centered column with visible side margins/glow | **TBD** | **TBD** |
| Grid (category/feature/sponsor cards) | 2 / 3 / 5 columns respectively (see Section 8) | **TBD** — Inferred to reduce column count, but exact counts not confirmable | **TBD** — Inferred to stack to 1 column, but not confirmable |
| Navbar | Full horizontal menu, logo + center menu + right icons | **TBD** | **TBD** — no hamburger/mobile-menu pattern is visible in the reference to confirm |
| Card | Fixed-proportion, side-by-side in a row | **TBD** | **TBD** |
| Typography | Type 1–5 scale as documented in Section 6 | **TBD** | **TBD** |
| Button | Auto-width pill (inline) or full-width (login form) | **TBD** | **TBD** |
| Timeline | Horizontal row of 5 steps with a "scroll for more" hint | **TBD** — the scroll hint suggests horizontal scroll may already be the mobile-friendly pattern even at desktop, but this is not confirmed | **TBD** |
| Footer | 4-column layout (brand + 3 link groups) | **TBD** | **TBD** — Inferred to stack vertically, not confirmable |

---

## 13. Visual Hierarchy & Content Constraints

- **Priority order (top to bottom of visual weight):** eyebrow badge → large two-tone headline (Type 2) → supporting subheading → descriptive paragraph with bold keyword emphasis → primary CTA button → secondary/link CTA. *(Observed, repeated in both the hero and the closing-CTA sections.)*
- **Heading max-width:** Headlines and section titles are centered and appear constrained to a comfortable reading column rather than spanning the full container width — exact max-width **TBD**, but implementers should keep headings from stretching edge-to-edge on wide viewports.
- **Paragraph max-width:** Section subheadings/descriptions are narrower still, wrapping at roughly sentence-length lines (2 lines observed for most section intros) — exact max-width **TBD**.
- **Wrapping/overflow:** No visible text truncation (ellipsis) anywhere in the reference; all headings and descriptions wrap naturally onto 1–2 lines. *(Observed)*
- **Line limit:** Card descriptions (gamification features, timeline cards) appear capped at roughly 2 lines based on the visible content — this is an **Observed pattern from current content**, not a confirmed CSS line-clamp; do not assume a hard line-clamp is implemented unless verified.
- **CTA emphasis:** The single primary action per section is always the filled red pill button; secondary actions are always lower-emphasis text/link style — this hierarchy must be preserved consistently across all sections (hero, gamification, closing CTA, category cards).

---

## 14. Implementation Guardrails

These rules apply to any developer or AI coding agent implementing this design:

1. **The screenshots are the source of truth.** Where this document and a screenshot appear to differ, the screenshot wins; flag the discrepancy rather than silently resolving it in the code.
2. **Do not create new colors, gradients, or fonts.** Use only the tokens defined in Sections 2–4 and Section 6. If a needed color truly isn't covered, use the closest existing token rather than introducing a new hex value.
3. **Do not invent new components or layout patterns** (e.g. a sidebar, a modal, a data table, a different navbar pattern) that are not present in the reference. If a page requires a component not covered here, mark it `TBD` and request a reference before designing it.
4. **Do not redesign.** This document describes an existing design; it is not a brief for a new visual direction. Preserve card shapes, button shapes, spacing rhythm, and the near-black + red/orange glow identity exactly as observed.
5. **Do not add features that aren't present in the reference** (no new sections, no new interactions, no extra form fields, no additional nav items) unless explicitly requested elsewhere.
6. **Any chart, timeline, or data-like element is a visual/UI element only.** Documenting the timeline or any future chart in this system is not a basis for introducing machine learning, predictive models, algorithms, recommendation logic, databases, APIs, backend, or system architecture — this document is strictly a front-end visual specification.
7. **When a value is not confirmable, write `TBD`.** Never fill a gap with a plausible-sounding but unverified number, color, or behavior. Distinguish clearly between `Observed`, `Inferred`, and `TBD` as defined in the Legend.

---

## 15. Do's and Don'ts

- **Do** preserve the near-black background with radial red/orange glow as the core visual identity.
- **Do** use red (`R300`) consistently as the primary action color across all primary buttons and key links.
- **Do** use Poppins with a clear weight hierarchy (Bold for headings, Regular/Medium for body) to keep text legible on dark surfaces.
- **Do** keep the pill shape on primary buttons and status/eyebrow badges consistent with the reference.
- **Do** use the semi-transparent card treatment (`#151C28` @ 50%) as the container style so cards stay visually integrated with the dark background while remaining distinct.
- **Do** tag every new measurement or behavior you add during implementation as Observed, Inferred, or TBD so the document stays audit-able.
- **Don't** replace the dark background with a light theme — this removes the dramatic/spotlight character that defines the design.
- **Don't** add heavy drop shadows, glassmorphism, or complex layered elevation — depth in this design comes from color and glow, not shadow.
- **Don't** use colors outside the defined palettes (Violet, Yellow, Orange, Red, Foreground, Success, and Primary Palette) except necessary opacity derivatives of those same tokens.
- **Don't** invent components (e.g. sidebar, modal, table) that don't appear in the reference — mark them `TBD` until a reference is provided.
- **Don't** propose or implement machine learning, predictive models, algorithms, databases, APIs, backend logic, or system architecture as part of this design system — this file documents UI/UX only.

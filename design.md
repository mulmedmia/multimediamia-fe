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

---

## 2. Color System

### Colors Overview
- Base page background: `#151C28` (near-black) / `#1E2939` (surface)
- Primary Red: `#E01C20` (`R300`)
- Accent Orange: `#FF4500` (`O300`)
- Primary Dark Red Glow: `#810220`
- Surface Card: `#151C28` at 50% opacity
- On Surface Text: `#FFF9F5` (Off White)
- Muted Text: `#AAB1BD` / `#99A1AF`
- Success: `#00B445`

---
name: Brutalist Glass
colors:
  surface: "#f9f9f9"
  surface-dim: "#dadada"
  surface-bright: "#f9f9f9"
  surface-container-lowest: "#ffffff"
  surface-container-low: "#f3f3f3"
  surface-container: "#eeeeee"
  surface-container-high: "#e8e8e8"
  surface-container-highest: "#e2e2e2"
  on-surface: "#1a1c1c"
  on-surface-variant: "#4c4546"
  inverse-surface: "#2f3131"
  inverse-on-surface: "#f1f1f1"
  outline: "#7e7576"
  outline-variant: "#cfc4c5"
  surface-tint: "#5e5e5e"
  primary: "#000000"
  on-primary: "#ffffff"
  primary-container: "#1b1b1b"
  on-primary-container: "#848484"
  inverse-primary: "#c6c6c6"
  secondary: "#506600"
  on-secondary: "#ffffff"
  secondary-container: "#c1f100"
  on-secondary-container: "#546b00"
  tertiary: "#000000"
  on-tertiary: "#ffffff"
  tertiary-container: "#380038"
  on-tertiary-container: "#e800e8"
  error: "#ba1a1a"
  on-error: "#ffffff"
  error-container: "#ffdad6"
  on-error-container: "#93000a"
  primary-fixed: "#e2e2e2"
  primary-fixed-dim: "#c6c6c6"
  on-primary-fixed: "#1b1b1b"
  on-primary-fixed-variant: "#474747"
  secondary-fixed: "#c3f400"
  secondary-fixed-dim: "#abd600"
  on-secondary-fixed: "#161e00"
  on-secondary-fixed-variant: "#3c4d00"
  tertiary-fixed: "#ffd7f5"
  tertiary-fixed-dim: "#ffabf3"
  on-tertiary-fixed: "#380038"
  on-tertiary-fixed-variant: "#810081"
  background: "#f9f9f9"
  on-background: "#1a1c1c"
  surface-variant: "#e2e2e2"
typography:
  h1:
    fontFamily: Space Grotesk
    fontSize: 48px
    fontWeight: "700"
    lineHeight: "1.1"
    letterSpacing: -0.02em
  h2:
    fontFamily: Space Grotesk
    fontSize: 32px
    fontWeight: "700"
    lineHeight: "1.2"
    letterSpacing: -0.01em
  h3:
    fontFamily: Space Grotesk
    fontSize: 24px
    fontWeight: "600"
    lineHeight: "1.2"
    letterSpacing: "0"
  body-lg:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: "400"
    lineHeight: "1.6"
    letterSpacing: "0"
  body-md:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: "400"
    lineHeight: "1.5"
    letterSpacing: "0"
  label-bold:
    fontFamily: Space Grotesk
    fontSize: 14px
    fontWeight: "600"
    lineHeight: "1"
    letterSpacing: 0.05em
  code:
    fontFamily: Space Grotesk
    fontSize: 14px
    fontWeight: "400"
    lineHeight: "1.4"
    letterSpacing: "0"
spacing:
  unit: 4px
  xs: 4px
  sm: 8px
  md: 16px
  lg: 24px
  xl: 48px
  gutter: 24px
  margin: 32px
---

## Brand & Style

This design system is a high-impact synthesis of raw architectural Brutalism and contemporary digital Glassmorphism. It targets data-heavy dashboard environments that require maximum legibility without sacrificing a distinctive, cutting-edge aesthetic.

The brand personality is authoritative yet transparent, evoking a sense of "technical sophistication." It utilizes a "light mode" foundation to maintain high contrast, ensuring that vibrant neon accents draw immediate attention to critical information and primary actions. The emotional response is one of clarity, industrial precision, and forward-thinking energy.

## Colors

The palette is anchored by a stark monochromatic base, punctuated by high-frequency neon accents.

- **Primary & Foundation:** Deepest black (#000000) is used for all structural borders, typography, and hard shadows. The background is a crisp, sterile white or a very pale neutral gray.
- **Neon Accents:** Electric Lime (#CCFF00) serves as the primary action color. Intense Pink (#FF00FF) and Cyan (#00FFFF) are reserved for status indicators, data visualization, and secondary CTAs.
- **Glass Layering:** A semi-transparent white (60% opacity) is used for card surfaces to allow the background context to bleed through slightly, creating depth within the rigid black frames.

## Typography

The typographic hierarchy relies on the tension between technical geometry and utilitarian readability.

- **Headlines:** Space Grotesk is utilized in heavy weights for all headers. The tight letter-spacing and geometric apertures reinforce the industrial theme.
- **Body:** Inter provides a neutral, highly legible counterpoint for long-form data and interface labels.
- **Labels:** Use Space Grotesk in all-caps for metadata, button labels, and table headers to maintain the "technical" feel of the system.

## Layout & Spacing

The design system employs a rigid, fixed-grid philosophy based on a 4px baseline. Layouts should feel structured and compartmentalized, like a technical blueprint.

- **Grid:** Use a 12-column grid for main dashboard views with a 24px gutter.
- **Padding:** Internal card padding should be generous (24px or 32px) to balance the heavy visual weight of the borders.
- **Alignment:** Elements must align strictly to the grid edges. Avoid organic or floating placements; every component should feel "locked" into the layout.

## Elevation & Depth

This design system rejects naturalistic lighting. Depth is communicated through two distinct methods:

1.  **Hard-Edge Shadows:** Use black or neon-colored "drop shadows" with 0px blur and a 4px to 8px offset (bottom-right). This creates a "sticker" or "layered sheet" effect.
2.  **Backdrop Blurs:** Glassmorphism is applied to primary containers. Use a `backdrop-filter: blur(20px)` combined with a semi-transparent white fill. These "glass" panels must always be contained within a 3px or 4px solid black border.
3.  **Z-Axis:** Higher elevation is represented by larger shadow offsets, not softer blurs.

## Shapes

The shape language is strictly architectural and sharp.

- **Corners:** All UI elements—including buttons, cards, and input fields—must have 0px border-radius (Sharp).
- **Borders:** Every interactive or container element requires a solid black border. Use 2px for standard elements (inputs, buttons) and 4px for primary containers (cards, sidebars).
- **Icons:** Use thick-stroke, monolinear icons that mirror the weight of the typography and borders.

## Components

- **Buttons:** Sharp corners, 2px black border, and a 4px hard black offset shadow. On hover, the shadow disappears and the button "depresses" (translates 4px down/right). Primary buttons use the Electric Lime background.
- **Cards:** Glassmorphic background (blur: 20px, opacity: 60%), 4px black border, and a 6px hard black offset shadow.
- **Input Fields:** Stark white background, 2px black border. On focus, the border changes to Electric Lime or Cyan, and a 4px neon hard shadow is applied.
- **Chips/Badges:** Small, sharp rectangles with 2px borders. Use neon background colors for status (e.g., Pink for "Error", Lime for "Active").
- **Checkboxes:** Square, 2px black border. When checked, the fill is black with a neon "X" or checkmark in the center.
- **Data Tables:** Use heavy 2px horizontal and vertical dividers. Header cells should have a light gray background to distinguish them from the body.

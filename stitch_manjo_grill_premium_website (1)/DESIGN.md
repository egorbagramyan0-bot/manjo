---
name: Verdant Hearth
colors:
  surface: '#fef9ee'
  surface-dim: '#dedacf'
  surface-bright: '#fef9ee'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f8f3e8'
  surface-container: '#f2ede2'
  surface-container-high: '#ede8dd'
  surface-container-highest: '#e7e2d7'
  on-surface: '#1d1c15'
  on-surface-variant: '#414844'
  inverse-surface: '#323029'
  inverse-on-surface: '#f5f0e5'
  outline: '#717974'
  outline-variant: '#c1c8c3'
  surface-tint: '#426657'
  primary: '#002419'
  on-primary: '#ffffff'
  primary-container: '#163a2d'
  on-primary-container: '#7fa493'
  inverse-primary: '#a8cfbd'
  secondary: '#56633b'
  on-secondary: '#ffffff'
  secondary-container: '#d9e9b5'
  on-secondary-container: '#5c6940'
  tertiary: '#2a1c00'
  on-tertiary: '#ffffff'
  tertiary-container: '#443003'
  on-tertiary-container: '#b59861'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#c4ebd8'
  primary-fixed-dim: '#a8cfbd'
  on-primary-fixed: '#002116'
  on-primary-fixed-variant: '#2a4d40'
  secondary-fixed: '#d9e9b5'
  secondary-fixed-dim: '#bdcd9b'
  on-secondary-fixed: '#141f01'
  on-secondary-fixed-variant: '#3f4b25'
  tertiary-fixed: '#ffdea3'
  tertiary-fixed-dim: '#e2c288'
  on-tertiary-fixed: '#261900'
  on-tertiary-fixed-variant: '#594315'
  background: '#fef9ee'
  on-background: '#1d1c15'
  surface-variant: '#e7e2d7'
typography:
  display-lg:
    fontFamily: Playfair Display
    fontSize: 48px
    fontWeight: '700'
    lineHeight: 56px
    letterSpacing: -0.02em
  display-lg-mobile:
    fontFamily: Playfair Display
    fontSize: 36px
    fontWeight: '700'
    lineHeight: 42px
    letterSpacing: -0.01em
  headline-md:
    fontFamily: Playfair Display
    fontSize: 32px
    fontWeight: '600'
    lineHeight: 40px
  headline-sm:
    fontFamily: Playfair Display
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
  body-lg:
    fontFamily: Hanken Grotesk
    fontSize: 18px
    fontWeight: '400'
    lineHeight: 28px
  body-md:
    fontFamily: Hanken Grotesk
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  label-caps:
    fontFamily: Hanken Grotesk
    fontSize: 12px
    fontWeight: '600'
    lineHeight: 16px
    letterSpacing: 0.1em
  button-text:
    fontFamily: Hanken Grotesk
    fontSize: 14px
    fontWeight: '600'
    lineHeight: 20px
    letterSpacing: 0.05em
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  unit: 8px
  container-max: 1200px
  gutter: 24px
  margin-desktop: 64px
  margin-mobile: 20px
  section-gap: 80px
---

## Brand & Style
The brand personality is an intersection of colonial-era elegance and raw, elemental fire. It evokes the atmosphere of a secluded tropical conservatory at dusk—lush, private, and exclusive. The UI must feel like a high-end physical menu: tactile, weighted, and deeply intentional.

The design style is **Minimalist-Organic**. It utilizes heavy whitespace to suggest luxury, paired with sophisticated editorial typography. While the structure is clean and professional, the aesthetic is softened by warm ivory surfaces and organic botanical motifs. The goal is to make the user feel like they are stepping into a curated sanctuary, moving away from "digital" coldness toward a "physical" hospitality experience.

## Colors
The palette is rooted in the "Tropical Greenhouse" narrative. 

- **Ivory (#F4EFE4)**: Acts as the primary canvas, replacing stark white to provide a warmer, more aged-paper feel that reduces eye strain and signals premium quality.
- **Deep Green (#163A2D)**: Used for primary text and high-emphasis containers. It represents the dense foliage and provides a grounding, authoritative presence.
- **Olive (#6F7D52)**: Used for secondary elements, iconography, and subtle UI accents to bridge the gap between the dark green and the ivory.
- **Brass/Aged Gold (#B79A63)**: Reserved for calls to action, highlights, and decorative flourishes (like bird motifs). It mimics the warm glow of fire and premium metal fixtures.
- **Warm Beige (#D9CBB8)**: Utilized for subtle dividers, input backgrounds, and secondary surface layers to add depth without losing the ivory warmth.

## Typography
The typography system relies on a high-contrast pairing. 

**Playfair Display** provides the editorial, magazine-like authority for headlines. It should be used for menu categories, section titles, and featured grill items. Use optical sizing where possible to maintain the delicacy of the serifs.

**Hanken Grotesk** serves as the functional workhorse. Its contemporary, sharp geometry provides a modern counterpoint to the classic serif. It ensures maximum readability for ingredient lists, pricing, and administrative UI tasks. All labels and buttons should utilize Hanken Grotesk in medium or semi-bold weights to maintain a crisp, professional appearance.

## Layout & Spacing
The layout follows a **Fixed Grid** philosophy on desktop to preserve the "printed page" feel, centered with generous outer margins. 

A strict 8px base unit governs all spacing. Vertical rhythm is critical; section gaps are intentionally large (80px+) to allow the botanical illustrations and high-resolution food photography room to "breathe." 

On mobile, the layout transitions to a single-column fluid flow, but maintains the 20px side margins to prevent content from touching the screen edges, preserving the premium aesthetic. Text-heavy sections should be constrained to a maximum width of 720px to ensure optimal line lengths for reading.

## Elevation & Depth
Depth is conveyed through **Tonal Layering** rather than aggressive shadows. 

The background is Ivory (#F4EFE4). Secondary containers (like cards or reservation forms) use the Warm Beige (#D9CBB8) with a very soft, diffused shadow (15% opacity Deep Green, 20px blur, 4px offset). 

For interactive elements like "Book a Table" buttons or floating navigation, use a subtle **Brass Glow** (a faint outer glow using #B79A63 at 10% opacity) to suggest the warmth of a nearby grill or fire. Decorative botanical elements should be placed on a "z-index -1" layer, often appearing behind text but over the background, with low-opacity fades to create a sense of environmental depth.

## Shapes
The shape language is "Soft-Modern." Use 0.5rem (8px) as the standard radius for buttons and input fields. Larger containers, such as dish highlight cards or the reservation modal, should use 1rem (16px) to feel more approachable and organic. 

Avoid perfectly circular "pill" buttons unless used for small floating action buttons; rectangular shapes with soft corners better reflect the architectural lines of a greenhouse structure. Decorative botanical accents (monstera/palm) should use natural, organic paths with no hard edges.

## Components

### Buttons
- **Primary:** Deep Green (#163A2D) background with Ivory (#F4EFE4) text. High-contrast and authoritative.
- **Secondary/Brass:** Outline style using the Brass (#B79A63) color for the border and text. On hover, fill with Brass and change text to Deep Green.
- **Minimalist:** Text-only with a small bird motif (e.g., a stylized cockatoo) appearing to the right on hover.

### Cards
Cards for menu items should be borderless. Use a subtle Warm Beige (#D9CBB8) background. Images should be slightly inset with rounded corners. Title (Serif) and Price (Sans) should be clearly separated.

### Input Fields
Forms should feel light. Use a bottom-border only (1px Deep Green) or a very light Warm Beige fill. Focus states should be highlighted by a change in border color to Brass (#B79A63).

### Lists & Menus
Menu sections should be introduced with a Serif headline and a small botanical divider. Item descriptions should be in Hanken Grotesk with high line-height for readability. Use Brass-colored bullets or small leaf icons for dietary indicators (Vegan, GF).

### Specialized Elements
- **Botanical Overlays:** High-quality PNGs of Monstera or Palm leaves placed in the corners of the viewport, fixed during scroll to create a "looking through the garden" effect.
- **Motifs:** Small, minimalist line-art bird motifs (Toucan/Cockatoo) used as end-of-section ornaments or loading indicators.
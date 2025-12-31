# SMU Campus Food Pre-Order App - Design Guidelines

## Brand Identity

### SMU Color Palette
- **Primary (SMU Navy)**: `#151C55` - Main brand color, used for backgrounds
- **Accent (SMU Gold)**: `#8A704C` - Used for CTAs, highlights, and interactive elements
- **White**: `#FFFFFF` - Text on dark backgrounds

### Surface Levels (Derived from Navy)
- **Background Root**: `#0A0E2E` - Deepest background
- **Background Default**: `#0F1340` - Main screen background
- **Surface 1**: `#1A2258` - Card backgrounds
- **Surface 2**: `#222B6B` - Elevated elements, sticky bars
- **Surface 3**: `#2A357D` - Interactive elements, buttons

### Text Colors
- **Primary Text**: `#FFFFFF` - Main content
- **Secondary Text**: `rgba(255, 255, 255, 0.65)` - Supporting content
- **Muted Text**: `rgba(255, 255, 255, 0.45)` - Placeholder, disabled states

### Semantic Colors
- **Success**: `#4ADE80` with `rgba(74, 222, 128, 0.15)` background
- **Error**: `#EF4444` with `rgba(239, 68, 68, 0.15)` background
- **Accent Light**: `rgba(138, 112, 76, 0.15)` - Accent tint for icons/badges

## Typography Hierarchy

### Font Sizes
- **H1 (Page Title)**: 28px, Bold (700), letter-spacing: -0.5
- **H2 (Section Title)**: 22px, Semi-bold (600), letter-spacing: -0.3
- **H3 (Card Title)**: 18px, Semi-bold (600)
- **Body**: 16px, Regular (400)
- **Body Bold**: 16px, Semi-bold (600)
- **Caption**: 14px, Regular (400)
- **Caption Bold**: 14px, Semi-bold (600)
- **Small**: 12px, Regular (400)
- **Small Bold**: 12px, Semi-bold (600)

### Usage Guidelines
- Page titles: H1, white, centered or left-aligned
- Section headers: Small Bold, secondary text, uppercase with letter-spacing 0.5
- Item names: Body Bold, white
- Item descriptions: Small, secondary text
- Prices: Body Bold, accent color (gold)
- Labels: Caption or Small, secondary text

## Spacing System

- **xs**: 4px
- **sm**: 8px
- **md**: 12px
- **lg**: 16px
- **xl**: 24px
- **2xl**: 32px
- **3xl**: 40px
- **4xl**: 48px

### Component Spacing
- Card padding: 16px (lg)
- Section gap: 12px (md)
- Item gap within cards: 8px (sm)
- Minimum touch target: 44px

## Border Radius

- **xs**: 4px - Small badges
- **sm**: 8px - Buttons, inputs
- **md**: 12px - Cards
- **lg**: 16px - Large cards
- **xl**: 20px - Modal, prominent cards
- **full**: 9999px - Pills, circular buttons

## Shadows

### Card Shadow (Subtle)
```
shadowColor: "#000"
shadowOffset: { width: 0, height: 2 }
shadowOpacity: 0.1
shadowRadius: 8
elevation: 2
```

### Elevated Shadow (Sticky bars, modals)
```
shadowColor: "#000"
shadowOffset: { width: 0, height: 8 }
shadowOpacity: 0.2
shadowRadius: 16
elevation: 8
```

## Component Specifications

### Cards
- Background: Surface 1 (`#1A2258`)
- Border: 1px solid `rgba(255, 255, 255, 0.1)`
- Border radius: 16px (lg)
- Padding: 16px

### Primary CTA Buttons
- Background: Accent (`#8A704C`)
- Text: White, Body Bold
- Height: 52px
- Border radius: 12px (md)
- Pressed state: `#6B5A3E`

### Secondary Buttons
- Background: Transparent
- Border: 1px solid `rgba(255, 255, 255, 0.1)`
- Text: Accent color
- Height: 52px
- Border radius: 12px

### Quantity Buttons (+/-)
- Size: 44x44px (minimum touch target)
- Border radius: 8px
- Plus button: Accent background, white icon
- Minus button: Surface 3 background, white icon
- Disabled: 60% opacity

### Toggle Switches
- Track off: Surface 3
- Track on: Accent
- Thumb: White

### Sticky Bottom Bars
- Background: Surface 2
- Border top: 1px solid border color
- Padding: 16px
- Elevated shadow

### Input Fields
- Background: Surface 2
- Border radius: 8px
- Padding: 12px
- Text: White
- Placeholder: Muted text

## Screen Layouts

### Menu Screen
1. Vendor info bar (Surface 1, centered location + time)
2. Section title "Menu" (uppercase, secondary)
3. Menu item cards with +/- controls
4. Sticky cart summary bar (when items > 0)

### Checkout Screen (Your Order)
1. Vendor header card
2. Order summary table (Qty, Item, Price)
3. Toggle section (Take Out, Cutlery)
4. Order notes input
5. Collection details section
6. Sticky submit bar with total + CTA

### Confirmation Screen
1. Success icon (green checkmark)
2. Large order number card (accent background)
3. Order details list with icons
4. Action buttons (View History, Order Again)

## Accessibility

- Minimum touch target: 44x44px
- Contrast ratio: Minimum 4.5:1 for body text
- Focus indicators on interactive elements
- Disabled states: 60% opacity
- No low-opacity text that becomes unreadable

## Interaction States

- **Default**: Normal appearance
- **Pressed**: Scale 0.98 + background color shift
- **Disabled**: 50-60% opacity
- **Loading**: Skeleton screens or spinner

## Best Practices

1. Use accent (gold) sparingly - only for primary CTAs and key highlights
2. Maintain consistent spacing between cards (md: 12px)
3. Icon colors should match their context (accent for interactive, secondary for info)
4. All text on dark backgrounds should use white or secondary white
5. Use surface levels to create visual hierarchy and depth

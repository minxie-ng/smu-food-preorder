# SMU Campus Food Pre-Order App - Design Guidelines

## Brand Identity

### SMU Core Colors (Anchors)
- **SMU Navy**: `#151C55` - Used ONLY for navigation bars and tab bars
- **SMU Gold**: `#8A704C` - Primary CTAs, total prices, order number confirmation
- **White**: `#FFFFFF` - Text on dark surfaces, card backgrounds

### Surface Hierarchy (Light Theme)
The UI uses a light surface hierarchy to create a calm, welcoming experience:

- **Background**: `#F5F6FA` - Very light blue-grey page background
- **Surface 1**: `#FFFFFF` - White cards (primary content containers)
- **Surface 2**: `#F0F1F7` - Light grey-blue for inputs, inner sections
- **Surface 3**: `#E8EAF2` - Toggle tracks, secondary interactive areas

### Navy Usage (Limited)
Navy is used as an anchor, NOT the dominant surface:
- Top navigation header bar
- Bottom tab bar  
- Floating cart/submit bars
- Confirmation screen background only

### Text Colors (On Light Surfaces)
- **Primary Text**: `#1A1D3D` - Near-black with navy tint, high readability
- **Secondary Text**: `#5A5F7A` - Medium grey for supporting content
- **Muted Text**: `#8B8FA6` - Placeholders, hints, disabled states

### Text Colors (On Dark Surfaces - nav bars, confirmation)
- **White**: `#FFFFFF` - Primary text
- **White 80%**: `rgba(255, 255, 255, 0.8)` - Secondary labels
- **White 70%**: `rgba(255, 255, 255, 0.7)` - Hints, subtle text

### Semantic Colors
- **Success**: `#22C55E` with `rgba(34, 197, 94, 0.12)` background
- **Error**: `#EF4444` with `rgba(239, 68, 68, 0.12)` background
- **Gold Light**: `rgba(138, 112, 76, 0.12)` - Accent tint for badges

### Borders
- **Light Border**: `#E2E4ED` - Default card borders
- **Dark Border**: `#D1D4E0` - Emphasis borders

## Gold Usage Rules (Strict)

Gold (#8A704C) is used ONLY for:
1. Primary CTA buttons (Submit Order, Continue, Order Again)
2. Total price displays
3. Order number card background on confirmation
4. Item prices in menus
5. Selected state indicators (time slots, tabs)

Gold is NOT used for:
- Decorative icons
- Secondary labels
- Background tints (use navy-derived surfaces instead)
- Non-actionable elements

## Typography Hierarchy

### Font Sizes
- **H1**: 28px, Bold (700), letter-spacing: -0.5
- **H2**: 22px, Semi-bold (600), letter-spacing: -0.3
- **H3**: 18px, Semi-bold (600)
- **Body**: 16px, Regular (400)
- **Body Bold**: 16px, Semi-bold (600)
- **Caption**: 14px, Regular (400)
- **Caption Bold**: 14px, Semi-bold (600)
- **Small**: 12px, Regular (400)
- **Small Bold**: 12px, Semi-bold (600)

### Contrast Guidelines
- All body text on light backgrounds uses `#1A1D3D` (high contrast)
- Secondary text uses `#5A5F7A` (4.5:1 minimum)
- Never use low-opacity text that becomes unreadable
- Section titles use Secondary + uppercase + letter-spacing 0.5

## Spacing System

- **xs**: 4px
- **sm**: 8px
- **md**: 12px
- **lg**: 16px
- **xl**: 24px
- **2xl**: 32px
- **3xl**: 40px
- **4xl**: 48px

### Breathing Room
- Increase to `xl` (24px) for top padding after headers
- Use `lg` (16px) between sections for visual separation
- Cards have `lg` (16px) internal padding

## Border Radius

- **xs**: 4px - Quantity badges
- **sm**: 8px - Buttons, inputs
- **md**: 12px - Standard cards
- **lg**: 16px - Large cards
- **xl**: 20px - Order number card
- **full**: 9999px - Pills, circular buttons

## Shadows (Subtle)

### Card Shadow
```
shadowColor: "#1A1D3D"
shadowOffset: { width: 0, height: 2 }
shadowOpacity: 0.06
shadowRadius: 8
elevation: 2
```

### Elevated Shadow (Floating bars)
```
shadowColor: "#1A1D3D"
shadowOffset: { width: 0, height: 4 }
shadowOpacity: 0.1
shadowRadius: 12
elevation: 4
```

## Screen-Specific Guidelines

### Menu Screen (Lightest)
- Light grey background (#F5F6FA)
- White cards for menu items
- Easy browsing, minimal visual weight
- Floating navy cart bar at bottom

### Your Order Screen (Calm, Review-Focused)
- Light grey background
- White cards for each section
- Toggle switches use gold when active
- Floating navy submit bar

### Order Confirmed Screen (Premium)
- Navy background (exception - premium feel)
- Gold order number card (key highlight)
- White details card
- Reassuring, celebratory tone

### Order History Screen
- Light grey background
- White expandable order cards
- Gold accent for order numbers and totals

## Component Specifications

### Cards
- Background: White (#FFFFFF)
- Border: 1px solid #E2E4ED
- Border radius: 16px (lg)
- Padding: 16px
- Subtle shadow

### Primary CTA Buttons
- Background: Gold (#8A704C)
- Text: White, Body Bold
- Height: 52px
- Border radius: 12px (md)
- Pressed: #6B5A3E

### Quantity Buttons
- Size: 44x44px (minimum touch target)
- Plus: Gold background, white icon
- Minus: Surface 2 background, dark text
- Disabled: 50% opacity

### Toggle Switches
- Track off: Surface 3 (#E8EAF2)
- Track on: Gold (#8A704C)
- Thumb: White

### Floating Bars (Cart, Submit)
- Background: Navy (#151C55)
- Border radius: 16px
- Padding: 16px
- Elevated shadow
- White text, gold CTA button

## Accessibility

- Minimum touch target: 44x44px
- Text contrast: 4.5:1 minimum for body text
- High-contrast text colors on light backgrounds
- No low-opacity text that becomes hard to read
- Disabled states: 50% opacity

## Visual Balance Goals

- 60-70% white/light surface coverage on browsing screens
- Navy as anchor (nav bars) not dominant
- Gold sparingly for key actions only
- Clear card boundaries that stand out from background
- Generous vertical spacing for breathing room

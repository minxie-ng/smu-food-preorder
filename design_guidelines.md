# Campus Food Pre-Order App - Design Guidelines

## Architecture Decisions

### Authentication
**No Auth Required** - The user is already logged in. However, include a minimal profile indicator in the header showing:
- User avatar/initials
- Student name (mock data)
- Optional link to settings (can be a placeholder)

### Navigation
**Stack-Based Navigation** with persistent bottom navigation:
- Primary flow: Vendor List → Menu → Pickup Time → Confirmation
- Bottom navigation (2 tabs):
  - **Order** (home) - Shows vendor list
  - **History** - Shows past orders
- Use browser history or state-based routing (no full page reloads)

### Screen Specifications

#### 1. Vendor List Screen
- **Purpose**: Browse available food vendors and select one
- **Layout**:
  - Fixed header with app title "Campus Food" and profile icon (top-right)
  - Main content: Scrollable list of vendor cards
  - Bottom navigation bar (fixed)
- **Components**:
  - Vendor cards showing:
    - Vendor name (bold, 18px)
    - Location (12px, muted color)
    - Prep time badge (e.g., "15-20 min")
    - "Fully Booked" overlay (if applicable) - semi-transparent red overlay with text
  - Cards should be tappable (entire card is clickable)
- **States**:
  - Available vendors: Full opacity, clear CTA
  - Fully booked: 50% opacity, red overlay, disabled interaction

#### 2. Vendor Menu Screen
- **Purpose**: Select items and quantities
- **Layout**:
  - Header with back button (left), vendor name (center)
  - Vendor info bar: location + prep time
  - Scrollable menu items list
  - Fixed bottom bar with cart summary and "Continue" button
- **Components**:
  - Menu item cards:
    - Item name (16px, semi-bold)
    - Description (14px, gray)
    - Price (16px, bold)
    - Quantity controls: [-] [0] [+] buttons (right-aligned)
  - Cart summary bar:
    - Total items count + total price
    - "Continue to Pickup Time" button (primary CTA)
- **Interaction**:
  - Quantity buttons: +/- increment/decrement (disable at 0)
  - Cart summary only appears when items > 0

#### 3. Pickup Time Selection Screen
- **Purpose**: Choose when to collect the order
- **Layout**:
  - Header with back button, "Pickup Time" title
  - Order summary card (collapsed view with items + total)
  - Time slot selector (scrollable grid or list)
  - Fixed bottom "Confirm Order" button
- **Components**:
  - Time slots as selectable cards (30-min intervals)
  - Each slot shows time (e.g., "12:00 PM - 12:30 PM")
  - Visual indicator for selected slot
  - Disable slots that are past current time or fully booked

#### 4. Order Confirmation Screen
- **Purpose**: Show order success and details
- **Layout**:
  - Success icon/animation (checkmark)
  - Order number (large, bold, e.g., "#A1234")
  - Order details card:
    - Vendor name + location
    - Pickup time
    - Items list
    - Total price
  - Two CTAs: "View in History" and "Order Again"
- **Visual**: Use success green color for confirmation state

#### 5. Order History Screen
- **Purpose**: View past orders
- **Layout**:
  - Header with "Order History" title
  - Scrollable list of order cards
  - Empty state if no orders
- **Components**:
  - Order cards showing:
    - Order number + date
    - Vendor name
    - Total price
    - Status badge (e.g., "Completed", "Picked Up")
  - Tap card to expand/view details

## Design System

### Color Palette
- **Primary**: `#FF6B35` (vibrant orange - food/appetite stimulating)
- **Primary Dark**: `#E55A2B` (pressed state)
- **Secondary**: `#4ECDC4` (teal - modern, clean)
- **Success**: `#2ECC71` (green)
- **Error/Booked**: `#E74C3C` (red)
- **Background**: `#F8F9FA` (light gray)
- **Surface**: `#FFFFFF` (white cards)
- **Text Primary**: `#2C3E50` (dark gray)
- **Text Secondary**: `#7F8C8D` (medium gray)
- **Border**: `#E0E0E0` (light border)

### Typography
- **Font Family**: System font stack (`-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif`)
- **Sizes**:
  - H1 (Screen titles): 24px, bold
  - H2 (Card titles): 18px, semi-bold
  - Body: 16px, regular
  - Caption: 14px, regular
  - Small: 12px, regular

### Spacing Scale
- xs: 4px
- sm: 8px
- md: 16px
- lg: 24px
- xl: 32px

### Component Specifications

**Vendor/Menu Cards**:
- Background: white
- Border radius: 12px
- Padding: 16px
- Box shadow: `0 2px 8px rgba(0,0,0,0.08)`
- Margin between cards: 12px

**Buttons**:
- Primary CTA:
  - Background: Primary color
  - Text: white, 16px, semi-bold
  - Height: 48px
  - Border radius: 8px
  - Full width on mobile
  - Pressed state: Primary Dark + subtle scale (0.98)
- Secondary button:
  - Background: transparent
  - Border: 1px solid Primary
  - Text: Primary color
- Quantity buttons:
  - Size: 32x32px
  - Border: 1px solid Border color
  - Border radius: 6px
  - Background: white
  - Pressed state: Background #F0F0F0

**Bottom Navigation**:
- Height: 60px
- Background: white
- Border top: 1px solid Border
- Icons: 24px
- Active tab: Primary color
- Inactive tab: Text Secondary

**Badges** (prep time, status):
- Padding: 4px 12px
- Border radius: 12px
- Font size: 12px
- Background colors based on type

### Interaction Design
- All buttons have `:active` state with slight scale or background change
- Use smooth transitions (200ms ease-in-out) for state changes
- Loading states: Show skeleton screens or subtle spinner
- Disable "Continue" buttons when no selection made
- Show immediate feedback for quantity changes

### Responsive Behavior
- Mobile (default): 100% width, single column
- Tablet (768px+): Max width 480px, centered
- Desktop (1024px+): Max width 480px, centered

### Accessibility
- All interactive elements min touch target: 44x44px
- Contrast ratio: Minimum 4.5:1 for text
- Focus indicators on all interactive elements
- Semantic HTML (buttons, nav, main)

### Visual Feedback
- Hover states: Subtle background color change (`rgba(0,0,0,0.04)`)
- Active/pressed states: Scale 0.98 + darker background
- Disabled states: 50% opacity + cursor not-allowed
- Transitions: 200ms for color, 150ms for transform
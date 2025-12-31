# Edge Case: Pickup Time Slot Becomes Unavailable

## Overview

This document explains the implementation of handling the scenario where a user's selected pickup time slot becomes unavailable (fully booked) when they attempt to submit their order.

## Why This Edge Case Matters

### 1. Race Conditions in Pre-Order Systems

In real food pre-ordering systems, multiple users may be browsing and selecting the same pickup time simultaneously. By the time one user clicks "Submit Order", another user may have already claimed the last available slot for that time window.

### 2. Dynamic Vendor Capacity

Food vendors have limited preparation capacity per time window:
- Kitchen staff can only prepare X orders per 15-minute slot
- Popular lunch times (12:00-1:00 PM) fill up much faster
- High demand periods may see slots filling within seconds

### 3. User Experience Impact

Without proper handling:
- Users see a generic error message
- They may lose their entire cart and order customizations
- Frustration leads to app abandonment
- Negative reviews and lost revenue

## UI Recovery Strategy

### Clear, Contextual Communication

When the time slot becomes unavailable, we show:

1. **Modal Dialog** with:
   - Visual error icon (clock with error styling)
   - Clear title: "Time slot unavailable"
   - Specific message including the blocked time
   - Two actionable recovery options

2. **Recovery Actions**:
   - **Primary: "Choose another time"** - Keeps user in flow, auto-expands time picker
   - **Secondary: "Browse other vendors"** - Alternative path if no suitable times

3. **Inline Helper Text** after dismissal:
   - Shows under Collection Details section
   - Text: "That slot just filled up. Pick another time to continue."
   - Uses error color styling for visibility

### Visual Disabled State

Unavailable time slots are clearly indicated:
- Grayed out background with reduced opacity (0.6)
- "Full" label next to the time
- Non-interactive (disabled pressable)
- Consistent with the design system

## Real Backend Implementation

In a production system, the backend would:

### 1. Return HTTP 409 Conflict

```json
{
  "error": "TIME_UNAVAILABLE",
  "message": "The selected time slot is no longer available",
  "blockedTime": "12:15 PM",
  "availableSlots": ["Now", "12:00 PM", "12:30 PM", "12:45 PM", "1:00 PM"]
}
```

### 2. Real-time Availability Updates

- WebSocket or polling for live slot availability
- Optimistic UI with server validation on submit
- Automatic refresh of availability data on focus

### 3. Optimistic Locking

- Reserve slot temporarily during checkout
- 5-minute hold to prevent race conditions
- Release on session timeout or explicit cancel

## Files Changed

- `client/data/timeSlotAvailability.ts` - Availability model and simulation
- `client/screens/CheckoutScreen.tsx` - UI implementation with modal and disabled chips

## Testing the Edge Case

1. Navigate to a vendor's menu
2. Add items to cart and proceed to checkout
3. Expand the time picker and select "12:15 PM" as the pickup time
4. Tap "Submit Order"
5. Observe the modal appears with the message "12:15 PM is fully booked"
6. Choose "Choose another time" to dismiss the modal
7. Notice the inline helper text: "That slot just filled up. Pick another time to continue."
8. Notice "12:15 PM" is now grayed out with "Full" label and cannot be selected
9. Select an available time (e.g., "12:30 PM")
10. Tap "Submit Order" again - order succeeds
11. Confirmation screen shows the final pickup time ("12:30 PM")

## Acceptance Criteria Met

- [x] Unavailable chip is visibly disabled and cannot be selected
- [x] Submitting with blocked time triggers the modal
- [x] User can recover by selecting another time
- [x] Confirmation screen reflects final chosen time
- [x] Brief explanation documented (this file)

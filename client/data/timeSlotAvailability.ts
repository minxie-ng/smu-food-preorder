/**
 * Time Slot Availability Model
 * 
 * This module simulates time slot availability for pickup times.
 * In a real system, this would be fetched from the backend API.
 * 
 * ## Why this edge case matters in real pre-order systems:
 * 
 * 1. **Race Conditions**: Multiple users may select the same pickup time simultaneously.
 *    By the time one user submits, the slot may already be full from other orders.
 * 
 * 2. **Dynamic Capacity**: Vendors have limited preparation capacity per time window.
 *    Popular times (lunch rush 12:00-1:00 PM) fill up faster than off-peak hours.
 * 
 * 3. **User Experience**: Without proper handling, users would see a generic error
 *    and lose their cart progress, leading to frustration and abandonment.
 * 
 * ## What we do in UI to recover:
 * 
 * - Show a clear, contextual modal explaining the issue (not a generic error)
 * - Provide the blocked time in the message so users understand what happened
 * - Offer two recovery actions:
 *   - Primary: Choose another time (keeps user in flow)
 *   - Secondary: Browse other vendors (alternative path forward)
 * - Display inline helper text after the modal is dismissed
 * - Visually disable the rejected time slot to prevent repeat attempts
 * - Auto-expand the time picker to encourage selection
 * 
 * ## What a real backend would do:
 * 
 * 1. Return HTTP 409 Conflict with error code "SLOT_FULL" or "TIME_UNAVAILABLE"
 * 2. Include updated availability data in the response:
 *    {
 *      "error": "TIME_UNAVAILABLE",
 *      "message": "The selected time slot is no longer available",
 *      "blockedTime": "12:15 PM",
 *      "availableSlots": ["Now", "12:00 PM", "12:30 PM", "12:45 PM", "1:00 PM"]
 *    }
 * 3. Client refreshes availability and prompts user to select again
 * 4. Optimistic locking on the backend prevents double-booking
 */

export interface TimeSlot {
  time: string;
}

/**
 * Time slot that will be rejected on submission (simulates race condition).
 * Initially appears available, but gets rejected when user tries to submit.
 */
export const BLOCKED_SLOT = "12:15 PM";

/**
 * All available time slots.
 * Note: All slots appear available initially. The rejection happens at submission time
 * to simulate a real-world race condition scenario.
 */
export const TIME_SLOTS: TimeSlot[] = [
  { time: "Now" },
  { time: "12:00 PM" },
  { time: "12:15 PM" }, // Will be rejected on submission
  { time: "12:30 PM" },
  { time: "12:45 PM" },
  { time: "1:00 PM" },
];

/**
 * Simulates a backend order submission.
 * Returns success or failure based on time slot availability.
 * 
 * This simulates a real-world scenario where the slot appeared available
 * when the user selected it, but by the time they submit, it's already full.
 * 
 * @param selectedTime - The pickup time selected by the user
 * @returns Result object with success status and optional error details
 */
export function simulateOrderSubmission(selectedTime: string): {
  success: boolean;
  errorCode?: "SLOT_FULL";
  blockedTime?: string;
  message?: string;
} {
  if (selectedTime === BLOCKED_SLOT) {
    return {
      success: false,
      errorCode: "SLOT_FULL",
      blockedTime: selectedTime,
      message: `${selectedTime} is fully booked. Please choose another pickup time.`,
    };
  }
  
  return { success: true };
}

/**
 * Referral Tracking Utility
 * 
 * Logic flow:
 * 1. Capture: On initial entry, extract the 'ref' parameter from the URL.
 * 2. Persist: Save the value to localStorage to survive page refreshes and navigation.
 * 3. Retrieve: Access the stored value when the user completes a target action (e.g., waitlist signup).
 */

const REFERRAL_STORAGE_KEY = "tarra_referral_id";

/**
 * Extracts and persists the referral ID from the current URL.
 * Should be called in a client-side environment (e.g., within a useEffect or middleware logic).
 * 
 * Flow:
 * - Checks if window and localStorage are available.
 * - Parses the query string for 'ref'.
 * - If found, overwrites any existing referral to credit the most recent source.
 */
export const captureReferral = (): void => {
  if (typeof window === "undefined" || !window.localStorage) return;

  try {
    const urlParams = new URLSearchParams(window.location.search);
    const ref = urlParams.get("ref");

    if (ref) {
      window.localStorage.setItem(REFERRAL_STORAGE_KEY, ref);
    }
  } catch (error) {
    // Fail silently to ensure the primary user experience is not interrupted
  }
};

/**
 * Retrieves the persisted referral ID.
 * 
 * Flow:
 * - Checks for the key in localStorage.
 * - Returns the string value if it exists, otherwise null.
 */
export const getReferral = (): string | null => {
  if (typeof window === "undefined" || !window.localStorage) return null;

  try {
    return window.localStorage.getItem(REFERRAL_STORAGE_KEY);
  } catch (error) {
    return null;
  }
};

/**
 * Removes the referral ID from storage.
 * Useful after a successful conversion to prevent redundant attribution.
 */
export const clearReferral = (): void => {
  if (typeof window === "undefined" || !window.localStorage) return;

  try {
    window.localStorage.removeItem(REFERRAL_STORAGE_KEY);
  } catch (error) {
    // Fail silently
  }
};

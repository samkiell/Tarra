import Waitlist from "@/models/Waitlist";

/**
 * Unique 5-Digit Code Generator
 * 
 * Logic:
 * 1. Generates a random number between 10000 and 99999.
 * 2. Checks MongoDB for collisions.
 * 3. Recursively retries until a unique code is secured.
 * 
 * Why 5 digits?
 * Provides 90,000 possible combinations, which is more than sufficient for the OAU student population
 * while keeping the shareable link extremely short and human-readable.
 */
export async function generateUniqueCode(): Promise<string> {
  const code = Math.floor(10000 + Math.random() * 90000).toString();
  
  const existing = await Waitlist.findOne({ referral_code: code });
  if (existing) {
    return generateUniqueCode();
  }
  
  return code;
}

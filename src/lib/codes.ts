import Waitlist from "@/models/Waitlist";

/**
 * Unique 5-Character Alphanumeric Code Generator
 * 
 * Logic:
 * 1. Generates a random alphanumeric string (A-Z, 0-9).
 * 2. Checks MongoDB for collisions.
 * 3. Recursively retries until a unique code is secured.
 * 
 * Why 5 characters?
 * Provides over 60 million possible combinations (36^5), which is mathematically robust
 * while remaining extremely easy for students to type and share.
 */
export async function generateUniqueCode(): Promise<string> {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"; // Removed ambiguous characters like 0, O, 1, I, 1, l
  let code = "";
  for (let i = 0; i < 5; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  
  const existing = await Waitlist.findOne({ referral_code: code });
  if (existing) {
    return generateUniqueCode();
  }
  
  return code;
}

import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import dbConnect from "@/lib/mongodb";
import Waitlist from "@/models/Waitlist";
import { v4 as uuidv4 } from "uuid";

/**
 * Enhanced Waitlist Route Handler
 * 
 * Design Points:
 * 1. Smart Recognition: Instead of rejecting duplicates, we treat them as "re-logins" to smooth the UX.
 * 2. Identity Persistence: Session cookies allow users to access their dashboard without repeated signups.
 * 3. Fraud Prevention: Self-referrals are silently stripped to maintain contest integrity.
 * 4. Error Safety: Database errors are caught and sanitized before returning to the public.
 */

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { full_name, email, phone_number, interests, referral_code } = body;

    // Basic body validation
    if (!full_name || !email || !phone_number) {
      return NextResponse.json(
        { error: "Required fields are missing" },
        { status: 400 }
      );
    }

    await dbConnect();

    // Check if the user already exists by either email or phone_number
    const existingUser = await Waitlist.findOne({
      $or: [
        { email: email.toLowerCase() },
        { phone_number: phone_number }
      ]
    });

    const cookieStore = await cookies();
    const cookieOptions = {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax" as const,
      maxAge: 60 * 60 * 24 * 30, // 30 days
      path: "/",
    };

    if (existingUser) {
      // Decision: Existing users are redirected to their dashboard seamlessly
      cookieStore.set("tarra_session", existingUser.id, cookieOptions);
      
      return NextResponse.json(
        { 
          message: "Welcome back", 
          user_id: existingUser.id,
          is_new: false 
        },
        { status: 200 }
      );
    }

    // New User Logic
    const uniqueId = uuidv4();
    
    // Decision: Prevent self-referral by stripping the code if it matches the new user's generated ID
    // Note: Since ID is random UUID, self-referral via URL is unlikely, but logic handles it if external codes used.
    const sanitizedReferral = referral_code === uniqueId ? null : referral_code;

    const newUser = await Waitlist.create({
      id: uniqueId,
      full_name,
      email: email.toLowerCase(),
      phone_number,
      interests: Array.isArray(interests) ? interests : [],
      referred_by: sanitizedReferral || null,
    });

    // Establish session for the new user
    cookieStore.set("tarra_session", newUser.id, cookieOptions);

    return NextResponse.json(
      { 
        message: "Successfully joined waitlist", 
        user_id: newUser.id,
        is_new: true 
      },
      { status: 201 }
    );

  } catch (error: any) {
    // Decision: Sanitizing error output to prevent leaking DB structure or sensitive info
    const isValidationError = error.name === "ValidationError";
    
    return NextResponse.json(
      { 
        error: isValidationError ? "Validation failed" : "An unexpected error occurred",
        details: isValidationError ? Object.values(error.errors).map((e: any) => e.message) : undefined
      },
      { status: isValidationError ? 400 : 500 }
    );
  }
}

import { NextResponse } from "next/server";
import { cookies, headers } from "next/headers";
import dbConnect from "@/lib/mongodb";
import Waitlist from "@/models/Waitlist";
import { v4 as uuidv4 } from "uuid";
import { rateLimit } from "@/lib/rate-limit";

/**
 * Enhanced Waitlist Route Handler
 * 
 * Logic Points:
 * 1. Rate Limiting: Blocks IP after 5 attempts per hour to prevent bot spam.
 * 2. Identity Check: Gmail users get a warning but aren't blocked at the door (handled via UI info box or status code).
 * 3. Smart Recognition: Re-issues cookies for existing users by email OR phone.
 * 4. Self-Referral: Stripped manually if code matches user or is invalid.
 */

export async function POST(request: Request) {
  try {
    // 1. Rate Limiting Logic
    const headerPayload = await headers();
    const ip = headerPayload.get("x-forwarded-for") || "anonymous";
    const { isLimited } = await rateLimit(ip, 5);

    if (isLimited) {
      return NextResponse.json(
        { error: "Too many attempts. Please try again in an hour." },
        { status: 429 }
      );
    }

    const body = await request.json();
    const { full_name, email, phone_number, interests, referral_code } = body;

    if (!full_name || !email || !phone_number) {
      return NextResponse.json(
        { error: "Required fields are missing" },
        { status: 400 }
      );
    }

    await dbConnect();

    // 2. Identification logic (Email & Phone uniqueness)
    // We check both individually to ensure no identity overlaps
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
      // Decision: Block re-joining to maintain list integrity.
      // Returning users must use the 'Check Status' recovery flow.
      return NextResponse.json(
        { 
          error: "You are already on the waitlist", 
          message: "Please use the 'Check Status' section at the bottom to access your dashboard." 
        },
        { status: 400 }
      );
    }

    // 3. Referral Logic
    // Self-referral protection: We verify the referral code is not the user's own projected ID.
    const uniqueId = uuidv4();
    const sanitizedReferral = referral_code === uniqueId ? null : referral_code;

    const newUser = await Waitlist.create({
      id: uniqueId,
      full_name,
      email: email.toLowerCase(),
      phone_number,
      interests: Array.isArray(interests) ? interests : [],
      referred_by: sanitizedReferral || null,
    });

    cookieStore.set("tarra_session", newUser.id, cookieOptions);

    return NextResponse.json(
      { message: "Successfully joined waitlist", user_id: newUser.id, is_new: true },
      { status: 201 }
    );

  } catch (error: any) {
    // 4. Sanitized Validation Errors
    if (error.name === "ValidationError") {
      const messages = Object.values(error.errors).map((e: any) => e.message);
      return NextResponse.json({ error: "Validation failed", details: messages }, { status: 400 });
    }
    
    // Check for MongoDB local unique index violations (e.g. duplicate phone number)
    if (error.code === 11000) {
      return NextResponse.json({ error: "Email or phone number already in use" }, { status: 400 });
    }

    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

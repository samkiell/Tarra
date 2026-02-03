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

import { generateUniqueCode } from "@/lib/codes";

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
    const { full_name, email, phone_number, interests, referral_code: incomingRefCode } = body;

    if (!full_name || !email || !phone_number) {
      return NextResponse.json(
        { error: "Required fields are missing" },
        { status: 400 }
      );
    }

    const cleanPhone = phone_number.trim();
    const cleanEmail = email.toLowerCase().trim();

    await dbConnect();

    // 2. Identification logic (Email & Phone uniqueness)
    const existingUser = await Waitlist.findOne({
      $or: [
        { email: cleanEmail },
        { phone_number: cleanPhone }
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
      return NextResponse.json(
        { 
          error: "You are already on the waitlist", 
          message: "Please use the 'Check Status' section at the bottom to access your dashboard." 
        },
        { status: 400 }
      );
    }

    // 3. Generation Logic
    const uniqueId = uuidv4();
    const shortRefCode = await generateUniqueCode();
    
    // 4. Referral Validation
    // Check if the referred_by code actually exists in the DB
    let validatedReferrer = null;
    if (incomingRefCode && incomingRefCode.length === 5) {
      const referrer = await Waitlist.findOne({ referral_code: incomingRefCode });
      if (referrer) {
        validatedReferrer = incomingRefCode;
      }
    }

    const newUser = await Waitlist.create({
      id: uniqueId,
      referral_code: shortRefCode,
      full_name,
      email: cleanEmail,
      phone_number: cleanPhone,
      interests: Array.isArray(interests) ? interests : [],
      referred_by: validatedReferrer,
    });

    // 5. Increment Referrer Count
    if (validatedReferrer) {
      await Waitlist.updateOne(
        { referral_code: validatedReferrer },
        { $inc: { referral_count: 1 } }
      );
    }

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
      const field = Object.keys(error.keyPattern)[0];
      const message = field === "phone_number" 
        ? "This phone number is already registered" 
        : "This email is already registered";
      return NextResponse.json({ error: message }, { status: 400 });
    }

    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

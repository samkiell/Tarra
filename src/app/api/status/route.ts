import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import dbConnect from "@/lib/mongodb";
import Waitlist from "@/models/Waitlist";

/**
 * Status Recovery Endpoint
 * 
 * Purpose:
 * This endpoint allows users to recover their "session" using only their phone number. 
 * This is critical for OAU students who often share devices or access the platform 
 * via public Wi-Fi/browsers where persistent storage (cookies/localStorage) may be 
 * cleared or unavailable.
 * 
 * Logic:
 * 1. Authenticate via known phone number.
 * 2. If valid, re-issue the session cookie to grant access to the dashboard.
 * 3. Fail gracefully to encourage new signups without discouraging the user.
 */

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { phone_number } = body;

    if (!phone_number) {
      return NextResponse.json(
        { error: "Phone number is required" },
        { status: 400 }
      );
    }

    await dbConnect();

    // Look for the user by primary phone identity
    const user = await Waitlist.findOne({ phone_number: phone_number.trim() });

    if (!user || user.is_ghost) {
      // Decision: Return a 404 with a gentle message as per documentation.
      // This is not a "system error", it's a "user not found" state.
      return NextResponse.json(
        { 
          found: false, 
          message: "Looks like you’re new. Let’s get you on the list." 
        },
        { status: 404 }
      );
    }

    // Re-issue the session cookie
    const cookieStore = await cookies();
    cookieStore.set("tarra_session", user.id, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 30, // 30 days
      path: "/",
    });

    return NextResponse.json(
      { 
        found: true, 
        message: "Welcome back! Taking you to your dashboard...",
        user_id: user.id 
      },
      { status: 200 }
    );

  } catch (error) {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

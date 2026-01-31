import { NextResponse } from "next/server";
import { cookies } from "next/headers";

/**
 * Lighthouse Authentication API
 * 
 * Logic:
 * 1. Validates the provided PIN against the ADMIN_PIN environment variable.
 * 2. If valid, sets a secure HTTP-only session cookie.
 */
export async function POST(req: Request) {
  try {
    const { pin } = await req.json();
    const ADMIN_PIN = process.env.ADMIN_PIN;

    if (!ADMIN_PIN) {
      return NextResponse.json(
        { error: "Server configuration error: ADMIN_PIN not set" },
        { status: 500 }
      );
    }

    if (pin !== ADMIN_PIN) {
      return NextResponse.json(
        { error: "Invalid Access PIN" },
        { status: 401 }
      );
    }

    // Set a session cookie for the lighthouse audit
    // In a real production app, this should be a signed/encrypted token
    const cookieStore = await cookies();
    cookieStore.set("lighthouse_session", "authorized", {
      httpOnly: true,
      secure: process.env.NODE_ST === "production",
      sameSite: "strict",
      maxAge: 60 * 60 * 2, // 2 hours
      path: "/",
    });

    return NextResponse.json({ success: true, message: "Access Granted" });
  } catch (error) {
    return NextResponse.json(
      { error: "Authentication failed" },
      { status: 500 }
    );
  }
}

import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Waitlist from "@/models/Waitlist";
import { v4 as uuidv4 } from "uuid";

/**
 * Route Handler for Waitlist Signups
 * 
 * Business Logic:
 * 1. Validate the incoming request body for required fields.
 * 2. Connect to the MongoDB database using the cached utility.
 * 3. Check for existing email registrations to prevent duplicates.
 * 4. Generate a unique ID for the new record.
 * 5. Persist the new signup with optional referral data.
 */

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { full_name, email, interests, referral_code } = body;

    // Basic validation to ensure critical data is present
    if (!full_name || !email) {
      return NextResponse.json(
        { error: "Full name and email are required" },
        { status: 400 }
      );
    }

    await dbConnect();

    // Check for existing user to satisfy the unique email constraint
    const existingEntry = await Waitlist.findOne({ email: email.toLowerCase() });
    if (existingEntry) {
      return NextResponse.json(
        { error: "This email is already on the waitlist" },
        { status: 409 }
      );
    }

    // Generate a unique internal ID for the record
    const uniqueId = uuidv4();

    // Create the waitlist record
    // Referral code is passed from the client persistence layer (localStorage)
    const newSignup = await Waitlist.create({
      id: uniqueId,
      full_name,
      email: email.toLowerCase(),
      interests: Array.isArray(interests) ? interests : [],
      referred_by: referral_code || null,
    });

    return NextResponse.json(
      {
        message: "Successfully joined the waitlist",
        data: {
          id: newSignup.id,
          created_at: newSignup.created_at,
        },
      },
      { status: 201 }
    );
  } catch (error: any) {
    // Generic error handling for database failures or malformed requests
    return NextResponse.json(
      { error: "Internal server error", details: error.message },
      { status: 500 }
    );
  }
}

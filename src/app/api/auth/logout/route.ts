import { NextResponse } from "next/server";
import { cookies } from "next/headers";

/**
 * Logout Route Handler
 * 
 * Logic:
 * Destroys the tarra_session cookie to end the user session.
 */
export async function POST() {
  const cookieStore = await cookies();
  cookieStore.delete("tarra_session");
  cookieStore.delete("lighthouse_session");
  
  return NextResponse.json({ success: true });
}

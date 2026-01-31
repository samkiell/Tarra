import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Waitlist from "@/models/Waitlist";

/**
 * Admin Export Route
 * 
 * Business Logic:
 * 1. Verification: Restricted access via a simple bearer token to protect user PII from public access.
 * 2. Aggregation: The system calculates how many times each user's ID appears in other records' 'referred_by' fields.
 * 3. Serialization: Data is converted to a CSV string without external dependencies to maintain a small build size.
 * 4. Response: Streamed as an attachment to trigger a browser download immediately.
 */

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const token = searchParams.get("token");

    // Static token validation to prevent unauthorized data exfiltration
    if (token !== process.env.ADMIN_EXPORT_TOKEN) {
      return NextResponse.json({ error: "Unauthorized access" }, { status: 401 });
    }

    await dbConnect();

    // Aggregates waitlist entries and calculates referral counts
    // Uses a lookup against the same collection to count occurrences of the user's ID
    const data = await Waitlist.aggregate([
      {
        $lookup: {
          from: "waitlists",
          localField: "id",
          foreignField: "referred_by",
          as: "referrals",
        },
      },
      {
        $project: {
          id: 1,
          full_name: 1,
          email: 1,
          interests: 1,
          referred_by: 1,
          created_at: 1,
          referral_count: { $size: "$referrals" },
        },
      },
      { $sort: { created_at: -1 } },
    ]);

    // CSV Header definition
    const headers = ["ID", "Full Name", "Email", "Interests", "Referred By", "Created At", "Referral Count"];
    
    // Rows generation with CSV escape logic
    const rows = data.map((user) => [
      user.id,
      `"${user.full_name.replace(/"/g, '""')}"`,
      user.email,
      `"${user.interests.join(", ").replace(/"/g, '""')}"`,
      user.referred_by || "",
      user.created_at.toISOString(),
      user.referral_count,
    ]);

    const csvContent = [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");

    // Returns the CSV with the appropriate headers for spreadsheet compatibility
    return new NextResponse(csvContent, {
      headers: {
        "Content-Type": "text/csv; charset=utf-8",
        "Content-Disposition": `attachment; filename="tarra_waitlist_export_${Date.now()}.csv"`,
      },
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: "Export failed", details: error.message },
      { status: 500 }
    );
  }
}

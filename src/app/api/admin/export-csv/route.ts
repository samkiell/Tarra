import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import dbConnect from "@/lib/mongodb";
import Waitlist from "@/models/Waitlist";

export const dynamic = "force-dynamic";

/**
 * Admin CSV Export Action
 * 
 * Logic:
 * 1. Security: Strict validation of lighthouse_session cookie.
 * 2. Data Retrieval: Fetches all waitlist records (lean) for efficiency.
 * 3. Aggregation: Calculates referral counts efficiently.
 * 4. Formatting: Generates Excel-compatible CSV with BOM.
 * 
 * Operational Intent:
 * Enables the ops team to perform bulk analysis in Excel/Sheets without direct DB access.
 * CSV is preferred over JSON because it is natively supported by spreadsheet software
 * used by non-technical stakeholders.
 */
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const minReferrals = parseInt(searchParams.get('min_referrals') || '0');
  const filterReferrer = searchParams.get('referred_by');
  const startDate = searchParams.get('start_date');
  const endDate = searchParams.get('end_date');

  const cookieStore = await cookies();
  const session = cookieStore.get("lighthouse_session");

  // 1. Security Check
  if (!session || session.value !== "authorized") {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  await dbConnect();

  // 2. Data Aggregation
  // Operational Intent: Launch teams use this to identify "Super Referrers" (min_referrals filter)
  // for VIP onboarding or analyzing specific influencer campaigns (referred_by filter).
  
  const referralCounts = await Waitlist.aggregate([
    { $match: { referred_by: { $ne: null }, is_ghost: { $ne: true } } },
    { $group: { _id: "$referred_by", count: { $sum: 1 } } }
  ]);

  const countMap = new Map();
  referralCounts.forEach(r => countMap.set(r._id, r.count));

  // Build secure query object
  const query: any = {};
  
  if (filterReferrer) {
    query.referred_by = filterReferrer;
  }
  
  if (startDate || endDate) {
    query.created_at = {};
    if (startDate) query.created_at.$gte = new Date(startDate);
    // Adjust end date to include the full day
    if (endDate) {
      const date = new Date(endDate);
      date.setHours(23, 59, 59, 999);
      query.created_at.$lte = date;
    }
  }

  // 3. User & Referrer Retrieval (Optimized with Lookup)
  const usersWithReferrers = await Waitlist.aggregate([
    { $match: { ...query, is_ghost: { $ne: true } } },
    {
      $lookup: {
        from: "waitlists",
        localField: "referred_by",
        foreignField: "referral_code",
        as: "referrer_data"
      }
    },
    {
      $addFields: {
        referrer_email: { $arrayElemAt: ["$referrer_data.email", 0] }
      }
    },
    { $sort: { created_at: -1 } }
  ]);

  // 4. CSV Generation
  const headers = ["full_name,email,phone_number,referral_count,referred_by_code,referrer_email,created_at"];
  
  const csvRows: string[] = [];

  for (const user of usersWithReferrers) {
    const count = countMap.get(user.referral_code) || 0;
    
    if (count < minReferrals) {
      continue;
    }

    const cleanName = user.full_name?.replace(/"/g, '""') || "";
    const referredEmail = user.email || "";
    const cleanPhone = user.phone_number || ""; 
    const referredByCode = user.referred_by || "";
    const referrerEmail = user.referrer_email || "DIRECT";
    const createdAt = user.created_at ? new Date(user.created_at).toISOString() : "";

    csvRows.push(
      `"${cleanName}","${referredEmail}","${cleanPhone}",${count},"${referredByCode}","${referrerEmail}","${createdAt}"`
    );
  }

  const csvContent = headers.concat(csvRows).join("\n");
  
  const bom = "\uFEFF";
  const finalCsv = bom + csvContent;

  return new NextResponse(finalCsv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="tarra_audit_export_${new Date().toISOString().split('T')[0]}.csv"`,
    },
  });
}

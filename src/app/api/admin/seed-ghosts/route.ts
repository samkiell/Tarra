import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import dbConnect from "@/lib/mongodb";
import Waitlist from "@/models/Waitlist";
import { v4 as uuidv4 } from "uuid";

export const dynamic = "force-dynamic";

/**
 * Ghost User Seeding Tool
 * 
 * Logic Requirements:
 * 1. Security: authorized via lighthouse_session.
 * 2. Capacity: 20 ghost users.
 * 3. Distribution: 
 *    - Top 10: 40-60 referrals.
 *    - Bottom 10: 15-30 referrals.
 */
export async function POST(request: Request) {
  try {
    const cookieStore = await cookies();
    const session = cookieStore.get("lighthouse_session");

    if (!session || session.value !== "authorized") {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    await dbConnect();

    // Clear existing ghost users to prevent duplication
    await Waitlist.deleteMany({ is_ghost: true });

    const ghostNames = [
      "Oluwaseun A.", "Chidi O.", "Fatima B.", "Adebayo S.", "Ezekiel M.", 
      "Blessing J.", "Ibrahim K.", "Zainab T.", "Tunde R.", "Ngozi E.",
      "Ayo D.", "Bisi L.", "Umar P.", "Kelechi W.", "Sade V.",
      "Musa Q.", "Ifunanya G.", "Kayode H.", "Amaka N.", "Yusuf X."
    ];

    const ghosts = [];

    for (let i = 0; i < ghostNames.length; i++) {
      let referral_count = 0;
      if (i < 10) {
        // Top 10: 40-60
        referral_count = Math.floor(Math.random() * (60 - 40 + 1)) + 40;
      } else {
        // Bottom 10: 15-30
        referral_count = Math.floor(Math.random() * (30 - 15 + 1)) + 15;
      }

      ghosts.push({
        id: uuidv4(),
        referral_code: `GHOST${i}`,
        full_name: ghostNames[i],
        email: `ghost${i}@student.oauife.edu.ng`,
        phone_number: `080${Math.floor(Math.random() * 90000000 + 10000000)}`,
        interests: ["Buyer", "Seller"],
        referral_count,
        is_ghost: true,
      });
    }

    await Waitlist.insertMany(ghosts);

    return NextResponse.json({ 
      success: true, 
      message: `Successfully seeded 20 ghost users.`,
      summary: {
        total: 20,
        ranges: ["10 users (40-60)", "10 users (15-30)"]
      }
    });

  } catch (error: any) {
    return NextResponse.json({ error: "Seeding failed", details: error.message }, { status: 500 });
  }
}

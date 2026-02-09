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

    const counts: number[] = [];
    for (let i = 0; i < 10; i++) {
        counts.push(Math.floor(Math.random() * (69 - 22 + 1)) + 22);
    }
    for (let i = 0; i < 10; i++) {
        counts.push(Math.floor(Math.random() * (21 - 7 + 1)) + 7);
    }
    counts.sort((a, b) => b - a);

    const ghosts = [];

    for (let i = 0; i < ghostNames.length; i++) {
      ghosts.push({
        id: uuidv4(),
        referral_code: `GHOST${i}`,
        full_name: ghostNames[i],
        email: `ghost${i}@student.oauife.edu.ng`,
        phone_number: `080${Math.floor(Math.random() * 90000000 + 10000000)}`,
        interests: ["Buyer", "Seller"],
        referral_count: counts[i],
        is_ghost: true,
      });
    }

    await Waitlist.insertMany(ghosts);

    return NextResponse.json({ 
      success: true, 
      message: `Successfully seeded 20 ghost users.`,
      summary: {
        total: 20,
        ranges: ["10 users (22-69)", "10 users (7-21)"]
      }
    });

  } catch (error: any) {
    return NextResponse.json({ error: "Seeding failed", details: error.message }, { status: 500 });
  }
}

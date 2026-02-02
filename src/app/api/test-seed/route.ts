import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Waitlist from "@/models/Waitlist";
import { v4 as uuidv4 } from "uuid";
import { generateUniqueCode } from "@/lib/codes";

export async function GET(request: Request) {
  // Simple token check to prevent random resets
  const { searchParams } = new URL(request.url);
  const token = searchParams.get("token");
  
  if (token !== "seed123") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    await dbConnect();

    const nigerianNames = [
      "Tunde Oladipo",
      "Femi Balogun",
      "Chioma Adebayo",
      "Aisha Bello",
      "Sola Popoola",
      "Emeka Obi",
      "Zainab Musa",
      "Babajide Sowore",
      "Ifeoluwa Daniel",
      "Opeyemi Ayinde"
    ];

    const seedUsers = [];
    const seedReferrals = [];

    for (let i = 0; i < nigerianNames.length; i++) {
        const name = nigerianNames[i];
        const referralCode = await generateUniqueCode();
        const userId = uuidv4();
        
        // Create the Top Referrer
        const referrer = {
            id: userId,
            referral_code: referralCode,
            full_name: name,
            email: `seed_${i}_${referralCode}@student.oauife.edu.ng`,
            phone_number: `080${Math.floor(10000000 + Math.random() * 90000000)}`,
            interests: ["Buyer", "Seller"],
            referred_by: null,
            created_at: new Date()
        };
        seedUsers.push(referrer);

        // Create the children referrals
        const referralCount = Math.floor(Math.random() * (50 - 15 + 1)) + 15;
        
        for (let j = 0; j < referralCount; j++) {
            const refUserId = uuidv4();
            const refRefCode = await generateUniqueCode();
            seedReferrals.push({
                id: refUserId,
                referral_code: refRefCode,
                full_name: `Student ${i}_${j}`,
                email: `student_${i}_${j}_${refRefCode}@student.oauife.edu.ng`,
                phone_number: `090${Math.floor(10000000 + Math.random() * 90000000)}`,
                interests: ["Buyer"],
                referred_by: referralCode,
                created_at: new Date()
            });
        }
    }

    // Use insertMany for efficiency
    await Waitlist.insertMany([...seedUsers, ...seedReferrals]);

    return NextResponse.json({ 
        message: "Database seeded successfully",
        referrersCreated: seedUsers.length,
        referralsCreated: seedReferrals.length
    });

  } catch (error: any) {
    console.error("Seed error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Waitlist from "@/models/Waitlist";
import { v4 as uuidv4 } from "uuid";

const GHOST_USERS = [
  { name: "Femi Benson", email: "femi.benson" },
  { name: "Chioma Obi", email: "chioma.obi" },
  { name: "Tunde Balogun", email: "tunde.balogun" },
  { name: "Sola Adeyemi", email: "sola.adeyemi" },
  { name: "Ade Bakare", email: "ade.bakare" },
  { name: "Ifeoma Okoro", email: "ifeoma.okoro" },
  { name: "Emeka Nwosu", email: "emeka.nwosu" },
  { name: "Ngozi Uzor", email: "ngozi.uzor" },
  { name: "Boluwatife Ajayi", email: "bolu.ajayi" },
  { name: "Zainab Musa", email: "zainab.musa" },
];

export async function POST() {
  try {
    await dbConnect();

    // 1. Wipe
    await Waitlist.deleteMany({});

    // 2. Helper for unique code
    const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
    const getCode = () => {
      let code = "";
      for (let i = 0; i < 5; i++) {
        code += chars.charAt(Math.floor(Math.random() * chars.length));
      }
      return code;
    };

    const usedPhones = new Set<string>();
    const generateUniquePhone = (prefix: string) => {
      let phone;
      do {
        phone = `${prefix}${Math.floor(Math.random() * 89999999 + 10000000)}`;
      } while (usedPhones.has(phone));
      usedPhones.add(phone);
      return phone;
    };

    // 3. Seed Ghost Leads
    for (let i = 0; i < GHOST_USERS.length; i++) {
      const lead = GHOST_USERS[i];
      const referralCount = Math.floor(Math.random() * (50 - 15 + 1)) + 15;
      const leadRefCode = getCode();
      
      // Create Lead User
      await Waitlist.create({
        id: uuidv4(),
        referral_code: leadRefCode,
        full_name: lead.name,
        email: `${lead.email}@student.oauife.edu.ng`,
        phone_number: generateUniquePhone("080"),
        interests: ["Seller", "Service Provider"],
        created_at: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000),
      });

      // Create Referred Children for this Lead
      for (let j = 0; j < referralCount; j++) {
        await Waitlist.create({
          id: uuidv4(),
          referral_code: getCode(),
          full_name: `Student ${i}-${j}`,
          email: `${lead.email}.ref${j}.${Math.floor(Math.random() * 1000)}@student.oauife.edu.ng`,
          phone_number: generateUniquePhone("070"),
          interests: ["Buyer"],
          referred_by: leadRefCode,
          created_at: new Date(Date.now() - Math.random() * 3 * 24 * 60 * 60 * 1000),
        });
      }
    }

    return NextResponse.json({ success: true, message: "Wiped and seeded 10 leads with referrals" });
  } catch (error: any) {
    console.error("Seeding error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

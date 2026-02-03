import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Waitlist from "@/models/Waitlist";
import { v4 as uuidv4 } from "uuid";

const GHOST_USERS = [
  { name: "Femi Benson", email: "femi.benson", count: 50 },
  { name: "Chioma Obi", email: "chioma.obi", count: 45 },
  { name: "Tunde Balogun", email: "tunde.balogun", count: 42 },
  { name: "Sola Adeyemi", email: "sola.adeyemi", count: 38 },
  { name: "Ade Bakare", email: "ade.bakare", count: 35 },
  { name: "Ifeoma Okoro", email: "ifeoma.okoro", count: 30 },
  { name: "Emeka Nwosu", email: "emeka.nwosu", count: 28 },
  { name: "Ngozi Uzor", email: "ngozi.uzor", count: 25 },
  { name: "Boluwatife Ajayi", email: "bolu.ajayi", count: 20 },
  { name: "Zainab Musa", email: "zainab.musa", count: 18 },
];

const REAL_USERS_TEST = [
  { name: "Samuel Kiel", email: "sam.kiel", count: 22 }, // Should beat 18 (10th ghost)
  { name: "John Doe", email: "john.doe", count: 19 },   // Should beat 18
  { name: "Low Performance", email: "low.perf", count: 5 }, // Should be hidden
];

export async function POST() {
  try {
    await dbConnect();

    // 1. Wipe everything
    await Waitlist.deleteMany({});

    // 2. Helpers
    const getCode = () => Math.random().toString(36).substring(2, 7).toUpperCase();
    const getPhone = (p: string) => p + Math.floor(10000000 + Math.random() * 90000000);

    // 3. Seed Ghosts
    for (const ghost of GHOST_USERS) {
      await Waitlist.create({
        id: uuidv4(),
        referral_code: getCode(),
        full_name: ghost.name,
        email: `${ghost.email}@student.oauife.edu.ng`,
        phone_number: getPhone("080"),
        interests: ["Seller"],
        referral_count: ghost.count,
        is_ghost: true,
      });
    }

    // 4. Seed Real users for testing
    for (const real of REAL_USERS_TEST) {
      await Waitlist.create({
        id: uuidv4(),
        referral_code: getCode(),
        full_name: real.name,
        email: `${real.email}@student.oauife.edu.ng`,
        phone_number: getPhone("090"),
        interests: ["Buyer"],
        referral_count: real.count,
        is_ghost: false,
      });
    }

    return NextResponse.json({ success: true, message: "Fresh wipe and seed successful. 10 ghosts and 2 qualified real users created." });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

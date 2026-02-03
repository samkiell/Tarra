import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Waitlist from "@/models/Waitlist";

export async function GET() {
  try {
    await dbConnect();
    const count = await Waitlist.countDocuments();
    const ghostCount = await Waitlist.countDocuments({ is_ghost: true });
    const users = await Waitlist.find().limit(5);
    
    return NextResponse.json({ 
      total: count, 
      ghosts: ghostCount,
      sample: users.map(u => ({ name: u.full_name, ghost: u.is_ghost, count: u.referral_count }))
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

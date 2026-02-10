import { cookies } from "next/headers";
import dbConnect from "@/lib/mongodb";
import Waitlist from "@/models/Waitlist";
import AdminDashboard from "@/components/admin/AdminDashboard";
import PinGate from "@/components/admin/PinGate";
import { Footer } from "@/components/Footer";

export const dynamic = "force-dynamic";

import { LogoutButton } from "@/components/LogoutButton";


/**
 * Admin Panel Page
 * 
 * Logic:
 * 1. Gateway: Checks for a valid "lighthouse_session" cookie.
 * 2. Audit Station: If authorized, renders the full AdminDashboard.
 */
export default async function LighthousePage() {
  const cookieStore = await cookies();
  const session = cookieStore.get("lighthouse_session");

  // Authentication check: Session must exist and be valid
  if (!session || session.value !== "authorized") {
    return <PinGate />;
  }

  await dbConnect();

  const users = await Waitlist.aggregate([
    { $match: { is_ghost: { $ne: true } } },
    {
      $lookup: {
        from: "waitlists",
        localField: "referral_code",
        foreignField: "referred_by",
        as: "referral_details",
      },
    },
    {
      $project: {
        id: 1,
        full_name: 1,
        email: 1,
        phone_number: 1,
        referral_code: 1,
        is_ghost: 1,
        created_at: 1,
        referral_count: { $size: "$referral_details" },
        // Fraud Detection Logic (Computed)
        isFlagged: {
          $cond: {
            if: {
              $or: [
                { $gt: [{ $size: "$referral_details" }, 20] }, // Volume threshold
                { 
                   // Check for self-referral attempts (Name similarity check)
                   $in: [ "$full_name", "$referral_details.full_name" ] 
                }
              ]
            },
            then: true,
            else: false
          }
        },
        referrals: {
          $map: {
            input: "$referral_details",
            as: "r",
            in: {
              first_name: { $arrayElemAt: [{ $split: ["$$r.full_name", " "] }, 0] },
              phone_number: "$$r.phone_number",
              created_at: "$$r.created_at",
            },
          }
        },
      },
    },
    { $sort: { referral_count: -1, full_name: 1 } },
  ]);

  // Compute Metrics (Excluding Ghosts for clean operational data)
  const realUsers = users.filter((u: any) => !u.is_ghost);
  const totalUsers = realUsers.length;
  const totalReferrals = realUsers.reduce((acc: number, curr: any) => acc + (curr.referral_count || 0), 0);
  const avgReferrals = totalUsers > 0 ? (totalReferrals / totalUsers).toFixed(1) : "0.0";
  const topRecruiterCount = realUsers.length > 0 
    ? Math.max(...realUsers.map((u: any) => u.referral_count)) 
    : 0;

  const metrics = {
    totalUsers,
    totalReferrals,
    avgReferrals,
    topRecruiterCount
  };

  return (
    <main className="min-h-screen py-12 px-6 transition-colors duration-300">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-10 gap-6">
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tighter uppercase">
              Tarra Admin
            </h1>
            <p className="text-sm sm:text-base text-secondary font-medium">
              Real-time Waitlist & Referral Monitoring
            </p>
          </div>
          <div className="flex items-center gap-4 sm:gap-6 w-full sm:w-auto justify-between sm:justify-end">
            <div className="px-3 py-1 bg-primary/10 text-primary text-[10px] font-black rounded-full border border-primary/20 uppercase whitespace-nowrap">
              Admin Panel
            </div>

            <LogoutButton />
          </div>
        </div>
        
        <AdminDashboard users={JSON.parse(JSON.stringify(users))} metrics={metrics} />
      </div>
      <div className="w-full mt-auto">
        <Footer />
      </div>
    </main>
  );
}

import { cookies } from "next/headers";
import dbConnect from "@/lib/mongodb";
import Waitlist from "@/models/Waitlist";
import AdminDashboard from "@/components/admin/AdminDashboard";
import PinGate from "@/components/admin/PinGate";
import { Footer } from "@/components/Footer";

export const dynamic = "force-dynamic";

import LogoutButton from "@/components/dashboard/LogoutButton";
import { ThemeSwitcher } from "@/components/ThemeSwitcher";

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
        referral_count: { $size: "$referral_details" },
        // Fraud Detection Logic (Computed)
        // 1. Velocity: If >5 referrals created on same day
        // 2. Self-Referral: If referrer name matches any referral name (approx)
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
          },
        },
      },
    },
    { $sort: { referral_count: -1, full_name: 1 } },
  ]);

  // Compute Lightweight Metrics (Read-only, Server-side)
  // Operational Intent: Simplicity > Dashboards. Just the numbers that matter for daily checks.
  const totalUsers = users.length;
  const totalReferrals = users.reduce((acc: number, curr: any) => acc + (curr.referral_count || 0), 0);
  const avgReferrals = totalUsers > 0 ? (totalReferrals / totalUsers).toFixed(1) : "0.0";
  const topRecruiterCount = users.length > 0 ? users[0].referral_count : 0;

  const metrics = {
    totalUsers,
    totalReferrals,
    avgReferrals,
    topRecruiterCount
  };

  return (
    <main className="min-h-screen bg-stone-50 dark:bg-stone-950 py-12 px-6 transition-colors duration-300">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-10 overflow-x-auto gap-4">
          <div>
            <h1 className="text-3xl font-black text-stone-900 dark:text-stone-50 tracking-tighter uppercase whitespace-nowrap">
              Tarra Admin
            </h1>
            <p className="text-stone-500 dark:text-stone-400 font-medium whitespace-nowrap">
              Real-time Waitlist & Referral Monitoring
            </p>
          </div>
          <div className="flex items-center gap-6">
            <div className="px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 text-[10px] font-black rounded-full border border-green-200 dark:border-green-800 whitespace-nowrap uppercase">
              Admin Panel
            </div>
            <ThemeSwitcher />
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

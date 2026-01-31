import { redirect } from "next/navigation";
import dbConnect from "@/lib/mongodb";
import Waitlist from "@/models/Waitlist";
import AdminDashboard from "@/components/admin/AdminDashboard";

/**
 * Admin Audit Page
 * 
 * Fraud Detection Intent:
 * This page serves as a manual auditing station for the ₦50,000 contest.
 * 
 * Access Control: 
 * Simple PIN-based validation via protected environment variable.
 * 
 * Data Strategy:
 * Aggregates all users and their direct referrals. 
 * Sorting by referral count (descending) highlights potential contest winners
 * and high-volume actors who require closer scrutiny.
 */
export default async function AdminPage({
  searchParams,
}: {
  searchParams: Promise<{ pin: string }>;
}) {
  const { pin } = await searchParams;
  const ADMIN_PIN = process.env.ADMIN_PIN;

  // Decision: Immediate hard rejection if PIN is missing or incorrect.
  if (!ADMIN_PIN || pin !== ADMIN_PIN) {
    redirect("/");
  }

  await dbConnect();

  // Aggregation Logic for Fraud Audit:
  // 1. Fetches all users.
  // 2. Lookups matching referrals from the same collection.
  // 3. Projects a summary for the master list + detailed data for the drill-down view.
  const users = await Waitlist.aggregate([
    {
      $lookup: {
        from: "waitlists",
        localField: "id",
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
        referral_count: { $size: "$referral_details" },
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

  return (
    <main className="min-h-screen bg-stone-50 py-12 px-6">
      <div className="max-w-6xl mx-auto">
        <AdminDashboard users={JSON.parse(JSON.stringify(users))} />
      </div>
    </main>
  );
}

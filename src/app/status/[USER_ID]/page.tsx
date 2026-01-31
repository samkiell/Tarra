import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import dbConnect from "@/lib/mongodb";
import Waitlist from "@/models/Waitlist";
import LogoutButton from "@/components/dashboard/LogoutButton";
import CopyLinkButton from "@/components/dashboard/CopyLinkButton";

/**
 * User Dashboard Page (Status)
 * 
 * Logic Requirements:
 * 1. Protection: Verifies session cookie against URL parameter to ensure authorized access.
 * 2. Personalization: Displays first name and "Verified Student" branding.
 * 3. Growth Tracking: Aggregates referral count for the current user.
 * 4. Competitive Context: Lists top performers for the ₦50,000 contest.
 */
export default async function StatusPage({
  params,
}: {
  params: Promise<{ USER_ID: string }>;
}) {
  const { USER_ID } = await params;
  const cookieStore = await cookies();
  const session = cookieStore.get("tarra_session");

  // Authentication check: Session must exist and match the URL ID
  if (!session || session.value !== USER_ID) {
    redirect("/");
  }

  await dbConnect();

  // Fetch current user data
  const user = await Waitlist.findOne({ id: USER_ID });
  if (!user) {
    redirect("/");
  }

  // Aggregate referral data for the current user
  const referralCount = await Waitlist.countDocuments({ referred_by: USER_ID });

  // Compute Leaderboard: Top 10 recruiters
  // Logic: Groups by referral ID and joins with user names
  const leaderboard = await Waitlist.aggregate([
    {
      $match: {
        referred_by: { $ne: null },
      },
    },
    {
      $group: {
        _id: "$referred_by",
        count: { $sum: 1 },
      },
    },
    {
      $lookup: {
        from: "waitlists",
        localField: "_id",
        foreignField: "id",
        as: "referrer",
      },
    },
    { $unwind: "$referrer" },
    {
      $project: {
        firstName: { $arrayElemAt: [{ $split: ["$referrer.full_name", " "] }, 0] },
        count: 1,
      },
    },
    { $sort: { count: -1, firstName: 1 } },
    { $limit: 10 },
  ]);

  const firstName = user.full_name.split(" ")[0];
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://tarra.ng";
  const referralUrl = `${baseUrl}?ref=${user.id}`;

  return (
    <main className="min-h-screen bg-white text-stone-900 px-6 py-12 flex flex-col items-center">
      <div className="w-full max-w-2xl">
        {/* Header Section */}
        <header className="flex justify-between items-start mb-12">
          <div>
            <h1 className="text-2xl font-bold tracking-tight mb-2">
              Hello {firstName}
            </h1>
            <div className="inline-flex items-center px-2 py-1 bg-stone-100 text-stone-600 text-xs font-bold uppercase tracking-wider rounded border border-stone-200">
              Verified Student
            </div>
          </div>
          <LogoutButton />
        </header>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          <div className="p-6 border border-stone-200 rounded-lg">
            <h3 className="text-sm font-medium text-stone-500 mb-1">Referral Count</h3>
            <p className="text-3xl font-bold">You have referred {referralCount} people.</p>
          </div>
        </div>

        {/* Referral Link Section */}
        <section className="mb-16">
          <h2 className="text-lg font-semibold mb-4">Your Referral Link</h2>
          <CopyLinkButton referralUrl={referralUrl} />
          <p className="mt-3 text-sm text-stone-500">
            Share this link to move up the leaderboard and win ₦50,000.
          </p>
        </section>

        {/* Leaderboard Section */}
        <section>
          <h2 className="text-lg font-semibold mb-6">Top 10 recruiters</h2>
          <div className="border border-stone-200 rounded-lg overflow-hidden">
            <table className="w-full text-left">
              <thead className="bg-stone-50 border-b border-stone-200">
                <tr>
                  <th className="px-4 py-3 text-xs font-bold text-stone-500 uppercase tracking-wider">Rank</th>
                  <th className="px-4 py-3 text-xs font-bold text-stone-500 uppercase tracking-wider">Student</th>
                  <th className="px-4 py-3 text-xs font-bold text-stone-500 uppercase tracking-wider text-right">Referrals</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {leaderboard.length > 0 ? (
                  leaderboard.map((item, index) => (
                    <tr key={index}>
                      <td className="px-4 py-4 text-sm text-stone-500">#{index + 1}</td>
                      <td className="px-4 py-4 text-sm font-medium">{item.firstName}</td>
                      <td className="px-4 py-4 text-sm text-stone-900 font-bold text-right">{item.count}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={3} className="px-4 py-8 text-center text-stone-400 text-sm italic">
                      No referrals yet. Be the first to start!
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </main>
  );
}

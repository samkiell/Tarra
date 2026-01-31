import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import dbConnect from "@/lib/mongodb";
import Waitlist from "@/models/Waitlist";
import LogoutButton from "@/components/dashboard/LogoutButton";
import CopyLinkButton from "@/components/dashboard/CopyLinkButton";
import Leaderboard from "@/components/Leaderboard";
import { Footer } from "@/components/Footer";
import { Navbar } from "@/components/Navbar";

export const dynamic = "force-dynamic";

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

  const firstName = user.full_name.split(" ")[0];
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://tarra.ng";
  const referralUrl = `${baseUrl}?ref=${user.id}`;

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar rightContent={<LogoutButton />} />
      <main className="flex-grow bg-white dark:bg-stone-950 text-stone-900 dark:text-stone-50 px-6 py-12 flex flex-col items-center transition-colors duration-300">
      <div className="w-full max-w-2xl">
        {/* Header Section */}
        <header className="flex justify-between items-start mb-12">
          <div>
            <h1 className="text-2xl font-bold tracking-tight mb-2">
              Hello {firstName}
            </h1>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-verification/10 text-verification text-xs font-black uppercase tracking-wider rounded border border-verification/20 transition-all">
              <span className="w-1.5 h-1.5 rounded-full bg-verification animate-pulse" />
              Verified Student
            </div>
          </div>
        </header>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          <div className="p-6 border border-stone-200 dark:border-stone-800 rounded-lg bg-stone-50 dark:bg-stone-900/50 transition-colors">
            <h3 className="text-sm font-medium text-stone-500 dark:text-stone-400 mb-1">Referral Count</h3>
            <p className="text-3xl font-bold">You have referred {referralCount} people.</p>
          </div>
        </div>

        {/* Referral Link Section */}
        <section className="mb-16">
          <h2 className="text-lg font-semibold mb-4">Your Referral Link</h2>
          <CopyLinkButton referralUrl={referralUrl} />
          <p className="mt-3 text-sm text-stone-500 dark:text-stone-400 transition-colors">
            Share this link to move up the leaderboard and win ₦50,000.
          </p>
        </section>

        {/* Leaderboard Section */}
        <section>
          <h2 className="text-lg font-semibold mb-6">Top 10 recruiters</h2>
          <Leaderboard />
        </section>
      </div>
    </main>
    <Footer />
  </div>
  );
}

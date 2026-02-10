import { cookies, headers } from "next/headers";
import { redirect } from "next/navigation";
import dbConnect from "@/lib/mongodb";
import Waitlist from "@/models/Waitlist";
import { LogoutButton } from "@/components/LogoutButton";
import CopyLinkButton from "@/components/dashboard/CopyLinkButton";
import Leaderboard from "@/components/Leaderboard";
import { Footer } from "@/components/Footer";
import { Navbar } from "@/components/Navbar";
import { generateUniqueCode } from "@/lib/codes";
import { CheckCircle2 } from "lucide-react";

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
  let user = await Waitlist.findOne({ id: USER_ID });
  if (!user || user.is_ghost) {
    redirect("/");
  }

  // Legacy Support: Generate code if missing
  if (!user.referral_code) {
    const newCode = await generateUniqueCode();
    user = await Waitlist.findOneAndUpdate(
      { id: USER_ID },
      { $set: { referral_code: newCode } },
      { new: true }
    );
    
    if (!user) {
      redirect("/");
    }
  }

  // Use the numeric referral_count field
  const referralCount = user.referral_count || 0;

  const firstName = user.full_name.split(" ")[0];
  
  // Dynamic host detection for production robustness
  const headerList = await headers();
  const host = headerList.get("host");
  const protocol = host?.includes("localhost") ? "http" : "https";
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL && !process.env.NEXT_PUBLIC_BASE_URL.includes("localhost")
    ? process.env.NEXT_PUBLIC_BASE_URL 
    : `${protocol}://${host}`;
    
  const referralUrl = `${baseUrl}?ref=${user.referral_code}`;

  // Calculate Rank
  const userRank = (await Waitlist.countDocuments({ 
    referral_count: { $gt: referralCount } 
  })) + 1;

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar rightContent={<LogoutButton />} />
      <main className="flex-grow px-6 py-12 flex flex-col items-center transition-colors duration-300">
      <div className="w-full max-w-2xl">
        {/* Header Section */}
        <header className="flex flex-col mb-12">
          <h1 className="text-2xl font-black tracking-tight text-white flex items-center gap-2 mb-2">
            Hello, {firstName} 👋
            <CheckCircle2 className="w-6 h-6 text-primary" strokeWidth={2.5} />
          </h1>
          <p className="text-lg font-bold text-secondary">
            You are currently ranked <span className="text-primary font-black">#{userRank}</span>
          </p>
        </header>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div className="p-6 border border-muted/10 rounded-lg shadow-xl transition-colors">
            <h3 className="text-sm font-medium text-secondary mb-3">Total Invites</h3>
            <p className="text-4xl font-black tracking-tight text-white transition-colors">
              <span className="text-primary">{referralCount}</span> {referralCount === 1 ? "person" : "people"}.
            </p>
          </div>
          <div className="p-6 border border-muted/10 rounded-lg shadow-xl transition-colors">
            <h3 className="text-sm font-medium text-secondary mb-3">Verified Users</h3>
            <p className="text-4xl font-black tracking-tight text-white transition-colors">
              <span className="text-primary">0</span> people.
            </p>
          </div>
        </div>

        <div className="w-full p-4 bg-primary/5 border border-primary/20 rounded-lg mb-12">
          <p className="text-xs leading-relaxed text-secondary font-medium text-center italic">
            “Your referrals become ‘Verified’ when they download the app during Welcome Month (April).”
          </p>
        </div>

        {/* Referral Link Section */}
        <section className="mb-16">
          <h2 className="text-lg font-bold text-white mb-4">Your Referral Link</h2>
          <CopyLinkButton referralUrl={referralUrl} />
          <p className="mt-3 text-sm text-secondary transition-colors leading-relaxed">
            Share this link to move up the leaderboard and win <span className="text-primary font-bold">₦300,000 CASH PRIZE POOL</span>.
          </p>
        </section>

        {/* Leaderboard Section */}
        <section>
          <h2 className="text-lg font-bold text-white mb-6">Top recruiters</h2>
          <Leaderboard userRank={userRank} />
        </section>
      </div>
    </main>
    <Footer />
  </div>
  );
}

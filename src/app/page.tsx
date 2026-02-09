import Hero from "@/components/Hero";
import Features from "@/components/Features";
import Leaderboard from "@/components/Leaderboard";
import StatusCheck from "@/components/StatusCheck";
import { LogoutButton } from "@/components/LogoutButton";


import { Footer } from "@/components/Footer";
import { Navbar } from "@/components/Navbar";
import { cookies, headers } from "next/headers";
import dbConnect from "@/lib/mongodb";
import Waitlist from "@/models/Waitlist";

export const dynamic = "force-dynamic";

/**
 * Tarra Landing Page
 * 
 * Logic Architecture:
 * 1. Entry: Hero section captures student intent (Joining).
 * 2. Education: Features section explains the three core pillars (Marketplace, Brands, Services).
 * 3. Validation: Leaderboard creates social proof and FOMO for the referral contest.
 * 4. Recovery: StatusCheck provides a path for returning users on shared devices.
 * 
 * Persistence:
 * If a session cookie exists, the Hero section shows a Welcome Back state instead of the form.
 */
export default async function Home() {
  const cookieStore = await cookies();
  const session = cookieStore.get("tarra_session");
  const headerList = await headers();
  const host = headerList.get("host");
  const protocol = host?.includes("localhost") ? "http" : "https";
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL && !process.env.NEXT_PUBLIC_BASE_URL.includes("localhost")
    ? process.env.NEXT_PUBLIC_BASE_URL 
    : `${protocol}://${host}`;

  let userData = null;
  
  await dbConnect();
  const realUserCount = await Waitlist.countDocuments({ is_ghost: { $ne: true } });
  const baseCount = parseInt(process.env.NEXT_PUBLIC_WAITLIST_BASE_COUNT || "0", 10);
  const totalJoined = realUserCount + baseCount;

  if (session) {
    const user = await Waitlist.findOne({ id: session.value });
    
    if (user) {
      const referralCount = user.referral_count || 0;
      
      // Calculate Rank based on the numeric referral_count field across ALL users (real and ghost)
      const higherReferrersCount = await Waitlist.countDocuments({ 
        referral_count: { $gt: referralCount } 
      });
      const rank = higherReferrersCount + 1;

      userData = {
        firstName: user.full_name.split(" ")[0],
        referralCount,
        rank,
        referralUrl: `${baseUrl}?ref=${user.referral_code}`,
      };
    }
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar rightContent={userData ? <LogoutButton /> : null} />

      {/* Main Content Sections */}
      <main className="flex-grow">
        <section id="join-section">
          <Hero userData={userData} totalJoined={totalJoined} />
        </section>
        
        <Features />
        
        {/* Leaderboard and Status Recovery Section */}
        <section id="leaderboard-section" className="py-6 sm:py-10 transition-colors scroll-mt-24 border-t border-muted/5">
          <div className="container mx-auto px-6">
            <div className="max-w-4xl mx-auto">
              <div className="text-center mb-6 sm:mb-8">
                <h2 className="text-3xl font-bold text-white mb-4 transition-colors">
                  Leaderboard
                </h2>
                <p className="text-secondary max-w-md mx-auto transition-colors leading-relaxed">
                  Top Referrers competing for the ₦50,000 Prize Pool.
                </p>
              </div>
              
              <Leaderboard />
              
              {/* Recovery Path for Students on Shared Devices */}
              <div id="status-section" className="mt-8 sm:mt-12 scroll-mt-24">
                <StatusCheck />
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

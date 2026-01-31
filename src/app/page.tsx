import Hero from "@/components/Hero";
import Features from "@/components/Features";
import Leaderboard from "@/components/Leaderboard";
import StatusCheck from "@/components/StatusCheck";
import { ThemeSwitcher } from "@/components/ThemeSwitcher";
import { Footer } from "@/components/Footer";

/**
 * Tarra Landing Page
 * 
 * Logic Architecture:
 * 1. Entry: Hero section captures student intent (Joining).
 * 2. Education: Features section explains the three core pillars (Marketplace, Brands, Services).
 * 3. Validation: Leaderboard creates social proof and FOMO for the referral contest.
 * 4. Recovery: StatusCheck provides a path for returning users on shared devices.
 * 
 * SEO Requirements:
 * Uses the title and description mandated in the documentation.
 */
export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Navbar Placeholder */}
      <nav className="border-b border-stone-100 dark:border-stone-800 py-4 bg-white/80 dark:bg-stone-950/80 backdrop-blur-md sticky top-0 z-50 transition-colors">
        <div className="container mx-auto px-6 flex justify-between items-center">
          <div className="text-xl font-black tracking-tighter text-stone-900 dark:text-stone-50">
            TARRA
          </div>
          <div className="flex items-center gap-6">
            <div className="hidden sm:block text-xs font-bold text-stone-400 dark:text-stone-500 uppercase tracking-widest">
              OAU Edition
            </div>
            <ThemeSwitcher />
          </div>
        </div>
      </nav>

      {/* Main Content Sections */}
      <main className="flex-grow">
        <section id="join-section">
          <Hero />
        </section>
        <Features />
        
        {/* Leaderboard and Status Recovery Section */}
        <section className="py-24 bg-white dark:bg-stone-950 transition-colors">
          <div className="container mx-auto px-6">
            <div className="max-w-4xl mx-auto">
              <div className="text-center mb-16">
                <h2 className="text-3xl font-bold text-stone-900 dark:text-stone-50 mb-4 transition-colors">
                  Leaderboard
                </h2>
                <p className="text-stone-500 dark:text-stone-400 max-w-md mx-auto transition-colors">
                  Grow the community and win up to ₦50,000. Current top performers in the referral contest.
                </p>
              </div>
              
              <Leaderboard />
              
              {/* Recovery Path for Students on Shared Devices */}
              <div id="status-section" className="mt-20 scroll-mt-24">
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

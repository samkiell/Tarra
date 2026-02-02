import React from "react";
import Image from "next/image";
import WaitlistForm from "./WaitlistForm";
import WelcomeBackCard from "./dashboard/WelcomeBackCard";

interface HeroProps {
  userData?: {
    firstName: string;
    referralCount: number;
    rank: number;
    referralUrl: string;
  } | null;
  totalJoined: number;
}

/**
 * Hero Component
 * 
 * Logic:
 * 1. Visual Anchor: Uses the official Tarra logo from assets.
 * 2. Conversion: Houses the WaitlistForm for immediate student capture.
 * 3. Persistence: Displays WelcomeBackCard for returning users with valid sessions.
 */
const Hero: React.FC<HeroProps> = ({ userData, totalJoined }) => {
  return (
    <section className="relative w-full pt-16 pb-16 lg:pt-24 lg:pb-24 overflow-hidden transition-colors">
      <div className="container relative z-10 mx-auto px-6">
        <div className="flex flex-col lg:flex-row items-center gap-16">
          <div className="lg:w-1/2 flex flex-col items-center lg:items-start text-center lg:text-left">
            <div className="mb-8 p-1">
              <Image 
                src="/assets/favicon.jpeg" 
                alt="Tarra Logo" 
                width={72} 
                height={72} 
                className="w-16 h-16 object-contain"
              />
            </div>

            <h1 className="text-4xl md:text-5xl font-black text-stone-900 dark:text-stone-50 leading-tight mb-6 tracking-tight transition-colors">
              OAU Commerce. Without the Chaos.
            </h1>

            <p className="text-lg text-stone-600 dark:text-stone-300 font-medium mb-6 transition-colors">
              Buy and sell products, discover campus brands, and book essential services.
            </p>

            <p className="text-stone-500 dark:text-stone-400 mb-8 max-w-lg leading-relaxed transition-colors">
              Official Marketplace for OAU students. Join the waitlist today to get exclusive early access and win N50,000.
            </p>
            
            {!userData && (
              <div className="flex items-center gap-3 py-2 px-4 bg-stone-50 dark:bg-stone-900 border border-stone-100 dark:border-stone-800 rounded text-stone-500 dark:text-stone-400 text-xs font-semibold uppercase tracking-wider transition-colors">
                <span className="w-2 h-2 rounded-full bg-primary" />
                Over {totalJoined.toLocaleString()} students joined
              </div>
            )}
          </div>

          <div className="lg:w-1/2 w-full flex justify-center">
            {userData ? (
              <WelcomeBackCard {...userData} />
            ) : (
              <WaitlistForm />
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;

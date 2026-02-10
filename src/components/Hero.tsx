"use client";

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
 * 1. Visual Anchor: Uses the Tarra logo from assets.
 * 2. Conversion: Houses the WaitlistForm for immediate student capture.
 * 3. Persistence: Displays WelcomeBackCard for returning users with valid sessions.
 */
const Hero: React.FC<HeroProps> = ({ userData, totalJoined }) => {
  return (
    <section className="relative w-full overflow-hidden transition-colors pt-12 pb-10 sm:pt-20 sm:pb-16">
      <div className="container relative z-10 mx-auto px-6">
        <div className="flex flex-col items-center gap-10 md:gap-16 text-center">
          <div className="flex flex-col items-center max-w-4xl w-full">
            <div className="mb-8">
              <Image 
                src="/assets/logo_nobg2.png" 
                alt="Tarra Logo" 
                width={128} 
                height={128} 
                className="w-32 h-32 object-contain brightness-110"
                priority
              />
            </div>

            {userData ? (
              <div className="w-full max-w-xl animate-in fade-in slide-in-from-bottom-4 duration-1000">
                <WelcomeBackCard {...userData} />
              </div>
            ) : (
              <>
                <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black text-white leading-[1.1] mb-6 tracking-tight transition-colors">
                  OAU Commerce. <br className="hidden sm:block"/> Without the Chaos.
                </h1>

                <p className="text-lg sm:text-xl md:text-2xl text-secondary font-medium mb-10 max-w-2xl transition-colors leading-relaxed">
                  The verified marketplace. Join the waitlist for the <span className="text-primary font-bold">₦300,000 CASH PRIZE POOL</span>.
                </p>
                
                {/* Prize Breakdown Section */}
                <div className="w-full max-w-2xl bg-dark/40 border border-muted/10 rounded-2xl p-6 sm:p-8 mb-12 text-left transition-colors backdrop-blur-sm shadow-2xl">
                  <h3 className="text-sm font-black text-primary uppercase tracking-[0.2em] mb-6 border-b border-muted/10 pb-4">Prize Pool Distribution</h3>
                  <div className="flex flex-col gap-y-4 max-w-sm">
                    <div className="flex items-center text-base border-b border-muted/5 pb-2">
                      <span className="text-white font-semibold w-36 shrink-0">🥇 1st Place</span>
                      <span className="text-primary font-black whitespace-nowrap">₦100,000</span>
                    </div>
                    <div className="flex items-center text-base border-b border-muted/5 pb-2">
                      <span className="text-white font-semibold w-36 shrink-0">🥈 2nd Place</span>
                      <span className="text-primary font-black whitespace-nowrap">₦70,000</span>
                    </div>
                    <div className="flex items-center text-base border-b border-muted/5 pb-2">
                      <span className="text-white font-semibold w-36 shrink-0">🥉 3rd Place</span>
                      <span className="text-primary font-black whitespace-nowrap">₦40,000</span>
                    </div>
                    <div className="flex items-center text-base border-b border-muted/5 pb-2">
                      <span className="text-white font-semibold w-36 shrink-0">🏅 4th–10th</span>
                      <span className="text-secondary font-black text-sm whitespace-nowrap">₦10,000 each</span>
                    </div>
                    <div className="flex items-center text-base border-b border-muted/5 pb-2">
                      <span className="text-white font-semibold w-36 shrink-0">🎖 11th–20th</span>
                      <span className="text-secondary font-black text-sm whitespace-nowrap">₦2,000 each</span>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center gap-3 py-3 px-6 bg-primary/10 border border-primary/20 rounded-full text-primary text-xs font-bold uppercase tracking-widest transition-colors mb-4">
                  <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                  Over {totalJoined.toLocaleString()} students joined
                </div>

                <div className="w-full max-w-xl flex justify-center mt-10">
                  <WaitlistForm />
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;

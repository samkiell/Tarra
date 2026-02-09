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
    <section className="relative w-full overflow-hidden transition-colors">
      <div className="container relative z-10 mx-auto">
        <div className="flex flex-col items-center gap-6 text-center">
          <div className="flex flex-col items-center max-w-3xl">
            <div>
              <Image 
                src="/assets/logo_nobg2.png" 
                alt="Tarra Logo" 
                width={100} 
                height={100} 
                className="w-68 h-100 object-contain"
                priority
              />
            </div>

            <h1 className="text-3xl mx-2 sm:text-4xl md:text-5xl lg:text-6xl font-black text-white leading-tight mb-3 sm:mb-4 tracking-tight transition-colors">
              OAU Commerce. Without the Chaos.
            </h1>

            <p className="text-base sm:text-lg md:text-xl text-secondary font-medium mb-4 sm:mb-5 transition-colors">
              The verified marketplace. Join the waitlist for the <span className="text-primary font-bold">₦300,000 CASH PRIZE POOL</span>.
            </p>
            
            {/* Prize Breakdown Section */}
            <div className="w-full bg-dark/40 border border-muted/10 rounded-xl p-4 sm:p-5 mb-6 text-left transition-colors">
              <h3 className="text-xs font-bold text-primary uppercase tracking-widest mb-3">Prize Breakdown</h3>
              <div className="grid grid-cols-1 gap-2">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-white font-medium">🥇 1st Place</span>
                  <span className="text-primary font-black">₦100,000</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-white font-medium">🥈 2nd Place</span>
                  <span className="text-primary font-black">₦70,000</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-white font-medium">🥉 3rd Place</span>
                  <span className="text-primary font-black">₦40,000</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-white font-medium">🏅 4th–10th</span>
                  <span className="text-secondary font-bold">₦10,000 each</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-white font-medium">🎖 11th–20th</span>
                  <span className="text-secondary font-bold">₦2,000 each</span>
                </div>
              </div>
            </div>
            
            {!userData && (
              <div className="flex items-center gap-3 py-2 px-4 bg-dark/50 border border-muted/20 rounded text-secondary text-xs font-semibold uppercase tracking-wider transition-colors mb-4">
                <span className="w-2 h-2 rounded-full bg-primary" />
                Over {totalJoined.toLocaleString()} students joined
              </div>
            )}
          </div>

          <div className="w-full max-w-xl flex justify-center">
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

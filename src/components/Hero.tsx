import React from "react";
import { Rocket } from "lucide-react";
import WaitlistForm from "./WaitlistForm";

/**
 * Hero Component
 * 
 * Logic:
 * 1. Visual Anchor: Uses the primary headline and sub-headline from the docs.
 * 2. Conversion: Houses the WaitlistForm for immediate student capture.
 * 3. Branding: Displays the "Verified Student" context and referral contest hook.
 */
const Hero: React.FC = () => {
  return (
    <section className="relative w-full pt-20 pb-20 lg:pt-32 lg:pb-32 overflow-hidden bg-white">
      {/* Decorative patterns */}
      <div className="absolute inset-0 z-0 opacity-[0.03] pointer-events-none">
        <div className="absolute top-0 left-0 w-64 h-64 border border-stone-900 rounded-full -translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 right-0 w-96 h-96 border border-stone-900 rounded-full translate-x-1/3 translate-y-1/3" />
      </div>

      <div className="container relative z-10 mx-auto px-6">
        <div className="flex flex-col lg:flex-row items-center gap-16">
          <div className="lg:w-1/2 flex flex-col items-center lg:items-start text-center lg:text-left">
            <div className="mb-8 w-12 h-12 bg-stone-900 rounded-lg flex items-center justify-center">
              <Rocket className="w-6 h-6 text-white" />
            </div>

            <h1 className="text-4xl md:text-6xl font-black text-stone-900 leading-tight mb-6">
              Everything You Need. All in One Place.
            </h1>

            <p className="text-xl text-stone-600 font-medium mb-6">
              Buy and sell products, discover campus brands, and book essential services.
            </p>

            <p className="text-stone-500 mb-8 max-w-lg leading-relaxed">
              Official Marketplace for OAU students. Join the waitlist today to get exclusive early access and win N50,000.
            </p>
            
            <div className="flex items-center gap-3 py-3 px-4 bg-stone-50 border border-stone-100 rounded-full text-stone-500 text-sm font-medium">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              Over 2,000 students joined this week
            </div>
          </div>

          <div className="lg:w-1/2 w-full flex justify-center">
            <WaitlistForm />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;

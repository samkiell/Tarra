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
    <section className="relative w-full pt-16 pb-16 lg:pt-24 lg:pb-24 overflow-hidden transition-colors">
      <div className="container relative z-10 mx-auto px-6">
        <div className="flex flex-col lg:flex-row items-center gap-16">
          <div className="lg:w-1/2 flex flex-col items-center lg:items-start text-center lg:text-left">
            <div className="mb-6 w-12 h-12 bg-primary rounded-lg flex items-center justify-center transition-all">
              <Rocket className="w-6 h-6 text-white" />
            </div>

            <h1 className="text-4xl md:text-5xl font-black text-stone-900 dark:text-stone-50 leading-tight mb-6 tracking-tight transition-colors">
              Everything You Need. All in One Place.
            </h1>

            <p className="text-lg text-stone-600 dark:text-stone-300 font-medium mb-6 transition-colors">
              Buy and sell products, discover campus brands, and book essential services.
            </p>

            <p className="text-stone-500 dark:text-stone-400 mb-8 max-w-lg leading-relaxed transition-colors">
              Official Marketplace for OAU students. Join the waitlist today to get exclusive early access and win N50,000.
            </p>
            
            <div className="flex items-center gap-3 py-2 px-4 bg-stone-50 dark:bg-stone-900 border border-stone-100 dark:border-stone-800 rounded text-stone-500 dark:text-stone-400 text-xs font-semibold uppercase tracking-wider transition-colors">
              <span className="w-2 h-2 rounded-full bg-primary" />
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

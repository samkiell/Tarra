import React from "react";
import Image from "next/image";


/**
 * Global Footer Component
 * 
 * Logic:
 * Consistent branding and copyright info across all major pages.
 */
export const Footer: React.FC = () => {
  return (
    <footer className="border-t border-muted/10 transition-colors py-12 sm:py-16">
      <div className="container mx-auto px-3 text-center flex flex-col items-center gap-4">
        <Image 
          src="/assets/logo_nobg2.png" 
          alt="Tarra Logo" 
          width={100} 
          height={60} 
          className="w-22 h-22 object-contain opacity-50 hover:opacity-100 transition-opacity grayscale hover:grayscale-0"
        />
        <div className="text-sm font-black text-white uppercase tracking-widest transition-colors">
          Tarra | OAU&apos;s Verified Marketplace
        </div>
        <div className="flex flex-col gap-2">
          <p className="text-xs text-secondary font-medium transition-colors">
            &copy; {new Date().getFullYear()} Built for OAU. All rights reserved.
          </p>
          <p className="text-[10px] text-primary/80 transition-colors uppercase font-black tracking-[0.15em] mt-1">
            Winners paid April (Post-Launch Verification).
          </p>
        </div>
      </div>
    </footer>
  );
};

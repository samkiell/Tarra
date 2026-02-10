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
    <footer className="border-t border-muted/10 transition-colors py-8 sm:py-10">
      <div className="container mx-auto px-3 text-center flex flex-col items-center gap-4">
        <Image 
          src="/assets/logo_nobg2.png" 
          alt="Tarra Logo" 
          width={112} 
          height={112} 
          className="w-28 h-28 object-contain opacity-50 hover:opacity-100 transition-opacity grayscale hover:grayscale-0"
        />
        <div className="text-sm font-black text-white uppercase tracking-widest transition-colors">
          Tarra | OAU&apos;s Verified Marketplace
        </div>
        <div className="flex flex-col gap-2">
          <p className="text-xs text-secondary font-medium transition-colors">
            &copy; {new Date().getFullYear()} Built for OAU. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

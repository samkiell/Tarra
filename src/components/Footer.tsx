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
    <footer className="py-12 border-t border-muted/10 transition-colors">
      <div className="container mx-auto px-6 text-center flex flex-col items-center gap-4">
        <Image 
          src="/assets/favicon_nobg.png" 
          alt="Tarra Logo" 
          width={80} 
          height={28} 
          className="h-6 w-auto opacity-50 hover:opacity-100 transition-opacity grayscale-0"
        />
        <div className="text-sm font-bold text-white transition-colors">
          Tarra | The Official OAU Marketplace
        </div>
        <p className="text-xs text-secondary transition-colors">
          &copy; {new Date().getFullYear()} built for OAU. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

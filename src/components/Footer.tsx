import React from "react";
import Image from "next/image";
import Link from "next/link";

/**
 * Global Footer Component
 * 
 * Logic:
 * Consistent branding and copyright info across all major pages.
 */
export const Footer: React.FC = () => {
  return (
    <footer className="py-8 border-t border-muted/10 transition-colors">
      <div className="container px-2 text-center flex flex-col items-center gap-4">
        <Image 
          src="/assets/logo_nobg2.png" 
          alt="Tarra Logo" 
          width={100} 
          height={100} 
          className="h-10 sm:h-12 w-auto opacity-70 hover:opacity-100 transition-opacity"
        />
        <div className="text-sm font-bold text-white transition-colors">
          Tarra | The Official OAU Marketplace
        </div>
        <p className="text-xs text-secondary transition-colors">
          &copy; {new Date().getFullYear()} built for OAU. All rights reserved.
        </p>
        <p className="text-xs text-secondary transition-colors italic">
            Developed by 
            <Link
              href='https://samkiel.dev'
              className="ml-1 text-primary hover:text-white transition-colors font-bold not-italic"
              target="_blank"
            >
              SAMKIEL
            </Link>
        </p>  
      </div>
    </footer>
  );
};

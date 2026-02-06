import React from "react";
import Image from "next/image";
import { Link } from "next/link";

/**
 * Global Footer Component
 * 
 * Logic:
 * Consistent branding and copyright info across all major pages.
 */
export const Footer: React.FC = () => {
  return (
    <footer className="py-12 border-t border-muted/10 transition-colors">
      <div className="container px-2 text-center flex flex-col items-center gap-4">
        <Image 
          src="/assets/logo_nobg2.png" 
          alt="Tarra Logo" 
          width={120} 
          height={40} 
          className="h-15 w-auto opacity-70 hover:opacity-100 transition-opacity"
        />
        <div className="text-sm font-bold text-white transition-colors">
          Tarra | The Official OAU Marketplace
        </div>
        <p className="text-xs text-secondary transition-colors">
          &copy; {new Date().getFullYear()} built for OAU. All rights reserved.
        </p>
        <p className="text-x text-tertiary transition-colors">
            Developed by 
            <Link
            href='https://samkiel.dev'
            >
            SAMKIEL
            </Link>
        </p>
      </div>
    </footer>
  );
};

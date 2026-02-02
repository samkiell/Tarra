import React from "react";
import Link from "next/link";
import Image from "next/image";


/**
 * Global Navbar Component
 * 
 * Logic:
 * Consistent navigation and theme switching across the app.
 */
interface NavbarProps {
  rightContent?: React.ReactNode;
}

export const Navbar: React.FC<NavbarProps> = ({ rightContent }) => {
  return (
    <nav className="border-b border-muted/10 py-4 sticky top-0 z-50 transition-colors">
      <div className="container mx-auto px-6 flex justify-between items-center">
        <Link href="/" className="hover:opacity-80 transition-opacity">
          <Image 
            src="/assets/favicon_nobg.png" 
            alt="Tarra Logo" 
            width={120} 
            height={40} 
            className="h-10 sm:h-14 w-auto p-0 m-0 rounded-sm"
            priority
          />
        </Link>
        <div className="flex items-center gap-6">
          {rightContent}
          <div className="block text-[10px] sm:text-xs font-bold text-secondary uppercase tracking-widest whitespace-nowrap">
            OAU Edition
          </div>

        </div>
      </div>
    </nav>
  );
};

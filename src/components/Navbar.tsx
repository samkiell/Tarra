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
    <header>
      <nav className="border-b border-muted/10 py-2 sticky top-0 z-50 transition-colors">
        <div className="container mx-auto px-6 flex justify-between items-center">
          <Link href="/" className="hover:opacity-80 transition-opacity">
            <Image 
              src="/assets/favicon_nobg.png" 
              alt="Tarra Logo" 
              width={50} 
              height={50} 
              className=" pt-0 h-29 w-auto"
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
    </header>
  );
};

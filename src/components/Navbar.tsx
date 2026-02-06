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
    <header className="sticky top-0 z-50 w-full border-b border-muted/10 bg-dark/80 backdrop-blur-md transition-all">
      <nav className="py-1 transition-colors">
        <div className="container mx-auto px-6 flex justify-between items-center">
          <Link href="/" className="hover:opacity-80 transition-opacity">
            <Image 
              src="/assets/favicon_nobg.png" 
              alt="Tarra Logo" 
              width={50} 
              height={50} 
              className="h-8 w-auto"
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

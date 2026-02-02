import React from "react";
import Link from "next/link";
import Image from "next/image";
import { ThemeSwitcher } from "./ThemeSwitcher";

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
    <nav className="border-b border-stone-100 dark:border-stone-800 py-4 bg-white dark:bg-stone-950 sticky top-0 z-50 transition-colors">
      <div className="container mx-auto px-6 flex justify-between items-center">
        <Link href="/" className="hover:opacity-80 transition-opacity">
          <Image 
            src="/assets/favicon_nobg.png" 
            alt="Tarra Logo" 
            width={120} 
            height={40} 
            className="h-8 w-auto rounded-sm"
            priority
          />
        </Link>
        <div className="flex items-center gap-6">
          {rightContent}
          <div className="hidden sm:block text-xs font-bold text-stone-400 dark:text-stone-500 uppercase tracking-widest">
            OAU Edition
          </div>
          <ThemeSwitcher />
        </div>
      </div>
    </nav>
  );
};

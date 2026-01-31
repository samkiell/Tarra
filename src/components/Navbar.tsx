import React from "react";
import Link from "next/link";
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
    <nav className="border-b border-stone-100 dark:border-stone-800 py-4 bg-white/80 dark:bg-stone-950/80 backdrop-blur-md sticky top-0 z-50 transition-colors">
      <div className="container mx-auto px-6 flex justify-between items-center">
        <Link href="/" className="text-xl font-black tracking-tighter text-primary hover:opacity-80 transition-opacity">
          TARRA
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

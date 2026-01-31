import React from "react";

/**
 * Global Footer Component
 * 
 * Logic:
 * Consistent branding and copyright info across all major pages.
 */
export const Footer: React.FC = () => {
  return (
    <footer className="py-12 border-t border-stone-100 dark:border-stone-800 bg-white dark:bg-stone-950 transition-colors">
      <div className="container mx-auto px-6 text-center">
        <div className="text-sm font-bold text-stone-900 dark:text-stone-50 mb-2 transition-colors">
          Tarra | The Official OAU Marketplace
        </div>
        <p className="text-xs text-stone-400 dark:text-stone-500 transition-colors">
          &copy; {new Date().getFullYear()} built for OAU. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

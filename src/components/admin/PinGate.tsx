"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Lock, Zap } from "lucide-react";
import { toast } from "react-hot-toast";

/**
 * PinGate Component
 * 
 * Logic:
 * 1. Modal overlay for unauthorized access to /lighthouse.
 * 2. Collects the ADMIN_PIN from the user.
 * 3. Appends the PIN to the URL as a query parameter to trigger server-side re-render.
 */
const PinGate: React.FC = () => {
  const [pin, setPin] = useState("");
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!pin) return;

    // We simple push to the same page with the pin as a query param
    // The server component will then validate and show the dashboard or error.
    router.push(`/lighthouse?pin=${pin}`);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-white dark:bg-stone-950 px-6">
      <div className="w-full max-w-sm">
        <div className="text-center mb-10">
          <div className="w-16 h-16 bg-stone-900 dark:bg-stone-100 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-xl">
            <Lock className="w-8 h-8 text-white dark:text-stone-900" />
          </div>
          <h1 className="text-2xl font-black text-stone-900 dark:text-stone-50 tracking-tighter uppercase mb-2">
            Lighthouse
          </h1>
          <p className="text-stone-500 dark:text-stone-400 text-sm font-medium">
            Administrative Access Protocol
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative">
            <input
              type="password"
              autoFocus
              className="w-full px-4 py-4 bg-stone-100 dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-xl text-center text-2xl tracking-[1em] font-black text-stone-900 dark:text-stone-50 focus:outline-none focus:ring-2 focus:ring-stone-900 dark:focus:ring-stone-100 transition-all"
              placeholder="••••"
              value={pin}
              onChange={(e) => setPin(e.target.value)}
              maxLength={8}
            />
          </div>
          
          <button
            type="submit"
            className="w-full py-4 bg-stone-900 dark:bg-stone-100 text-white dark:text-stone-900 font-black rounded-xl hover:bg-stone-800 dark:hover:bg-white transition-all flex items-center justify-center gap-2 group"
          >
            <Zap className="w-5 h-5 group-hover:animate-pulse" />
            INITIALIZE AUDIT
          </button>
        </form>

        <p className="mt-8 text-center text-xs text-stone-400 dark:text-stone-600 font-bold uppercase tracking-widest">
          Secure Environment
        </p>
      </div>
    </div>
  );
};

export default PinGate;

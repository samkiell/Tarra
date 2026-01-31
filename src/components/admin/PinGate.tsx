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
interface PinGateProps {
  error?: boolean;
}

const PinGate: React.FC<PinGateProps> = ({ error: initialError }) => {
  const [pin, setPin] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!pin || loading) return;

    setLoading(true);
    try {
      const res = await fetch("/api/auth/lighthouse", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pin }),
      });

      const data = await res.json();

      if (res.ok) {
        toast.success("Access Granted", {
          style: {
            borderRadius: '10px',
            background: '#0d9488',
            color: '#fff',
          },
        });
        router.refresh();
      } else {
        toast.error(data.error || "Invalid Access PIN", {
          style: {
            borderRadius: '10px',
            background: '#1c1917',
            color: '#fff',
          },
        });
        setPin("");
      }
    } catch (err) {
      toast.error("Connection failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-white dark:bg-stone-950 px-6">
      <div className="w-full max-w-sm">
        <div className="text-center mb-10">
          <div className="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-xl shadow-primary/20">
            <Lock className="w-8 h-8 text-white" />
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
              className="w-full px-4 py-4 bg-stone-50 dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-xl text-center text-2xl tracking-[1em] font-black text-stone-900 dark:text-stone-50 focus:outline-none focus:ring-2 focus:ring-primary transition-all"
              placeholder="••••"
              value={pin}
              onChange={(e) => setPin(e.target.value)}
              maxLength={8}
            />
          </div>
          
          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 bg-primary text-white font-black rounded-xl hover:brightness-110 active:scale-[0.98] disabled:opacity-50 transition-all flex items-center justify-center gap-2 group shadow-lg shadow-primary/10"
          >
            <Zap className="w-5 h-5 group-hover:animate-pulse" />
            {loading ? "VERIFYING..." : "INITIALIZE AUDIT"}
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

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
  const [error, setError] = useState<string | null>(initialError ? "Access Denied" : null);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!pin || loading) return;

    setLoading(true);
    setError(null);
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
        setError(data.error || "Invalid Access PIN");
        setPin("");
      }
    } catch (err) {
      setError("Connection failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-white dark:bg-stone-950 px-6">
      <div className="w-full max-w-sm">
        <div className="text-center mb-10">
          <div className="w-16 h-16 bg-primary rounded-xl flex items-center justify-center mx-auto mb-6">
            <Lock className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-xl font-bold text-stone-900 dark:text-stone-50 tracking-tight mb-2">
            Lighthouse
          </h1>
          <p className="text-stone-500 dark:text-stone-400 text-sm">
            Administrative Access
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative">
            <input
              type="password"
              autoFocus
              className={`w-full h-14 px-4 bg-stone-50 dark:bg-stone-950 border rounded-lg text-center text-2xl tracking-[0.5em] font-bold text-stone-900 dark:text-stone-200 focus:outline-none focus:ring-1 transition-all placeholder:text-stone-300 ${
                error
                  ? "border-amber-400 focus:ring-amber-500 focus:border-amber-500"
                  : "border-stone-200 dark:border-stone-800 focus:ring-primary focus:border-primary"
              }`}
              placeholder="••••"
              value={pin}
              onChange={(e) => setPin(e.target.value)}
              maxLength={8}
            />
          </div>

          {error && (
            <div className="p-2.5 bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900/50 rounded-md text-[11px] text-amber-700 dark:text-amber-400 leading-snug flex items-center gap-2 transition-all">
              <span className="text-amber-500">⚠️</span>
              {error}
            </div>
          )}
          
          <button
            type="submit"
            disabled={loading}
            className="w-full h-12 bg-primary text-white font-bold rounded-lg hover:brightness-110 active:opacity-90 disabled:opacity-50 transition-all flex items-center justify-center gap-2"
          >
            <Zap className="w-4 h-4" />
            {loading ? "VERIFYING..." : "ACCESS DASHBOARD"}
          </button>
        </form>

        <p className="mt-8 text-center text-xs text-stone-400 dark:text-stone-500 font-semibold uppercase tracking-wider">
          Secure Environment
        </p>
      </div>
    </div>
  );
};

export default PinGate;

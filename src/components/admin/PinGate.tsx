"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Lock, Zap, CheckCircle2 } from "lucide-react";

/**
 * PinGate Component
 * 
 * Logic:
 * 1. Modal overlay for unauthorized access to /lighthouse.
 * 2. Collects the ADMIN_PIN from the user.
 * 3. Verifies via /api/auth/lighthouse and refreshes the page on success.
 */
interface PinGateProps {
  error?: boolean;
}

const PinGate: React.FC<PinGateProps> = ({ error: initialError }) => {
  const [pin, setPin] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
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
        setSuccess(true);
        setTimeout(() => {
            router.refresh();
        }, 1000);
      } else {
        setError(data.error || "Invalid Access PIN");
        setPin("");
      }
    } catch (err) {
      setError("Connection failed");
    } finally {
      if (!success) setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-white dark:bg-stone-950 px-6">
      <div className="w-full max-w-sm">
        <div className="text-center mb-10">
          <div className="w-16 h-16 bg-primary rounded-xl flex items-center justify-center mx-auto mb-6 shadow-lg shadow-primary/20 transition-all">
            {success ? (
              <CheckCircle2 className="w-8 h-8 text-white animate-in zoom-in-50 duration-300" />
            ) : (
              <Lock className="w-8 h-8 text-white" />
            )}
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
              disabled={loading || success}
              className={`w-full h-14 px-4 bg-stone-50 dark:bg-stone-950 border rounded-lg text-center text-2xl tracking-[0.5em] font-bold text-stone-900 dark:text-stone-200 focus:outline-none focus:ring-1 transition-all placeholder:text-stone-300 ${
                success
                  ? "border-teal-500 focus:ring-teal-500 ring-1 ring-teal-500"
                  : error
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
            <div className="p-2.5 bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900/50 rounded-md text-[11px] text-amber-700 dark:text-amber-400 leading-snug flex items-center gap-2 animate-in fade-in slide-in-from-top-1 duration-300">
              <span className="text-amber-500">⚠️</span>
              {error}
            </div>
          )}

          {success && (
            <div className="p-2.5 bg-teal-50 dark:bg-teal-950/20 border border-teal-200 dark:border-teal-900/50 rounded-md text-[11px] text-teal-700 dark:text-teal-400 font-bold leading-snug flex items-center gap-2 animate-in fade-in slide-in-from-top-1 duration-300">
              <span className="text-teal-500">✅</span>
              Access Granted. Opening Dashboard...
            </div>
          )}
          
          <button
            type="submit"
            disabled={loading || success}
            className={`w-full h-12 font-bold rounded-lg transition-all flex items-center justify-center gap-2 shadow-md ${
                success 
                    ? "bg-teal-600 text-white cursor-wait" 
                    : "bg-primary text-white hover:brightness-110 active:opacity-90 disabled:opacity-50"
            }`}
          >
            {success ? null : <Zap className="w-4 h-4" />}
            {success ? "GRANTING ACCESS..." : loading ? "VERIFYING..." : "ACCESS DASHBOARD"}
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

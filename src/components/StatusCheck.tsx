"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";

/**
 * StatusCheck Component
 * 
 * Logic (Shared-device recovery):
 * 1. User enters phone number.
 * 2. System verifies existence.
 * 3. If found, cookie is re-issued and user is redirected to dashboard.
 * 4. If not found, inline helper text is shown.
 */
const StatusCheck: React.FC = () => {
  const router = useRouter();
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<{ type: 'new' | 'general', message: string } | null>(null);

  useEffect(() => {
    // Smart Listen: Auto-fill phone from WaitlistForm
    const handleAutoFill = (e: any) => {
      if (e.detail?.phone) {
        setPhone(e.detail.phone);
        const section = document.getElementById("status-section");
        section?.scrollIntoView({ behavior: "smooth" });
      }
    };

    window.addEventListener("tarra:fill-check", handleAutoFill);
    return () => window.removeEventListener("tarra:fill-check", handleAutoFill);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/status", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone_number: phone }),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success(data.message);
        router.push(`/status/${data.user_id}`);
      } else {
        // Handle user not found with smart redirection
        if (response.status === 404) {
          setError({ type: 'new', message: "Looks like you're new. Let's get you on the list." });
        } else {
          setError({ type: 'general', message: data.message || "Failed to find account." });
        }
      }
    } catch (error) {
      setError({ type: 'general', message: "Connection error." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-sm mx-auto mt-8 text-center">
      <h3 className="text-xs font-bold text-stone-500 dark:text-stone-400 mb-4 uppercase tracking-widest transition-colors">
        Check Status
      </h3>
      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        <div className="flex gap-2">
          <input
            type="tel"
            required
            placeholder="Phone Number"
            className={`flex-grow h-11 px-4 text-sm border rounded-lg text-stone-900 dark:text-stone-200 bg-stone-50 dark:bg-stone-950 focus:outline-none focus:ring-1 transition-all placeholder:text-stone-400 ${
              error 
                ? "border-amber-400 focus:ring-amber-500 focus:border-amber-500" 
                : "border-stone-200 dark:border-stone-800 focus:ring-primary focus:border-primary"
            }`}
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />
          <button
            type="submit"
            disabled={loading}
            className="h-11 px-6 bg-primary text-white text-sm font-bold rounded-lg hover:brightness-110 active:opacity-90 disabled:opacity-50 transition-all flex items-center justify-center shrink-0"
          >
            {loading ? "..." : "Check"}
          </button>
        </div>

        {error && (
          <div className={`p-2.5 border rounded-md text-[11px] leading-snug flex flex-col gap-2 transition-all duration-300 text-left ${
            error.type === 'new' 
              ? "bg-teal-50 dark:bg-teal-950/20 border-teal-200 dark:border-teal-900/50 text-teal-700 dark:text-teal-400"
              : "bg-amber-50 dark:bg-amber-950/20 border-amber-200 dark:border-amber-900/50 text-amber-700 dark:text-amber-400"
          }`}>
            <div className="flex items-center gap-2">
              <span className={error.type === 'new' ? 'text-primary' : 'text-amber-500'}>
                {error.type === 'new' ? 'ℹ️' : '⚠️'}
              </span>
              <p>{error.message}</p>
            </div>
            {error.type === 'new' && (
              <button
                type="button"
                onClick={() => {
                  window.dispatchEvent(new CustomEvent("tarra:fill-join", { 
                    detail: { phone } 
                  }));
                }}
                className="w-full py-2 bg-primary/10 hover:bg-primary/20 text-primary font-bold rounded transition-colors text-center"
              >
                Join the Waitlist
              </button>
            )}
          </div>
        )}
      </form>
    </div>
  );
}

export default StatusCheck;

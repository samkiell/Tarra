"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

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
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
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
    setSuccessMessage(null);

    try {
      const response = await fetch("/api/status", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone_number: phone }),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccessMessage(data.message);
        setTimeout(() => {
            router.push(`/status/${data.user_id}`);
        }, 1500);
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
    <div className="w-full max-w-sm mx-auto mt-8 text-center px-4 sm:px-0">
      <h3 className="text-xs font-bold text-secondary mb-4 uppercase tracking-widest transition-colors">
        Check Status
      </h3>
      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        <div className="flex flex-col sm:flex-row gap-2">
          <input
            type="tel"
            required
            placeholder="Phone Number"
            className={`w-full sm:flex-grow h-11 px-4 text-sm border rounded-lg text-white bg-dark/50 focus:outline-none focus:ring-1 transition-all placeholder:text-secondary/50 ${
              error 
                ? "border-primary focus:ring-primary" 
                : "border-muted/20 focus:ring-primary focus:border-primary"
            }`}
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />
          <button
            type="submit"
            disabled={loading}
            className="w-full sm:w-auto h-11 px-8 bg-primary text-white text-sm font-bold rounded-lg hover:brightness-110 active:opacity-90 disabled:opacity-50 transition-all flex items-center justify-center shrink-0 shadow-lg shadow-primary/20"
          >
            {loading ? "..." : "Check Status"}
          </button>
        </div>

        {successMessage && (
          <div className="p-2.5 bg-primary/10 border border-primary/20 rounded-md text-[11px] text-white font-bold leading-snug flex items-center justify-center gap-2 animate-in fade-in zoom-in-95 duration-300">
            <span className="text-primary">✅</span>
            {successMessage}
          </div>
        )}

        {error && (
          <div className="p-2.5 border border-muted/20 rounded-md text-[11px] leading-snug flex flex-col gap-2 transition-all duration-300 text-left bg-dark/50 text-secondary">
            <div className="flex items-center gap-2">
              <span className="text-primary">ℹ️</span>
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

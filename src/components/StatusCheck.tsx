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
 * 4. If not found, a toast notification is shown.
 */
const StatusCheck: React.FC = () => {
  const router = useRouter();
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);

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
          toast.error("Looks like you're new. Let's get you on the list.");
          
          // Emit event to scroll up to join
          window.dispatchEvent(new CustomEvent("tarra:fill-join", { 
            detail: { phone } 
          }));
        } else {
          toast.error(data.message || "Failed to find account.");
        }
      }
    } catch (error) {
      toast.error("Connection error.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-sm mx-auto mt-8 text-center">
      {/* 
        Symmetry & Trust:
        By using the exact same input geometry (h-11, rounded-lg) and focus behavior (teal ring)
        as the registration form, we build a "system mental model" for the student.
        Predictable UI components reduce user anxiety during recovery actions.
      */}
      <h3 className="text-xs font-bold text-stone-500 dark:text-stone-400 mb-4 uppercase tracking-widest transition-colors">
        Check Status
      </h3>
      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          type="tel"
          required
          placeholder="Phone Number"
          className="flex-grow h-11 px-4 text-sm border border-stone-200 dark:border-stone-800 rounded-lg text-stone-900 dark:text-stone-50 bg-stone-50 dark:bg-stone-900/50 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-all placeholder:text-stone-400"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
        />
        <button
          type="submit"
          disabled={loading}
          className="h-11 px-6 bg-primary text-white text-sm font-bold rounded-lg hover:brightness-110 active:opacity-90 disabled:opacity-50 transition-all flex items-center justify-center"
        >
          {loading ? "..." : "Check"}
        </button>
      </form>
    </div>
  );
}

export default StatusCheck;

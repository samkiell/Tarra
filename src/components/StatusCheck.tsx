"use client";

import React, { useState } from "react";
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
        toast.error(data.message || "Failed to find account.");
      }
    } catch (error) {
      toast.error("Connection error.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-sm mx-auto mt-8 text-center">
      <h3 className="text-sm font-semibold text-stone-500 dark:text-stone-400 mb-4 uppercase tracking-widest transition-colors">
        Check Status
      </h3>
      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          type="tel"
          required
          placeholder="Phone Number"
          className="flex-grow px-4 py-2 text-sm border border-stone-200 dark:border-stone-800 rounded text-stone-900 dark:text-stone-100 bg-white dark:bg-stone-900 focus:outline-none focus:ring-1 focus:ring-stone-900 dark:focus:ring-stone-100 transition-all"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
        />
        <button
          type="submit"
          disabled={loading}
          className="px-4 py-2 bg-stone-100 dark:bg-stone-800 text-stone-900 dark:text-stone-100 text-sm font-bold rounded hover:bg-stone-200 dark:hover:bg-stone-700 disabled:opacity-50 transition-all border border-stone-200 dark:border-stone-700"
        >
          {loading ? "..." : "Check"}
        </button>
      </form>
    </div>
  );
}

export default StatusCheck;

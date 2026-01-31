"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { getReferral, clearReferral, captureReferral } from "@/lib/referrals";

/**
 * WaitlistForm Component
 * 
 * Logic:
 * 1. Capture: On mount, it triggers the referral capture logic.
 * 2. Submission: Sends data to /api/waitlist.
 * 3. Persistence: Reads referral code from localStorage.
 * 4. UX: Handles success, existing user, and validation errors.
 */
const WaitlistForm: React.FC = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  
  const [formData, setFormData] = useState({
    full_name: "",
    email: "",
    phone_number: "",
    interests: [] as string[],
  });

  useEffect(() => {
    captureReferral();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      const referral_code = getReferral();
      
      const response = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          referral_code,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        clearReferral();
        setMessage({ type: "success", text: data.message });
        
        // Wait a moment so they can read the "Welcome back" or success message
        setTimeout(() => {
          router.push(`/status/${data.user_id}`);
        }, 1500);
      } else {
        setMessage({ 
          type: "error", 
          text: Array.isArray(data.details) ? data.details[0] : (data.error || "Something went wrong") 
        });
      }
    } catch (error) {
      setMessage({ type: "error", text: "Failed to connect to the server" });
    } finally {
      setLoading(false);
    }
  };

  const handleInterestChange = (interest: string) => {
    setFormData(prev => ({
      ...prev,
      interests: prev.interests.includes(interest)
        ? prev.interests.filter(i => i !== interest)
        : [...prev.interests, interest]
    }));
  };

  return (
    <div className="w-full max-w-md bg-white border border-stone-200 rounded-xl p-6 shadow-sm">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-semibold text-stone-700 mb-1">Full Name</label>
          <input
            type="text"
            required
            className="w-full px-4 py-2 border border-stone-200 rounded text-stone-900 focus:outline-none focus:ring-1 focus:ring-stone-900 transition-all"
            placeholder="Samkiel Tarra"
            value={formData.full_name}
            onChange={e => setFormData({ ...formData, full_name: e.target.value })}
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-stone-700 mb-1">Campus Email</label>
          <input
            type="email"
            required
            className="w-full px-4 py-2 border border-stone-200 rounded text-stone-900 focus:outline-none focus:ring-1 focus:ring-stone-900 transition-all"
            placeholder="user@student.oauife.edu.ng"
            value={formData.email}
            onChange={e => setFormData({ ...formData, email: e.target.value })}
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-stone-700 mb-1">Phone Number</label>
          <input
            type="tel"
            required
            className="w-full px-4 py-2 border border-stone-200 rounded text-stone-900 focus:outline-none focus:ring-1 focus:ring-stone-900 transition-all"
            placeholder="08012345678"
            value={formData.phone_number}
            onChange={e => setFormData({ ...formData, phone_number: e.target.value })}
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-stone-700 mb-2">I am a...</label>
          <div className="flex flex-wrap gap-2">
            {["Buyer", "Seller", "Service Provider"].map(interest => (
              <button
                key={interest}
                type="button"
                onClick={() => handleInterestChange(interest)}
                className={`px-3 py-1.5 text-xs font-medium rounded-full border transition-all ${
                  formData.interests.includes(interest)
                    ? "bg-stone-900 border-stone-900 text-white"
                    : "bg-white border-stone-200 text-stone-600 hover:border-stone-400"
                }`}
              >
                {interest}
              </button>
            ))}
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 bg-stone-900 text-white font-bold rounded hover:bg-stone-800 disabled:opacity-50 transition-all"
        >
          {loading ? "Joining..." : "Join Waitlist"}
        </button>

        {message && (
          <div className={`mt-4 p-3 rounded text-sm font-medium ${
            message.type === "success" ? "bg-green-50 text-green-700 border border-green-100" : "bg-red-50 text-red-700 border border-red-100"
          }`}>
            {message.text}
          </div>
        )}
      </form>
    </div>
  );
};

export default WaitlistForm;

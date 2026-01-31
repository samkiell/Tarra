"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { getReferral, clearReferral, captureReferral } from "@/lib/referrals";

import { toast } from "react-hot-toast";

/**
 * WaitlistForm Component
 * 
 * Logic:
 * 1. Capture: On mount, it triggers the referral capture logic.
 * 2. Submission: Sends data to /api/waitlist.
 * 3. Persistence: Reads referral code from localStorage.
 * 4. UX: Handles success, existing user, and validation errors via toast.
 */
const WaitlistForm: React.FC = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    full_name: "",
    email: "",
    phone_number: "",
    interests: [] as string[],
  });

  const isGmail = formData.email.toLowerCase().endsWith("@gmail.com");

  useEffect(() => {
    captureReferral();

    // Smart Listen: Auto-fill phone from StatusCheck
    const handleAutoFill = (e: any) => {
      if (e.detail?.phone) {
        setFormData(prev => ({ ...prev, phone_number: e.detail.phone }));
        const section = document.getElementById("join-section");
        section?.scrollIntoView({ behavior: "smooth" });
        toast.success("We've filled in your phone number. Just add your name and email!");
      }
    };

    window.addEventListener("tarra:fill-join", handleAutoFill);
    return () => window.removeEventListener("tarra:fill-join", handleAutoFill);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Mandatory Interest Validation
    if (formData.interests.length === 0) {
      toast.error("Please select at least one interest (Buyer, Seller, or Service Provider)");
      return;
    }

    setLoading(true);

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
        toast.success(data.message);
        router.push(`/status/${data.user_id}`);
      } else {
        // Handle existing user block with smart redirection
        if (data.message && response.status === 400) {
          toast.error(data.error);
          
          // Emit event to scroll down to check status
          window.dispatchEvent(new CustomEvent("tarra:fill-check", { 
            detail: { phone: formData.phone_number } 
          }));
          
          toast(data.message, { icon: "ℹ️", duration: 6000 });
        } else {
          const errorMessage = Array.isArray(data.details) ? data.details[0] : (data.error || "Something went wrong");
          toast.error(errorMessage);
        }
      }
    } catch (error) {
      toast.error("Failed to connect to the server");
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
    <div className="w-full max-w-md bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-xl p-6 shadow-sm transition-colors">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-semibold text-stone-700 dark:text-stone-300 mb-1 transition-colors">Full Name</label>
          <input
            type="text"
            required
            className="w-full px-4 py-2 border border-stone-200 dark:border-stone-700 rounded text-stone-900 dark:text-stone-100 bg-white dark:bg-stone-800 focus:outline-none focus:ring-1 focus:ring-primary transition-all"
            placeholder="Samkiel Tarra"
            value={formData.full_name}
            onChange={e => setFormData({ ...formData, full_name: e.target.value })}
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-stone-700 dark:text-stone-300 mb-1 transition-colors">Campus Email</label>
          <input
            type="email"
            required
            className="w-full px-4 py-2 border border-stone-200 dark:border-stone-700 rounded text-stone-900 dark:text-stone-100 bg-white dark:bg-stone-800 focus:outline-none focus:ring-1 focus:ring-primary transition-all"
            placeholder="user@student.oauife.edu.ng"
            value={formData.email}
            onChange={e => setFormData({ ...formData, email: e.target.value })}
          />
          {isGmail && (
            <div className="mt-2 p-2 bg-warning/10 dark:bg-warning/20 border border-warning/20 dark:border-warning/50 rounded text-xs text-warning leading-snug flex items-center gap-2 transition-colors">
              <span className="text-sm">⚠️</span>
              Gmail is accepted, but verified student features require an @student.oauife.edu.ng email.
            </div>
          )}
        </div>

        <div>
          <label className="block text-sm font-semibold text-stone-700 dark:text-stone-300 mb-1 transition-colors">Phone Number</label>
          <input
            type="tel"
            required
            className="w-full px-4 py-2 border border-stone-200 dark:border-stone-700 rounded text-stone-900 dark:text-stone-100 bg-white dark:bg-stone-800 focus:outline-none focus:ring-1 focus:ring-primary transition-all"
            placeholder="08012345678"
            value={formData.phone_number}
            onChange={e => setFormData({ ...formData, phone_number: e.target.value })}
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-stone-700 dark:text-stone-300 mb-2 transition-colors">
            I am a... <span className="text-error">*</span>
          </label>
          <div className="flex flex-wrap gap-2">
            {["Buyer", "Seller", "Service Provider"].map(interest => (
              <button
                key={interest}
                type="button"
                onClick={() => handleInterestChange(interest)}
                  className={`px-3 py-1.5 text-xs font-medium rounded-full border transition-all ${
                    formData.interests.includes(interest)
                      ? "bg-primary border-primary text-white shadow-sm shadow-primary/20"
                      : "bg-white dark:bg-stone-800 border-stone-200 dark:border-stone-700 text-stone-600 dark:text-stone-400 hover:border-primary/50"
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
            className="w-full py-3 bg-primary text-white font-black rounded-lg hover:brightness-110 active:scale-[0.98] disabled:opacity-50 transition-all shadow-lg shadow-primary/10"
          >
          {loading ? "Joining..." : "Join Waitlist"}
        </button>
      </form>
    </div>
  );
}

export default WaitlistForm;

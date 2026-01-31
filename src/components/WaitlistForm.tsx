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
    <div className="w-full max-w-md bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-xl p-6 shadow-sm transition-all duration-300">
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* 
          Visual Consistency & User Trust:
          Standardizing input heights (h-11), padding, and border radius creates a predictable UI.
          When form elements behave identically across different sections, it reduces cognitive load
          and signals professional reliability, which is critical for a marketplace handling student data.
        */}
        <div>
          <label className="block text-sm font-semibold text-stone-600 dark:text-stone-400 mb-1.5 transition-colors">Full Name</label>
          <input
            type="text"
            required
            className="w-full h-11 px-4 border border-stone-200 dark:border-stone-800 rounded-lg text-stone-900 dark:text-stone-50 bg-stone-50 dark:bg-stone-900/50 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-all placeholder:text-stone-400"
            placeholder="Samkiel Tarra"
            value={formData.full_name}
            onChange={e => setFormData({ ...formData, full_name: e.target.value })}
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-stone-600 dark:text-stone-400 mb-1.5 transition-colors">Campus Email</label>
          <input
            type="email"
            required
            className="w-full h-11 px-4 border border-stone-200 dark:border-stone-800 rounded-lg text-stone-900 dark:text-stone-50 bg-stone-50 dark:bg-stone-900/50 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-all placeholder:text-stone-400"
            placeholder="user@student.oauife.edu.ng"
            value={formData.email}
            onChange={e => setFormData({ ...formData, email: e.target.value })}
          />
          {isGmail && (
            <div className="mt-2 p-2.5 bg-stone-50 dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-md text-[11px] text-stone-500 dark:text-stone-400 leading-snug flex items-center gap-2 transition-colors">
              <span className="text-primary">ℹ️</span>
              Gmail is accepted, but verified student features require an @student.oauife.edu.ng email.
            </div>
          )}
        </div>

        <div>
          <label className="block text-sm font-semibold text-stone-600 dark:text-stone-400 mb-1.5 transition-colors">Phone Number</label>
          <input
            type="tel"
            required
            className="w-full h-11 px-4 border border-stone-200 dark:border-stone-800 rounded-lg text-stone-900 dark:text-stone-50 bg-stone-50 dark:bg-stone-900/50 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-all placeholder:text-stone-400"
            placeholder="08012345678"
            value={formData.phone_number}
            onChange={e => setFormData({ ...formData, phone_number: e.target.value })}
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-stone-600 dark:text-stone-400 mb-2 transition-colors">
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
                      ? "bg-primary border-primary text-white"
                      : "bg-white dark:bg-stone-900 border-stone-200 dark:border-stone-800 text-stone-600 dark:text-stone-400 hover:border-primary/50"
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
            className="w-full py-3 bg-primary text-white font-bold rounded-lg hover:brightness-110 active:opacity-90 disabled:opacity-50 transition-all shadow-sm"
          >
          {loading ? "Joining..." : "Join Waitlist"}
        </button>
      </form>
    </div>
  );
}

export default WaitlistForm;

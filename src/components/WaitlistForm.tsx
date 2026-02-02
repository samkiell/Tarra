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
 * 4. UX: Handles success, existing user, and validation errors via inline helper text.
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

  const [errors, setErrors] = useState<{
    email?: "typo" | "non-oau" | "existing";
    interests?: string;
    general?: string;
  }>({});

  const checkEmail = (email: string) => {
    if (!email) return null;
    const lowerEmail = email.toLowerCase();
    
    // Typo Detection
    const typoDomains = ["gmal.com", "gamil.com", "gaml.com", "gmial.com", "yaho.com", "hotmial.com", "stuent.oauife.edu.ng", "student.oauife.edu"];
    const domain = lowerEmail.split("@")[1];
    if (typoDomains.includes(domain)) return "typo";

    // Non-OAU Check
    if (!lowerEmail.endsWith("@student.oauife.edu.ng")) return "non-oau";

    return null;
  };

  useEffect(() => {
    const error = checkEmail(formData.email);
    setErrors(prev => ({ ...prev, email: error as any }));
  }, [formData.email]);

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
      setErrors(prev => ({ ...prev, interests: "Please select at least one interest" }));
      return;
    }

    setLoading(true);
    setErrors({
      ...errors,
      general: undefined
    });

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
        if (response.status === 400 && data.error?.toLowerCase().includes("already")) {
          setErrors(prev => ({ ...prev, email: "existing" }));
          
          // Still emit event to scroll down to check status
          window.dispatchEvent(new CustomEvent("tarra:fill-check", { 
            detail: { phone: formData.phone_number } 
          }));
        } else {
          const errorMessage = Array.isArray(data.details) ? data.details[0] : (data.error || "Something went wrong");
          setErrors(prev => ({ ...prev, general: errorMessage }));
        }
      }
    } catch (error) {
      setErrors(prev => ({ ...prev, general: "Failed to connect to the server" }));
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
    if (errors.interests) setErrors(prev => ({ ...prev, interests: undefined }));
  };

  return (
    <div className="w-full max-w-md bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-xl p-6 shadow-sm transition-all duration-300">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-semibold text-stone-600 dark:text-stone-400 mb-1.5 transition-colors">Full Name</label>
          <input
            type="text"
            required
            className="w-full h-11 px-4 border border-stone-200 dark:border-stone-800 rounded-lg text-stone-900 dark:text-stone-200 bg-stone-50 dark:bg-stone-950 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary focus:bg-white dark:focus:bg-stone-950 transition-all placeholder:text-stone-400"
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
            className={`w-full h-11 px-4 border rounded-lg text-stone-900 dark:text-stone-200 bg-stone-50 dark:bg-stone-950 focus:outline-none focus:ring-1 transition-all placeholder:text-stone-400 ${
              errors.email === "typo" 
                ? "border-amber-400 focus:ring-amber-500 focus:border-amber-500" 
                : errors.email === "non-oau" || errors.email === "existing"
                ? "border-primary focus:ring-primary focus:border-primary"
                : "border-stone-200 dark:border-stone-800 focus:ring-primary focus:border-primary"
            }`}
            placeholder="user@student.oauife.edu.ng"
            value={formData.email}
            onChange={e => setFormData({ ...formData, email: e.target.value })}
          />
          
          {errors.email === "typo" && (
            <div className="mt-2 p-2.5 bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900/50 rounded-md text-[11px] text-amber-700 dark:text-amber-400 leading-snug flex items-center gap-2 transition-all">
              <span className="text-amber-500">⚠️</span>
              Oops, looks like a typo. Double check?
            </div>
          )}

          {errors.email === "non-oau" && (
            <div className="mt-2 p-2.5 bg-teal-50 dark:bg-teal-950/20 border border-teal-200 dark:border-teal-900/50 rounded-md text-[11px] text-teal-700 dark:text-teal-400 leading-snug flex items-center gap-2 transition-all">
              <span className="text-primary">ℹ️</span>
              Please use your OAU student email.
            </div>
          )}

          {errors.email === "existing" && (
            <div className="mt-2 p-2.5 bg-stone-50 dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-md text-[11px] text-stone-500 dark:text-stone-400 leading-snug flex flex-col gap-2 transition-all">
              <div className="flex items-center gap-2">
                <span className="text-primary">ℹ️</span>
                You&apos;re already on the list!
              </div>
              <button
                type="button"
                onClick={() => {
                  window.dispatchEvent(new CustomEvent("tarra:fill-check", { 
                    detail: { phone: formData.phone_number } 
                  }));
                }}
                className="w-full py-2 bg-primary/10 hover:bg-primary/20 text-primary font-bold rounded transition-colors text-center"
              >
                Welcome back! Click here to check your Rank.
              </button>
            </div>
          )}
        </div>

        <div>
          <label className="block text-sm font-semibold text-stone-600 dark:text-stone-400 mb-1.5 transition-colors">Phone Number</label>
          <input
            type="tel"
            required
            className="w-full h-11 px-4 border border-stone-200 dark:border-stone-800 rounded-lg text-stone-900 dark:text-stone-200 bg-stone-50 dark:bg-stone-950 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary focus:bg-white dark:focus:bg-stone-950 transition-all placeholder:text-stone-400"
            placeholder="08012345678"
            value={formData.phone_number}
            onChange={e => setFormData({ ...formData, phone_number: e.target.value })}
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-stone-600 dark:text-stone-400 mb-2 transition-colors">
            I am a... <span className="text-primary">*</span>
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
          {errors.interests && (
             <p className="mt-2 text-[11px] text-amber-600 dark:text-amber-400 font-medium">
               {errors.interests}
             </p>
          )}
        </div>

        {errors.general && (
          <div className="p-2.5 bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900/50 rounded-md text-[11px] text-amber-700 dark:text-amber-400 leading-snug flex items-center gap-2 transition-all">
            <span className="text-amber-500">⚠️</span>
            {errors.general}
          </div>
        )}

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

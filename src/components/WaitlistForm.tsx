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
 * 4. UX: Handles success, existing user, and validation errors via inline helper text.
 */
const WaitlistForm: React.FC = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [infoMessage, setInfoMessage] = useState<string | null>(null);
  
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
        setInfoMessage("We've filled in your phone number. Just add your name and email!");
        setTimeout(() => setInfoMessage(null), 5000);
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
        setSuccessMessage(data.message);
        setTimeout(() => {
            router.push(`/status/${data.user_id}`);
        }, 1500);
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
    <div className="w-full max-w-md bg-dark border border-muted/20 rounded-xl p-6 shadow-2xl transition-all duration-300">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="full_name" className="block text-sm font-semibold text-secondary mb-1.5 transition-colors">Full Name</label>
          <input
            id="full_name"
            type="text"
            required
            className="w-full h-11 px-4 border border-muted/20 rounded-lg text-white bg-dark/50 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-all placeholder:text-secondary/50"
            placeholder="User Tarra"
            value={formData.full_name}
            onChange={e => setFormData({ ...formData, full_name: e.target.value })}
          />
        </div>

        <div className="space-y-1.5">
          <label htmlFor="email" className="block text-sm font-semibold text-secondary transition-colors">Campus Email</label>
          <div className="relative group">
            <input
              id="email"
              type="email"
              required
              className={`w-full h-11 pl-4 pr-36 border rounded-lg text-white bg-dark/50 focus:outline-none focus:ring-1 transition-all placeholder:text-secondary/50 ${
                errors.email === "typo" 
                  ? "border-primary focus:ring-primary focus:border-primary" 
                  : errors.email === "non-oau" || errors.email === "existing"
                  ? "border-primary focus:ring-primary focus:border-primary"
                  : "border-muted/20 focus:ring-primary focus:border-primary"
              }`}
              placeholder="user@student.oauife.edu.ng"
              value={formData.email}
              onChange={e => setFormData({ ...formData, email: e.target.value })}
            />
            
            {formData.email && !formData.email.endsWith("@student.oauife.edu.ng") && (
              <button
                type="button"
                onClick={() => {
                  const prefix = formData.email.split("@")[0];
                  setFormData({ ...formData, email: `${prefix}@student.oauife.edu.ng` });
                }}
                className="absolute right-2 top-1/2 -translate-y-1/2 px-2 py-1 bg-primary/10 hover:bg-primary/20 text-primary text-[10px] font-bold rounded-md border border-primary/20 transition-all opacity-0 group-focus-within:opacity-100 group-hover:opacity-100"
              >
                + @student.oauife.edu.ng
              </button>
            )}
          </div>
          
          {errors.email === "typo" && (
            <div className="mt-2 p-2.5 bg-primary/5 border border-primary/20 rounded-md text-[11px] text-secondary leading-snug flex items-center gap-2 transition-all">
              <span className="text-primary">ℹ️</span>
              Oops, looks like a typo. Double check?
            </div>
          )}

          {errors.email === "non-oau" && (
            <div className="mt-2 p-2.5 bg-primary/5 border border-primary/20 rounded-md text-[11px] text-secondary leading-snug flex items-center gap-2 transition-all">
              <span className="text-primary">ℹ️</span>
              Please use your OAU student email.
            </div>
          )}

          {errors.email === "existing" && (
            <div className="mt-2 p-2.5 bg-dark border border-muted/20 rounded-md text-[11px] text-secondary leading-snug flex flex-col gap-2 transition-all">
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
          <label htmlFor="phone_number" className="block text-sm font-semibold text-secondary mb-1.5 transition-colors">Phone Number</label>
          <input
            id="phone_number"
            type="tel"
            required
            className="w-full h-11 px-4 border border-muted/20 rounded-lg text-white bg-dark/50 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-all placeholder:text-secondary/50"
            placeholder="08012345678"
            value={formData.phone_number}
            onChange={e => setFormData({ ...formData, phone_number: e.target.value })}
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-secondary mb-2 transition-colors">
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
                      : "bg-dark border-muted/20 text-secondary hover:border-primary/50"
                  }`}
              >
                {interest}
              </button>
            ))}
          </div>
          {errors.interests && (
             <p className="mt-2 text-[11px] text-primary font-medium">
               {errors.interests}
             </p>
          )}
        </div>

        {errors.general && (
          <div className="p-2.5 bg-primary/5 border border-primary/20 rounded-md text-[11px] text-secondary leading-snug flex items-center gap-2 transition-all">
            <span className="text-primary">ℹ️</span>
            {errors.general}
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 bg-primary text-white font-bold rounded-lg hover:brightness-110 active:opacity-90 disabled:opacity-50 transition-all shadow-lg shadow-primary/20"
        >
          {loading ? "Joining..." : "Join Waitlist"}
        </button>

        {successMessage && (
          <div className="p-2.5 bg-primary/10 border border-primary/20 rounded-md text-[11px] text-white font-bold leading-snug flex items-center gap-2 animate-in fade-in zoom-in-95 duration-300">
            <span className="text-primary">✅</span>
            {successMessage}
          </div>
        )}

        {infoMessage && (
          <div className="p-2.5 bg-secondary/10 border border-secondary/20 rounded-md text-[11px] text-secondary leading-snug flex items-center gap-2 animate-in fade-in slide-in-from-top-2 duration-300">
            <span className="text-primary">ℹ️</span>
            {infoMessage}
          </div>
        )}

        <p className="text-center text-[11px] font-medium text-secondary mt-2 transition-colors">
          Already joined?{" "}
          <button
            type="button"
            onClick={() => {
              document.getElementById("leaderboard-section")?.scrollIntoView({ behavior: "smooth" });
            }}
            className="text-primary hover:underline underline-offset-2 transition-all"
          >
            Check your Rank
          </button>
        </p>
      </form>
    </div>
  );
}

export default WaitlistForm;

"use client";

import React, { useState } from "react";

interface CopyLinkButtonProps {
  referralUrl: string;
}

import { toast } from "react-hot-toast";
import { Copy, Check } from "lucide-react";

interface CopyLinkButtonProps {
  referralUrl: string;
}

/**
 * CopyLinkButton Component
 * 
 * Logic:
 * 1. Copies the generated referral link to the mobile/desktop clipboard.
 * 2. Provides immediate visual feedback via toast and icon change.
 */
const CopyLinkButton: React.FC<CopyLinkButtonProps> = ({ referralUrl }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(referralUrl);
      setCopied(true);
      toast.success("Link copied to clipboard!");
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      toast.error("Failed to copy link.");
    }
  };

  return (
    <div className="flex flex-col sm:flex-row gap-2 w-full max-w-lg">
      <div className="flex-grow px-4 py-3 bg-white dark:bg-stone-950 border border-stone-200 dark:border-stone-800 rounded-lg text-stone-600 dark:text-stone-400 text-sm truncate font-mono transition-colors">
        {referralUrl}
      </div>
      <button
        onClick={handleCopy}
        className="px-6 py-3 bg-primary text-white text-sm font-bold rounded-lg hover:brightness-110 active:opacity-90 transition-all whitespace-nowrap flex items-center justify-center gap-2"
      >
        {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
        {copied ? "Copied!" : "Copy Link"}
      </button>
    </div>
  );
};

export default CopyLinkButton;

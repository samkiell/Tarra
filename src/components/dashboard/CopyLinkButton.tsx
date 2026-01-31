"use client";

import React, { useState } from "react";
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
 * 3. Includes fallback for non-secure contexts (HTTP) where navigator.clipboard is absent.
 */
const CopyLinkButton: React.FC<CopyLinkButtonProps> = ({ referralUrl }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      // Primary: Modern Clipboard API
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(referralUrl);
      } else {
        // Fallback: ExecCommand approach for non-secure contexts
        const textArea = document.createElement("textarea");
        textArea.value = referralUrl;
        textArea.style.position = "fixed";
        textArea.style.left = "-9999px";
        textArea.style.top = "0";
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        document.execCommand('copy');
        textArea.remove();
      }
      
      setCopied(true);
      toast.success("Link copied to clipboard!");
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      toast.error("Failed to copy link.");
      console.error("Copy failed:", err);
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

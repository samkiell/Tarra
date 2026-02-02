"use client";

import React, { useState } from "react";
import { Copy, Check } from "lucide-react";

interface CopyLinkButtonProps {
  referralUrl: string;
}

/**
 * CopyLinkButton Component
 * 
 * Logic:
 * 1. Copies the generated referral link to the mobile/desktop clipboard.
 * 2. Provides immediate visual feedback via icon change and inline status text.
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
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Copy failed:", err);
    }
  };

  return (
    <div className="flex flex-col w-full max-w-lg gap-2">
      <div className="flex flex-col sm:flex-row gap-2">
        <div className="flex-grow px-4 py-3 bg-dark/50 border border-muted/20 rounded-lg text-secondary text-sm truncate font-mono transition-colors">
          {referralUrl}
        </div>
        <button
          onClick={handleCopy}
          className={`px-6 py-3 text-sm font-bold rounded-lg transition-all whitespace-nowrap flex items-center justify-center gap-2 ${
            copied 
              ? "bg-primary text-white" 
              : "bg-primary text-white hover:brightness-110 active:opacity-90 shadow-lg shadow-primary/20"
          }`}
        >
          {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
          {copied ? "Copied!" : "Copy Link"}
        </button>
      </div>
      
      {copied && (
        <div className="text-[10px] font-bold text-primary uppercase tracking-widest animate-in fade-in slide-in-from-top-1 duration-300">
          ✨ Link copied to clipboard
        </div>
      )}
    </div>
  );
};

export default CopyLinkButton;

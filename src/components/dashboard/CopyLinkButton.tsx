"use client";

import React, { useState } from "react";

interface CopyLinkButtonProps {
  referralUrl: string;
}

/**
 * CopyLinkButton Component
 * 
 * Logic:
 * 1. Copies the generated referral link to the mobile/desktop clipboard.
 * 2. Provides immediate visual feedback to the user.
 */
const CopyLinkButton: React.FC<CopyLinkButtonProps> = ({ referralUrl }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(referralUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy", err);
    }
  };

  return (
    <div className="flex flex-col sm:flex-row gap-2 w-full max-w-md">
      <div className="flex-grow px-3 py-2 bg-stone-50 border border-stone-200 rounded text-stone-600 text-sm truncate font-mono">
        {referralUrl}
      </div>
      <button
        onClick={handleCopy}
        className="px-4 py-2 bg-stone-900 text-white text-sm font-semibold rounded hover:bg-stone-800 transition-colors whitespace-nowrap"
      >
        {copied ? "Copied!" : "Copy Link"}
      </button>
    </div>
  );
};

export default CopyLinkButton;

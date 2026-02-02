"use client";

import React from "react";
import { Trophy, Users, CheckCircle2 } from "lucide-react";
import CopyLinkButton from "./CopyLinkButton";

interface WelcomeBackCardProps {
  firstName: string;
  referralCount: number;
  rank: number;
  referralUrl: string;
}

const WelcomeBackCard: React.FC<WelcomeBackCardProps> = ({ 
  firstName, 
  referralCount, 
  rank, 
  referralUrl 
}) => {
  return (
    <div className="w-full max-w-md bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-xl p-8 shadow-sm transition-all duration-300">
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-full mb-4">
          <CheckCircle2 className="w-8 h-8 text-primary" strokeWidth={2.5} />
        </div>
        <h2 className="text-2xl font-black text-stone-900 dark:text-stone-50 tracking-tight mb-2">
          Welcome Back, {firstName}!
        </h2>
        <p className="text-stone-500 dark:text-stone-400 text-sm font-medium">
          You&apos;re already on the list. Keep sharing to climb higher!
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-8">
        <div className="p-4 bg-stone-50 dark:bg-stone-950 border border-stone-100 dark:border-stone-800 rounded-lg text-center transition-colors">
          <div className="flex justify-center mb-2">
            <Users className="w-4 h-4 text-primary" />
          </div>
          <div className="text-2xl font-black text-stone-900 dark:text-stone-50">{referralCount}</div>
          <div className="text-[10px] uppercase font-bold text-stone-400 tracking-widest mt-1">Referrals</div>
        </div>
        <div className="p-4 bg-stone-50 dark:bg-stone-950 border border-stone-100 dark:border-stone-800 rounded-lg text-center transition-colors">
          <div className="flex justify-center mb-2">
            <Trophy className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-2xl font-black text-stone-900 dark:text-stone-50">#{rank}</div>
          <div className="text-[10px] uppercase font-bold text-stone-400 tracking-widest mt-1">Current Rank</div>
        </div>
      </div>

      <div className="space-y-4">
        <div className="text-xs font-bold text-stone-500 dark:text-stone-400 uppercase tracking-widest text-center">
          Share Your Link
        </div>
        <CopyLinkButton referralUrl={referralUrl} />
      </div>

      <div className="mt-8 pt-6 border-t border-stone-100 dark:border-stone-800 text-center">
        <button
          onClick={() => {
            document.getElementById("leaderboard-section")?.scrollIntoView({ behavior: "smooth" });
          }}
          className="text-xs font-bold text-primary hover:underline underline-offset-4 uppercase tracking-widest transition-all"
        >
          View Full Leaderboard
        </button>
      </div>
    </div>
  );
};

export default WelcomeBackCard;

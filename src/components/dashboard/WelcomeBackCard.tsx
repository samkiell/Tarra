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
    <div className="w-full max-w-md bg-dark border border-muted/20 rounded-xl p-8 shadow-2xl transition-all duration-300">
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-full mb-4">
          <CheckCircle2 className="w-8 h-8 text-primary" strokeWidth={2.5} />
        </div>
        <h2 className="text-2xl font-black text-white tracking-tight mb-2">
          Welcome Back, {firstName}!
        </h2>
        <p className="text-secondary text-sm font-medium">
          You are currently ranked <span className="text-primary font-bold">#{rank}</span>
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="p-4 bg-dark/50 border border-muted/20 rounded-lg text-center transition-colors">
          <div className="flex justify-center mb-2">
            <Users className="w-4 h-4 text-primary" />
          </div>
          <div className="text-2xl font-black text-white">{referralCount}</div>
          <div className="text-[10px] uppercase font-bold text-secondary tracking-widest mt-1">Total Invites</div>
        </div>
        <div className="p-4 bg-dark/50 border border-muted/20 rounded-lg text-center transition-colors">
          <div className="flex justify-center mb-2">
            <CheckCircle2 className="w-4 h-4 text-primary" />
          </div>
          <div className="text-2xl font-black text-white">0</div>
          <div className="text-[10px] uppercase font-bold text-secondary tracking-widest mt-1">Verified Users</div>
        </div>
      </div>

      <div className="px-4 py-3 bg-primary/5 border border-primary/20 rounded-lg mb-6">
        <p className="text-[10px] leading-relaxed text-secondary font-medium text-center">
          “Your referrals become ‘Verified’ when they download the app during Welcome Month (April).”
        </p>
      </div>



      <div className="space-y-4">
        <div className="text-xs font-bold text-secondary uppercase tracking-widest text-center">
          Share Your Link
        </div>
        <CopyLinkButton referralUrl={referralUrl} />
      </div>

      <div className="mt-8 pt-6 border-t border-muted/10 text-center">
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

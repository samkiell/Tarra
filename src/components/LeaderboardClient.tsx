"use client";

import React, { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";

interface LeaderboardItem {
  _id: string;
  firstName: string;
  count: number;
  isGhost: boolean;
}

interface LeaderboardClientProps {
  initialData: LeaderboardItem[];
}

const LeaderboardClient: React.FC<LeaderboardClientProps> = ({ initialData }) => {
  const [showAll, setShowAll] = useState(false);
  
  const displayData = showAll ? initialData : initialData.slice(0, 10);
  const hasMore = initialData.length > 10;

  return (
    <div className="w-full border border-muted/20 rounded-lg bg-dark shadow-2xl overflow-hidden transition-colors">
      <div className="overflow-x-auto scrollbar-thin scrollbar-thumb-muted/20">
        <table className="w-full text-left border-collapse min-w-[320px]">
          <thead className="bg-dark/50 border-b border-muted/20 transition-colors">
            <tr>
              <th className="px-4 py-4 text-[10px] font-bold text-primary uppercase tracking-[0.2em] w-16">Rank</th>
              <th className="px-4 py-4 text-[10px] font-bold text-secondary uppercase tracking-[0.2em]">Student Name</th>
              <th className="px-4 py-4 text-[10px] font-bold text-secondary uppercase tracking-[0.2em] text-right">Referrals</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-muted/10 transition-colors">
            {displayData.length > 0 ? (
              displayData.map((item, index) => (
                <tr key={item._id} className="hover:bg-primary/5 transition-colors animate-in fade-in slide-in-from-bottom-2 duration-300" style={{ animationDelay: `${index * 50}ms` }}>
                  <td className="px-4 py-4 text-sm font-bold text-white">
                    <span className={index < 3 ? "text-primary text-base" : "text-secondary font-medium"}>
                      {String(index + 1).padStart(2, '0')}
                    </span>
                  </td>
                  <td className="px-4 py-4 text-sm font-semibold text-white/90">
                    {item.firstName}
                  </td>
                  <td className="px-4 py-4 text-sm font-bold text-primary text-right tabular-nums">
                    {item.count}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={3} className="px-4 py-16 text-center text-secondary text-sm font-medium italic">
                  The leaderboard is currently empty. Start referring to lead!
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      
      {hasMore && (
        <button
          onClick={() => setShowAll(!showAll)}
          className="w-full py-4 bg-dark border-t border-muted/20 text-[10px] font-bold text-secondary hover:text-primary transition-colors flex items-center justify-center gap-2 uppercase tracking-widest"
        >
          {showAll ? (
            <>
              Show Less <ChevronUp className="w-3 h-3" />
            </>
          ) : (
            <>
              See More ({initialData.length - 10} more) <ChevronDown className="w-3 h-3" />
            </>
          )}
        </button>
      )}
    </div>
  );
};

export default LeaderboardClient;

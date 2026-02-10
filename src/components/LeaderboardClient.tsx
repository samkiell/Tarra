"use client";

import React from "react";
import { useRouter } from "next/navigation";

interface LeaderboardItem {
  _id: string;
  firstName: string;
  count: number;
  isGhost: boolean;
}

interface LeaderboardClientProps {
  initialData: LeaderboardItem[];
  userRank?: number;
}

const LeaderboardClient: React.FC<LeaderboardClientProps> = ({ initialData, userRank }) => {
  const router = useRouter();
  const [showAll, setShowAll] = React.useState(false);
  
  // Default view is Rank 1-10, expanded view is Rank 11-20
  const displayData = showAll ? initialData.slice(0, 20) : initialData.slice(0, 10);

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
                <tr 
                  key={item._id} 
                  onClick={() => !item.isGhost && router.push(`/status/${item._id}`)}
                  className={`transition-colors animate-in fade-in slide-in-from-bottom-2 duration-300 ${!item.isGhost ? "hover:bg-primary/5 cursor-pointer" : "cursor-default"}`} 
                  style={{ animationDelay: `${index * 50}ms` }}
                >
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
      
      {initialData.length > 10 && (
        <div className="p-4 border-t border-muted/10 text-center bg-dark/30">
          <button 
            onClick={() => setShowAll(!showAll)}
            className="text-xs font-bold text-primary hover:underline underline-offset-4 uppercase tracking-widest transition-all"
          >
            {showAll ? "View Less" : "View More"}
          </button>
        </div>
      )}

      {userRank && (
        <div className="p-4 border-t border-muted/20 bg-primary/5 text-center">
          <p className="text-sm font-bold text-white uppercase tracking-wider">
            You are currently <span className="text-primary font-black">#{userRank}</span>
          </p>
        </div>
      )}
    </div>
  );
};

export default LeaderboardClient;

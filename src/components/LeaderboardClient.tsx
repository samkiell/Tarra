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
    <div className="w-full max-w-2xl mx-auto border border-muted/10 rounded-2xl bg-dark/40 backdrop-blur-md shadow-2xl overflow-hidden transition-colors">
      <div className="overflow-x-auto scrollbar-thin scrollbar-thumb-muted/20">
        <table className="w-full text-left border-collapse min-w-[320px]">
          <thead className="bg-dark/80 border-b border-muted/10 transition-colors">
            <tr>
              <th className="px-4 py-4 text-[10px] font-black text-primary uppercase tracking-[0.3em] w-20">Rank</th>
              <th className="px-4 py-4 text-[10px] font-black text-secondary uppercase tracking-[0.3em]">Student Name</th>
              <th className="px-4 py-4 text-[10px] font-black text-secondary uppercase tracking-[0.3em] text-right">Referrals</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-muted/5 transition-colors">
            {displayData.length > 0 ? (
              displayData.map((item, index) => (
                <tr 
                  key={item._id} 
                  onClick={() => !item.isGhost && router.push(`/status/${item._id}`)}
                  className={`transition-all animate-in fade-in slide-in-from-bottom-2 duration-500 ${!item.isGhost ? "hover:bg-primary/[0.03] cursor-pointer" : "cursor-default"}`} 
                  style={{ animationDelay: `${index * 40}ms` }}
                >
                  <td className="px-4 py-3 text-xs font-bold text-white">
                    <span className={index < 3 ? "text-primary text-base font-black" : "text-secondary font-semibold"}>
                      {String(index + 1).padStart(2, '0')}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm font-bold text-white/90">
                    {item.firstName}
                    {index < 3 && <span className="ml-2 inline-block text-xs">✨</span>}
                  </td>
                  <td className="px-4 py-3 text-sm font-black text-primary text-right tabular-nums">
                    {item.count}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={3} className="px-6 py-20 text-center text-secondary text-sm font-medium italic">
                  The leaderboard is currently empty. Start referring to lead!
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      
      {initialData.length > 10 && (
        <div className="p-5 border-t border-muted/5 text-center bg-dark/20">
          <button 
            onClick={() => setShowAll(!showAll)}
            className="text-[10px] font-black text-primary hover:text-white uppercase tracking-[0.2em] transition-all"
          >
            {showAll ? "↑ View Less" : "↓ View More"}
          </button>
        </div>
      )}

      {userRank && (
        <div className="px-6 py-5 border-t border-primary/20 bg-primary/10 text-center">
          <p className="text-sm font-bold text-white uppercase tracking-widest leading-relaxed">
            You are currently ranked <span className="text-primary font-black ml-1 text-lg">#{userRank}</span>
          </p>
        </div>
      )}
    </div>
  );
};

export default LeaderboardClient;

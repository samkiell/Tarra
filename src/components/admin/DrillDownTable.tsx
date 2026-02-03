"use client";

import React from "react";

interface ReferralDetail {
  first_name: string;
  phone_number: string;
  created_at: string;
}

interface DrillDownTableProps {
  referrerName: string;
  referrals: ReferralDetail[];
  onClose: () => void;
}

/**
 * DrillDownTable Component
 * 
 * Fraud Detection Intent:
 * Allows admins to inspect the specific users referred by a high-ranking recruiter.
 */
const DrillDownTable: React.FC<DrillDownTableProps> = ({ referrerName, referrals, onClose }) => {
  // Sort by join time (newest first)
  const sortedReferrals = [...referrals].sort((a, b) => 
    new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  );

  // Group by phone prefix (first 7 digits) to spot sequential/batch sims
  const prefixGroups = sortedReferrals.reduce((acc, ref) => {
    const prefix = ref.phone_number.substring(0, 7);
    acc[prefix] = (acc[prefix] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  return (
    <div className="fixed inset-0 bg-dark/80 z-50 flex items-center justify-center p-4 transition-all backdrop-blur-md">
      <div className="bg-dark rounded-xl shadow-2xl w-full max-w-4xl max-h-[85vh] overflow-hidden flex flex-col border border-muted/10 transition-colors">
        <div className="px-4 sm:px-6 py-4 sm:py-6 border-b border-muted/10 flex justify-between items-center bg-dark transition-colors">
          <div>
            <h2 className="text-lg sm:text-xl font-bold text-white leading-tight">
              Audit: <span className="text-primary">{referrerName}</span>
            </h2>
            <p className="text-[10px] sm:text-xs text-secondary mt-1">
              Analyzing {referrals.length} referrals for patterns
            </p>
          </div>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-muted/10 rounded-full transition-colors"
          >
            <span className="sr-only">Close</span>
            <svg className="w-5 h-5 text-secondary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <div className="overflow-x-auto p-0 flex-1 scrollbar-thin scrollbar-thumb-muted/10">
          <table className="w-full text-left border-collapse min-w-[500px]">
            <thead className="bg-dark sticky top-0 z-10 border-b border-muted/10 shadow-lg">
              <tr>
                <th className="px-6 py-4 text-[10px] font-bold text-secondary uppercase tracking-widest">Referred User</th>
                <th className="px-6 py-4 text-[10px] font-bold text-secondary uppercase tracking-widest text-center">Phone Analysis</th>
                <th className="px-6 py-4 text-[10px] font-bold text-secondary uppercase tracking-widest text-right">Join Frequency</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-muted/5">
              {sortedReferrals.map((ref, idx) => {
                const prefix = ref.phone_number.substring(0, 7);
                const isSuspiciousPattern = prefixGroups[prefix] > 2;

                return (
                  <tr key={idx} className={`group transition-colors ${isSuspiciousPattern ? 'bg-primary/5 hover:bg-primary/10' : 'hover:bg-muted/5'}`}>
                    <td className="px-6 py-4">
                      <div className="text-sm font-semibold text-white/90">{ref.first_name}</div>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <div className={`text-sm font-mono inline-block px-2 py-0.5 rounded border ${isSuspiciousPattern ? 'border-primary/30 text-primary font-bold bg-primary/5' : 'border-transparent text-secondary'}`}>
                        {ref.phone_number}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="text-sm text-secondary/80">
                        {new Date(ref.created_at).toLocaleDateString()} 
                        <span className="text-muted/10 mx-1.5">•</span>
                        <span className="text-xs text-secondary font-mono">
                          {new Date(ref.created_at).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                        </span>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default DrillDownTable;

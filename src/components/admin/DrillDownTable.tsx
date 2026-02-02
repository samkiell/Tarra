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
 * Red flags to look for:
 * 1. Clusters of referrals created at the exact same timestamp.
 * 2. Patterns in phone numbers (sequential or very similar).
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
    <div className="fixed inset-0 bg-stone-900/40 z-50 flex items-center justify-center p-4 transition-all backdrop-blur-sm">
      <div className="bg-white dark:bg-stone-900 rounded-lg shadow-2xl w-full max-w-4xl max-h-[85vh] overflow-hidden flex flex-col border border-stone-200 dark:border-stone-800 transition-colors">
        <div className="px-6 py-4 border-b border-stone-200 dark:border-stone-800 flex justify-between items-center bg-stone-50/50 dark:bg-stone-900/50 transition-colors">
          <div>
            <h2 className="text-lg font-bold text-stone-900 dark:text-stone-50">
              Audit Record: <span className="text-primary">{referrerName}</span>
            </h2>
            <p className="text-xs text-stone-500 dark:text-stone-400 mt-1">
              Analyzing {referrals.length} referrals for patterns
            </p>
          </div>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-stone-100 dark:hover:bg-stone-800 rounded-full transition-colors"
          >
            <span className="sr-only">Close</span>
            <svg className="w-5 h-5 text-stone-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <div className="overflow-x-auto p-0 flex-1">
          <table className="w-full text-left border-collapse min-w-[500px]">
            <thead className="bg-stone-50 dark:bg-stone-950 sticky top-0 z-10 shadow-sm">
              <tr>
                <th className="px-6 py-3 text-[10px] font-bold text-stone-500 dark:text-stone-400 uppercase tracking-widest">Referred User</th>
                <th className="px-6 py-3 text-[10px] font-bold text-stone-500 dark:text-stone-400 uppercase tracking-widest text-center">Phone Pattern</th>
                <th className="px-6 py-3 text-[10px] font-bold text-stone-500 dark:text-stone-400 uppercase tracking-widest text-right">Join Timestamp</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100 dark:divide-stone-800">
              {sortedReferrals.map((ref, idx) => {
                const prefix = ref.phone_number.substring(0, 7);
                const isSuspiciousPattern = prefixGroups[prefix] > 2;

                return (
                  <tr key={idx} className={`group transition-colors ${isSuspiciousPattern ? 'bg-amber-50/50 dark:bg-amber-950/10 hover:bg-amber-50 dark:hover:bg-amber-950/20' : 'hover:bg-stone-50 dark:hover:bg-stone-800/50'}`}>
                    <td className="px-6 py-3">
                      <div className="text-sm font-medium text-stone-900 dark:text-stone-200">{ref.first_name}</div>
                    </td>
                    <td className="px-6 py-3 text-center">
                      <div className={`text-sm font-mono inline-block px-2 py-0.5 rounded ${isSuspiciousPattern ? 'bg-amber-100 text-amber-700 dark:bg-amber-950/40 dark:text-amber-400 font-bold' : 'text-stone-500 dark:text-stone-400'}`}>
                        {ref.phone_number}
                      </div>
                    </td>
                    <td className="px-6 py-3 text-right">
                      <div className="text-sm text-stone-600 dark:text-stone-400">
                        {new Date(ref.created_at).toLocaleDateString()} 
                        <span className="text-stone-300 dark:text-stone-600 mx-1">•</span>
                        <span className="text-xs text-stone-400 font-mono">
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

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
  return (
    <div className="fixed inset-0 bg-stone-900/40 z-50 flex items-center justify-center p-4 transition-all">
      <div className="bg-white dark:bg-stone-900 rounded-lg shadow-sm w-full max-w-4xl max-h-[80vh] overflow-hidden flex flex-col border border-stone-200 dark:border-stone-800 transition-colors">
        <div className="px-6 py-4 border-b border-stone-200 dark:border-stone-800 flex justify-between items-center bg-white dark:bg-stone-900 transition-colors">
          <h2 className="text-lg font-bold text-stone-900 dark:text-stone-50">
            Referrals for {referrerName}
          </h2>
          <button 
            onClick={onClose}
            className="text-stone-400 hover:text-stone-900 dark:hover:text-stone-200 font-bold transition-colors"
          >
            ✕ Close
          </button>
        </div>
        
        <div className="overflow-auto p-6 scrollbar-thin scrollbar-thumb-stone-200 dark:scrollbar-thumb-stone-800">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b-2 border-stone-100 dark:border-stone-800">
                <th className="py-2 text-xs font-bold text-stone-500 dark:text-stone-400 uppercase transition-colors">First Name</th>
                <th className="py-2 text-xs font-bold text-stone-500 dark:text-stone-400 uppercase transition-colors">Phone Number</th>
                <th className="py-2 text-xs font-bold text-stone-500 dark:text-stone-400 uppercase text-right transition-colors">Date Referred</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-50 dark:divide-stone-800">
              {referrals.map((ref, idx) => (
                <tr key={idx} className="hover:bg-stone-50 dark:hover:bg-stone-800/50 transition-colors">
                  <td className="py-3 text-sm text-stone-900 dark:text-stone-200">{ref.first_name}</td>
                  <td className="py-3 text-sm font-mono text-stone-900 dark:text-stone-300">{ref.phone_number}</td>
                  <td className="py-3 text-sm text-right text-stone-500 dark:text-stone-500">
                    {new Date(ref.created_at).toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default DrillDownTable;

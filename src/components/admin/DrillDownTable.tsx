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
    <div className="fixed inset-0 bg-stone-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[80vh] overflow-hidden flex flex-col">
        <div className="px-6 py-4 border-b border-stone-200 flex justify-between items-center bg-stone-50">
          <h2 className="text-lg font-bold text-stone-900">
            Referrals for {referrerName}
          </h2>
          <button 
            onClick={onClose}
            className="text-stone-400 hover:text-stone-900 font-bold"
          >
            ✕ Close
          </button>
        </div>
        
        <div className="overflow-auto p-6">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b-2 border-stone-100">
                <th className="py-2 text-xs font-bold text-stone-500 uppercase">First Name</th>
                <th className="py-2 text-xs font-bold text-stone-500 uppercase">Phone Number</th>
                <th className="py-2 text-xs font-bold text-stone-500 uppercase text-right">Date Referred</th>
              </tr>
            </thead>
            <tbody>
              {referrals.map((ref, idx) => (
                <tr key={idx} className="border-b border-stone-50 hover:bg-stone-50/50">
                  <td className="py-3 text-sm">{ref.first_name}</td>
                  <td className="py-3 text-sm font-mono">{ref.phone_number}</td>
                  <td className="py-3 text-sm text-right text-stone-500">
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

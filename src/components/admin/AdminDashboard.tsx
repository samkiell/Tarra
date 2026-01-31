"use client";

import React, { useState } from "react";
import { Download } from "lucide-react";
import DrillDownTable from "./DrillDownTable";

interface AdminUser {
  id: string;
  full_name: string;
  email: string;
  phone_number: string;
  referral_code: string;
  referral_count: number;
  referrals: Array<{
    first_name: string;
    phone_number: string;
    created_at: string;
  }>;
}

interface AdminDashboardProps {
  users: AdminUser[];
}

/**
 * AdminDashboard Client Component
 * 
 * Fraud Detection Intent:
 * 1. Ranking: High referral counts are surfaced immediately for audit.
 * 2. Drill-down: Clicking the count allows manual verification of referral quality.
 */
const AdminDashboard: React.FC<AdminDashboardProps> = ({ users }) => {
  const [selectedUser, setSelectedUser] = useState<AdminUser | null>(null);

  const handleExportCSV = () => {
    // Triggers the server-side CSV generation endpoint
    // This ensures data is fetched securely and formatted correctly with BOM for Excel
    window.location.href = "/api/admin/export-csv";
  };

  return (
    <div className="w-full">
      <div className="mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h2 className="text-xl font-bold text-stone-900 dark:text-stone-50 transition-colors">Waitlist Master List</h2>
        <div className="flex items-center gap-4">
          <div className="text-sm text-stone-500 dark:text-stone-400">
            Total Users: <span className="font-bold text-stone-900 dark:text-stone-100 transition-colors">{users.length}</span>
          </div>
          <button
            onClick={handleExportCSV}
            className="flex items-center gap-2 px-3 py-1.5 bg-stone-900 dark:bg-stone-50 text-stone-50 dark:text-stone-900 text-xs font-bold uppercase tracking-wider rounded border border-transparent hover:opacity-90 transition-all"
          >
            <Download className="w-3 h-3" />
            Export CSV
          </button>
        </div>
      </div>

      <div className="border border-stone-200 dark:border-stone-800 rounded-lg bg-white dark:bg-stone-900 shadow-sm overflow-hidden transition-colors">
        <div className="overflow-x-auto scrollbar-thin scrollbar-thumb-stone-200 dark:scrollbar-thumb-stone-800">
          <table className="w-full text-left border-collapse min-w-[600px]">
            <thead className="bg-stone-50 dark:bg-stone-800/50 border-b border-stone-200 dark:border-stone-800">
              <tr>
                <th className="px-6 py-4 text-[10px] font-bold text-stone-500 dark:text-stone-400 uppercase tracking-widest transition-colors">User Identity</th>
                <th className="px-6 py-4 text-[10px] font-bold text-stone-500 dark:text-stone-400 uppercase tracking-widest transition-colors">Contact Details</th>
                <th className="px-6 py-4 text-[10px] font-bold text-stone-500 dark:text-stone-400 uppercase tracking-widest text-right transition-colors">Referral Growth</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100 dark:divide-stone-800">
              {users.map((user) => (
                <tr key={user.id} className="hover:bg-stone-50 dark:hover:bg-stone-800/50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="text-sm font-bold text-stone-900 dark:text-stone-100 transition-colors whitespace-nowrap">{user.full_name}</div>
                    <div className="flex flex-wrap gap-2 mt-1">
                      <span className="text-[10px] text-stone-400 dark:text-stone-500 font-mono transition-colors uppercase">ID: {user.id.slice(0, 8)}...</span>
                      <span className="text-[10px] text-primary font-black tracking-tighter uppercase">Code: {user.referral_code}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-xs font-semibold text-stone-600 dark:text-stone-300 transition-colors whitespace-nowrap">{user.email}</div>
                    <div className="text-xs text-stone-400 dark:text-stone-500 transition-colors mt-0.5">{user.phone_number}</div>
                  </td>
                  <td className="px-6 py-4 text-right transition-colors">
                    <button
                      onClick={() => setSelectedUser(user)}
                      className={`inline-flex items-center px-4 py-2 rounded-md text-sm font-bold transition-all ${
                        user.referral_count > 0 
                          ? "bg-primary text-white shadow-sm hover:brightness-110 active:scale-95" 
                          : "bg-stone-50 dark:bg-stone-900 text-stone-300 dark:text-stone-600 cursor-default border border-stone-100 dark:border-stone-800"
                      }`}
                      disabled={user.referral_count === 0}
                    >
                      {user.referral_count}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {selectedUser && (
        <DrillDownTable
          referrerName={selectedUser.full_name}
          referrals={selectedUser.referrals}
          onClose={() => setSelectedUser(null)}
        />
      )}
    </div>
  );
};

export default AdminDashboard;

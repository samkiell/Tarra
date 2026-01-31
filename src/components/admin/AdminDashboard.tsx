"use client";

import React, { useState } from "react";
import DrillDownTable from "./DrillDownTable";

interface AdminUser {
  id: string;
  full_name: string;
  email: string;
  phone_number: string;
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

  return (
    <div className="w-full">
      <div className="mb-8 flex justify-between items-center">
        <h2 className="text-xl font-bold text-stone-900 dark:text-stone-50 transition-colors">Waitlist Master List</h2>
        <div className="text-sm text-stone-500 dark:text-stone-400">
          Total Users: <span className="font-bold text-stone-900 dark:text-stone-100 transition-colors">{users.length}</span>
        </div>
      </div>

      <div className="border border-stone-200 dark:border-stone-800 rounded-lg overflow-hidden bg-white dark:bg-stone-900 shadow-sm transition-colors">
        <table className="w-full text-left">
          <thead className="bg-stone-50 dark:bg-stone-800/50 border-b border-stone-200 dark:border-stone-800">
            <tr>
              <th className="px-6 py-4 text-xs font-bold text-stone-500 dark:text-stone-400 uppercase tracking-wider transition-colors">User</th>
              <th className="px-6 py-4 text-xs font-bold text-stone-500 dark:text-stone-400 uppercase tracking-wider transition-colors">Contact</th>
              <th className="px-6 py-4 text-xs font-bold text-stone-500 dark:text-stone-400 uppercase tracking-wider text-right transition-colors">Referral Count</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-stone-100 dark:divide-stone-800">
            {users.map((user) => (
              <tr key={user.id} className="hover:bg-stone-50 dark:hover:bg-stone-800/50 transition-colors">
                <td className="px-6 py-4">
                  <div className="text-sm font-bold text-stone-900 dark:text-stone-100 transition-colors">{user.full_name}</div>
                  <div className="text-xs text-stone-400 dark:text-stone-500 font-mono transition-colors">{user.id}</div>
                </td>
                <td className="px-6 py-4">
                  <div className="text-sm text-stone-600 dark:text-stone-300 transition-colors">{user.email}</div>
                  <div className="text-sm text-stone-500 dark:text-stone-400 transition-colors">{user.phone_number}</div>
                </td>
                <td className="px-6 py-4 text-right transition-colors">
                  <button
                    onClick={() => setSelectedUser(user)}
                    className={`inline-flex items-center px-4 py-1.5 rounded text-sm font-bold transition-all ${
                      user.referral_count > 0 
                        ? "bg-primary text-white hover:brightness-110" 
                        : "bg-stone-50 dark:bg-stone-900 text-stone-400 dark:text-stone-500 cursor-default border border-stone-100 dark:border-stone-800"
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

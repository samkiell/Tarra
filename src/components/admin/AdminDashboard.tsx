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
        <h1 className="text-2xl font-bold text-stone-900">Waitlist Master List</h1>
        <div className="text-sm text-stone-500">
          Total Users: <span className="font-bold text-stone-900">{users.length}</span>
        </div>
      </div>

      <div className="border border-stone-200 rounded-lg overflow-hidden bg-white shadow-sm">
        <table className="w-full text-left">
          <thead className="bg-stone-50 border-b border-stone-200">
            <tr>
              <th className="px-6 py-4 text-xs font-bold text-stone-500 uppercase tracking-wider">User</th>
              <th className="px-6 py-4 text-xs font-bold text-stone-500 uppercase tracking-wider">Contact</th>
              <th className="px-6 py-4 text-xs font-bold text-stone-500 uppercase tracking-wider text-right">Referral Count</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-stone-100">
            {users.map((user) => (
              <tr key={user.id} className="hover:bg-stone-50 transition-colors">
                <td className="px-6 py-4">
                  <div className="text-sm font-bold text-stone-900">{user.full_name}</div>
                  <div className="text-xs text-stone-400 font-mono">{user.id}</div>
                </td>
                <td className="px-6 py-4">
                  <div className="text-sm text-stone-600">{user.email}</div>
                  <div className="text-sm text-stone-500">{user.phone_number}</div>
                </td>
                <td className="px-6 py-4 text-right">
                  <button
                    onClick={() => setSelectedUser(user)}
                    className={`inline-flex items-center px-3 py-1 rounded text-sm font-bold transition-all ${
                      user.referral_count > 0 
                        ? "bg-stone-900 text-white hover:bg-stone-800 underline decoration-stone-500 underline-offset-4" 
                        : "bg-stone-100 text-stone-400 cursor-default"
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

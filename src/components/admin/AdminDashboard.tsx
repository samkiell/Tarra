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
  isFlagged?: boolean;
  is_ghost?: boolean;
}

interface DashboardMetrics {
  totalUsers: number;
  totalReferrals: number;
  avgReferrals: string;
  topRecruiterCount: number;
}

interface AdminDashboardProps {
  users: AdminUser[];
  metrics: DashboardMetrics;
}

/**
 * AdminDashboard Client Component
 * 
 * Fraud Detection Intent:
 * 1. Ranking: High referral counts are surfaced immediately for audit.
 * 2. Drill-down: Clicking the count allows manual verification of referral quality.
 */
const AdminDashboard: React.FC<AdminDashboardProps> = ({ users, metrics }) => {
  const [selectedUser, setSelectedUser] = useState<AdminUser | null>(null);
  
  // State for optional filters (no complex UI controls)
  const [filters, setFilters] = useState({
    min_referrals: "",
    referred_by: "",
    start_date: "",
    end_date: ""
  });

  const handleExportCSV = () => {
    // Triggers the server-side CSV generation endpoint with filters
    const params = new URLSearchParams();
    if (filters.min_referrals) params.append("min_referrals", filters.min_referrals);
    if (filters.referred_by) params.append("referred_by", filters.referred_by);
    if (filters.start_date) params.append("start_date", filters.start_date);
    if (filters.end_date) params.append("end_date", filters.end_date);
    
    window.location.href = `/api/admin/export-csv?${params.toString()}`;
  };

  return (
    <div className="w-full">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
        <div className="p-4 border border-muted/10 rounded-lg shadow-xl">
          <div className="text-[10px] uppercase font-bold text-secondary tracking-wider mb-1">Total Waitlist</div>
          <div className="text-2xl font-black text-white">{metrics.totalUsers.toLocaleString()}</div>
        </div>
        <div className="p-4 border border-muted/10 rounded-lg shadow-xl">
          <div className="text-[10px] uppercase font-bold text-secondary tracking-wider mb-1">Total Referrals</div>
          <div className="text-2xl font-black text-primary">{metrics.totalReferrals.toLocaleString()}</div>
        </div>
        <div className="p-4 border border-muted/10 rounded-lg shadow-xl">
          <div className="text-[10px] uppercase font-bold text-secondary tracking-wider mb-1">Avg. Referrals</div>
          <div className="text-2xl font-black text-white">{metrics.avgReferrals}</div>
        </div>
        <div className="p-4 border border-muted/10 rounded-lg shadow-xl">
          <div className="text-[10px] uppercase font-bold text-secondary tracking-wider mb-1">Top Recruiter</div>
          <div className="text-2xl font-black text-white">{metrics.topRecruiterCount}</div>
        </div>
      </div>

      <div className="mb-8 flex flex-col gap-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <h2 className="text-xl font-bold text-white transition-colors">Waitlist Master List</h2>
        </div>

        {/* Filter Bar */}
        <div className="w-full p-4 border border-muted/10 rounded-lg flex flex-wrap items-end gap-4 transition-colors">
          <div className="flex flex-col gap-1">
            <label className="text-[10px] uppercase font-bold text-secondary">Min Referrals</label>
            <input 
              type="number" 
              placeholder="0"
              className="px-3 py-1.5 bg-dark border border-muted/20 rounded text-sm w-24 text-white focus:outline-none focus:border-primary"
              value={filters.min_referrals}
              onChange={(e) => setFilters({...filters, min_referrals: e.target.value})}
            />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-[10px] uppercase font-bold text-secondary">Topic / Referrer Code</label>
            <input 
              type="text" 
              placeholder="Filter by code..."
              className="px-3 py-1.5 bg-dark border border-muted/20 rounded text-sm w-40 text-white focus:outline-none focus:border-primary"
              value={filters.referred_by}
              onChange={(e) => setFilters({...filters, referred_by: e.target.value})}
            />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-[10px] uppercase font-bold text-secondary">Date Range</label>
            <div className="flex items-center gap-2">
              <input 
                type="date" 
                className="px-3 py-1.5 bg-dark border border-muted/20 rounded text-sm text-white focus:outline-none focus:border-primary"
                value={filters.start_date}
                onChange={(e) => setFilters({...filters, start_date: e.target.value})}
              />
              <span className="text-secondary">-</span>
              <input 
                type="date" 
                className="px-3 py-1.5 bg-dark border border-muted/20 rounded text-sm text-white focus:outline-none focus:border-primary"
                value={filters.end_date}
                onChange={(e) => setFilters({...filters, end_date: e.target.value})}
              />
            </div>
          </div>
          <button
            onClick={handleExportCSV}
            className="flex items-center gap-2 px-4 py-1.5 bg-primary text-white text-xs font-bold uppercase tracking-wider rounded shadow-lg shadow-primary/20 hover:brightness-110 ml-auto transition-all h-9"
          >
            <Download className="w-3 h-3" />
            Download Filtered CSV
          </button>
        </div>
      </div>

      <div className="border border-muted/10 rounded-lg bg-dark shadow-2xl overflow-hidden transition-colors">
        <div className="overflow-x-auto scrollbar-thin scrollbar-thumb-muted/10">
          <table className="w-full text-left border-collapse min-w-[600px]">
            <thead className="bg-dark border-b border-muted/10">
              <tr>
                <th className="px-6 py-4 text-[10px] font-bold text-secondary uppercase tracking-widest transition-colors">User Identity</th>
                <th className="px-6 py-4 text-[10px] font-bold text-secondary uppercase tracking-widest transition-colors">Contact Details</th>
                <th className="px-6 py-4 text-[10px] font-bold text-secondary uppercase tracking-widest text-right transition-colors">Referral Growth</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-muted/5">
              {users.map((user) => (
                <tr key={user.id} className="hover:bg-primary/5 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                       <div className="text-sm font-bold text-white transition-colors whitespace-nowrap">{user.full_name}</div>
                       {user.isFlagged && (
                         <span className="px-1.5 py-0.5 bg-secondary/10 text-secondary text-[10px] font-black uppercase tracking-wider rounded border border-secondary/20" title="Suspicious activity detected">
                           Flagged
                         </span>
                       )}
                    </div>
                    <div className="flex flex-wrap gap-2 mt-1">
                      <span className="text-[10px] text-secondary/50 font-mono transition-colors uppercase">ID: {user.id.slice(0, 8)}...</span>
                      <span className="text-[10px] text-primary font-black tracking-tighter uppercase">Code: {user.referral_code}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-xs font-semibold text-white/80 transition-colors whitespace-nowrap">{user.email}</div>
                    <div className="text-xs text-secondary transition-colors mt-0.5">{user.phone_number}</div>
                  </td>
                  <td className="px-6 py-4 text-right transition-colors">
                    <button
                      onClick={() => !user.is_ghost && setSelectedUser(user)}
                      className={`inline-flex items-center px-4 py-2 rounded-md text-sm font-bold transition-all ${
                        user.is_ghost
                          ? "bg-dark border border-muted/20 text-secondary/50 cursor-default"
                          : user.referral_count > 0 
                            ? "bg-primary text-white shadow-lg shadow-primary/20 hover:brightness-110 active:scale-95 cursor-pointer" 
                            : "bg-dark border border-muted/10 text-secondary/30 cursor-default"
                      }`}
                      disabled={user.is_ghost || user.referral_count === 0}
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

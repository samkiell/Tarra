"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { LogOut, Loader2 } from "lucide-react";

export const LogoutButton: React.FC = () => {
  const [loading, setLoading] = React.useState(false);
  const router = useRouter();

  const handleLogout = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/auth/logout", {
        method: "POST",
      });
      if (response.ok) {
        window.location.href = "/"; // Force a full reload to clear state
      }
    } catch (error) {
      console.error("Logout failed:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleLogout}
      disabled={loading}
      className="text-xs font-bold text-primary hover:text-white transition-all px-4 py-2 rounded-full border border-primary/20 hover:border-primary/40 bg-primary/5 hover:bg-primary/10 active:scale-95 disabled:opacity-50 flex items-center gap-2 group"
    >
      {loading ? (
        <Loader2 className="w-3.5 h-3.5 animate-spin" />
      ) : (
        <LogOut className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
      )}
      {loading ? "..." : "Logout"}
    </button>
  );
};


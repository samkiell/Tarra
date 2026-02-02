"use client";

import React from "react";
import { useRouter } from "next/navigation";

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
      className="text-xs font-bold text-primary hover:text-primary/80 transition-colors px-3 py-1.5 rounded-full border border-primary/20 hover:border-primary/40 bg-primary/5 active:scale-95 disabled:opacity-50"
    >
      {loading ? "..." : "Logout"}
    </button>
  );
};

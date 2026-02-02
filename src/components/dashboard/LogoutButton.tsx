"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { LogOut, Loader2 } from "lucide-react";

/**
 * LogoutButton Component
 * 
 * Logic:
 * 1. Invokes the logout API to clear the server-side session cookie.
 * 2. Redirects the user back to the homepage.
 */
const LogoutButton: React.FC = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleLogout = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/auth/logout", { method: "POST" });
      if (res.ok) {
        router.push("/");
        router.refresh();
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
      className="text-stone-500 hover:text-stone-900 dark:text-stone-400 dark:hover:text-stone-50 text-sm font-medium transition-colors flex items-center gap-2 disabled:opacity-50"
    >
      {loading ? (
        <Loader2 className="w-4 h-4 animate-spin" />
      ) : (
        <LogOut className="w-4 h-4" />
      )}
      {loading ? "Logging out..." : "Logout"}
    </button>
  );
};

export default LogoutButton;

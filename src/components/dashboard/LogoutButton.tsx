"use client";

import React from "react";
import { useRouter } from "next/navigation";

import { toast } from "react-hot-toast";
import { LogOut } from "lucide-react";

/**
 * LogoutButton Component
 * 
 * Logic:
 * 1. Invokes the logout API to clear the server-side session cookie.
 * 2. Provides feedback via toast.
 * 3. Redirects the user back to the homepage.
 */
const LogoutButton: React.FC = () => {
  const router = useRouter();

  const handleLogout = async () => {
    try {
      const res = await fetch("/api/auth/logout", { method: "POST" });
      if (res.ok) {
        toast.success("Successfully logged out");
        router.push("/");
        router.refresh();
      }
    } catch (error) {
      toast.error("Logout failed");
    }
  };

  return (
    <button
      onClick={handleLogout}
      className="text-stone-500 hover:text-stone-900 text-sm font-medium transition-colors flex items-center gap-2"
    >
      <LogOut className="w-4 h-4" />
      Logout
    </button>
  );
};

export default LogoutButton;

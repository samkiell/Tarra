"use client";

import React from "react";
import { useRouter } from "next/navigation";

/**
 * LogoutButton Component
 * 
 * Logic:
 * 1. Invokes the logout API to clear the server-side session cookie.
 * 2. Redirects the user back to the homepage.
 */
const LogoutButton: React.FC = () => {
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      router.push("/");
      router.refresh();
    } catch (error) {
      console.error("Logout failed", error);
    }
  };

  return (
    <button
      onClick={handleLogout}
      className="text-stone-500 hover:text-stone-900 text-sm font-medium transition-colors"
    >
      Logout
    </button>
  );
};

export default LogoutButton;

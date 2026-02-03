import dbConnect from "@/lib/mongodb";
import Waitlist from "@/models/Waitlist";
import React from "react";
import LeaderboardClient from "./LeaderboardClient";

/**
 * Leaderboard Component
 * 
 * Logic:
 * 1. Database Aggregation: Groups all records by 'referred_by' to calculate counts.
 * 2. Join: Lookups the corresponding user from the same collection to retrieve their name.
 * 3. Sanitization: Splits the full name to show only the first name for privacy.
 * 4. Optimization: Single-pass aggregation avoids N+1 query patterns.
 */
const Leaderboard: React.FC = async () => {
  await dbConnect();

  // Unified Ranking: Fetch top performers (Ghost or Real) based strictly on referral_count
  const users = await Waitlist.find({ referral_count: { $gt: 0 } })
    .sort({ referral_count: -1, full_name: 1 })
    .limit(100);

  const sanitizedData = users.map(user => ({
    _id: user.id,
    firstName: user.full_name.split(" ")[0],
    count: user.referral_count,
    isGhost: user.is_ghost || false,
  }));

  return <LeaderboardClient initialData={sanitizedData} />;
};

export default Leaderboard;

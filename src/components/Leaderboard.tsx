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
interface LeaderboardProps {
  userRank?: number;
}

const Leaderboard: React.FC<LeaderboardProps> = async ({ userRank }) => {
  await dbConnect();

  // Unified Ranking: Fetch top performers and recent joiners. 
  // Sorting by referral_count (top recruiters) then by created_at (most recent joins).
  const users = await Waitlist.find({})
    .sort({ referral_count: -1, created_at: -1 })
    .limit(20);

  const sanitizedData = users.map(user => ({
    _id: user.id,
    firstName: user.full_name.split(" ")[0],
    count: user.referral_count,
    isGhost: user.is_ghost || false,
  }));

  return <LeaderboardClient initialData={sanitizedData} userRank={userRank} />;
};

export default Leaderboard;

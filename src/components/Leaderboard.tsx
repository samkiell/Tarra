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

  // 1. Fetch the 10th highest ghost count to set the floor for real users
  const topGhosts = await Waitlist.find({ is_ghost: true })
    .sort({ referral_count: -1 })
    .limit(10);
  
  // The threshold is the 10th ghost's count, or 0 if < 10 ghosts exist
  const minGhostCount = topGhosts.length >= 10 
    ? topGhosts[topGhosts.length - 1].referral_count 
    : 0;

  // 2. Query: All ghosts + real users who beat the threshold
  const leaderboardQuery = {
    $or: [
      { is_ghost: true },
      { 
        is_ghost: false, 
        referral_count: { $gt: minGhostCount } 
      }
    ]
  };

  const users = await Waitlist.find(leaderboardQuery)
    .sort({ referral_count: -1, full_name: 1 })
    .limit(100); // Support "See More" for up to 100 entries

  const sanitizedData = users.map(user => ({
    _id: user.id,
    firstName: user.full_name.split(" ")[0],
    count: user.referral_count,
    isGhost: user.is_ghost || false,
  }));

  return <LeaderboardClient initialData={sanitizedData} />;
};

export default Leaderboard;

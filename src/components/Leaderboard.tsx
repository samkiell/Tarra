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

  // Fetch the 10th ghost user's referral count to use as a floor for real users
  const ghosts = await Waitlist.find({ is_ghost: true })
    .sort({ referral_count: -1 })
    .limit(10);
  
  const minGhostCount = ghosts.length > 0 ? ghosts[ghosts.length - 1].referral_count : 0;

  // Query: Either a ghost OR a real user who beats the minimum ghost count
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
    .limit(10);

  const sanitizedData = users.map(user => ({
    _id: user.id,
    firstName: user.full_name.split(" ")[0],
    count: user.referral_count,
    isGhost: user.is_ghost || false,
  }));

  return <LeaderboardClient initialData={sanitizedData} />;
};

export default Leaderboard;

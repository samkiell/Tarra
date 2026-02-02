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

  const data = await Waitlist.aggregate([
    {
      $match: {
        referred_by: { $ne: null },
      },
    },
    {
      $group: {
        _id: "$referred_by",
        count: { $sum: 1 },
      },
    },
    {
      $lookup: {
        from: "waitlists",
        localField: "_id",
        foreignField: "referral_code",
        as: "referrer",
      },
    },
    { $unwind: "$referrer" },
    {
      $project: {
        firstName: { $arrayElemAt: [{ $split: ["$referrer.full_name", " "] }, 0] },
        count: 1,
      },
    },
    { $sort: { count: -1, firstName: 1 } },
    { $limit: 100 }, // Fetch up to 100 to support "See More"
  ]);

  // Convert mongoose _id to string for the client component
  const sanitizedData = data.map(item => ({
    ...item,
    _id: item._id.toString()
  }));

  return <LeaderboardClient initialData={sanitizedData} />;
};

export default Leaderboard;

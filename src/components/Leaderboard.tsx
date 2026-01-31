import dbConnect from "@/lib/mongodb";
import Waitlist from "@/models/Waitlist";
import React from "react";

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
        foreignField: "id",
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
    { $limit: 10 },
  ]);

  return (
    <div className="w-full border border-stone-200 dark:border-stone-800 rounded-lg overflow-hidden bg-white dark:bg-stone-900 transition-colors">
      <table className="w-full text-left">
        <thead className="bg-stone-50 dark:bg-stone-800/50 border-b border-stone-200 dark:border-stone-800 transition-colors">
          <tr>
            <th className="px-4 py-3 text-xs font-bold text-stone-500 dark:text-stone-400 uppercase tracking-wider">Rank</th>
            <th className="px-4 py-3 text-xs font-bold text-stone-500 dark:text-stone-400 uppercase tracking-wider">Student</th>
            <th className="px-4 py-3 text-xs font-bold text-stone-500 dark:text-stone-400 uppercase tracking-wider text-right">Referrals</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-stone-100 dark:divide-stone-800 transition-colors">
          {data.length > 0 ? (
            data.map((item, index) => (
              <tr key={item._id as string}>
                <td className="px-4 py-4 text-sm text-stone-500 dark:text-stone-500">#{index + 1}</td>
                <td className="px-4 py-4 text-sm font-medium text-stone-900 dark:text-stone-100">{item.firstName}</td>
                <td className="px-4 py-4 text-sm text-stone-900 dark:text-stone-100 font-bold text-right">{item.count}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={3} className="px-4 py-12 text-center text-stone-400 dark:text-stone-600 text-sm italic">
                The leaderboard is currently empty. Start referring to lead!
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default Leaderboard;

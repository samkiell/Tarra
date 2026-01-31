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
    { $limit: 10 },
  ]);

  return (
    <div className="w-full border border-stone-200 dark:border-stone-800 rounded-lg bg-white dark:bg-stone-900 shadow-sm overflow-hidden transition-colors">
      <div className="overflow-x-auto scrollbar-thin scrollbar-thumb-stone-200 dark:scrollbar-thumb-stone-800">
        <table className="w-full text-left border-collapse min-w-[320px]">
          <thead className="bg-stone-50 dark:bg-stone-950 border-b border-stone-200 dark:border-stone-800 transition-colors">
            <tr>
              <th className="px-4 py-4 text-[10px] font-bold text-primary uppercase tracking-[0.2em] w-16">Rank</th>
              <th className="px-4 py-4 text-[10px] font-bold text-stone-500 dark:text-stone-400 uppercase tracking-[0.2em]">Student Name</th>
              <th className="px-4 py-4 text-[10px] font-bold text-stone-500 dark:text-stone-400 uppercase tracking-[0.2em] text-right">Referrals</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-stone-100 dark:divide-stone-800 transition-colors">
            {data.length > 0 ? (
              data.map((item, index) => (
                <tr key={item._id as string} className="hover:bg-stone-50/50 dark:hover:bg-stone-800/20 transition-colors">
                  <td className="px-4 py-4 text-sm font-bold text-stone-900 dark:text-stone-50">
                    <span className={index < 3 ? "text-primary" : "text-stone-400 dark:text-stone-600"}>
                      {String(index + 1).padStart(2, '0')}
                    </span>
                  </td>
                  <td className="px-4 py-4 text-sm font-semibold text-stone-700 dark:text-stone-200">
                    {item.firstName}
                  </td>
                  <td className="px-4 py-4 text-sm font-bold text-primary text-right tabular-nums">
                    {item.count}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={3} className="px-4 py-16 text-center text-stone-400 dark:text-stone-600 text-sm font-medium italic">
                  The leaderboard is currently empty. Start referring to lead!
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Leaderboard;

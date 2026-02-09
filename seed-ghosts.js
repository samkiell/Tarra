const mongoose = require("mongoose");
const { v4: uuidv4 } = require("uuid");
const fs = require("fs");
const path = require("path");

// 1. Setup Environment
// Reading .env.local manually for the standalone script
const envLocalPath = path.join(__dirname, ".env.local");
const envLocalContent = fs.readFileSync(envLocalPath, "utf8");
const lines = envLocalContent.split("\n");
let MONGODB_URI = lines
  .find((line) => line.trim().startsWith("MONGODB_URI="))
  ?.trim();

if (MONGODB_URI) {
  MONGODB_URI = MONGODB_URI.substring(MONGODB_URI.indexOf("=") + 1)
    .replace(/["']/g, "")
    .trim();
}

if (!MONGODB_URI) {
  console.error("Error: MONGODB_URI not found in .env.local");
  process.exit(1);
}

// 2. Define Schema (Matching Waitlist.ts)
const WaitlistSchema = new mongoose.Schema(
  {
    id: { type: String, required: true, unique: true },
    referral_code: { type: String, required: true, unique: true },
    full_name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phone_number: { type: String, required: true, unique: true },
    interests: { type: [String], default: [] },
    referred_by: { type: String, default: null },
    referral_count: { type: Number, default: 0 },
    is_ghost: { type: Boolean, default: false },
  },
  { timestamps: { createdAt: "created_at", updatedAt: false } },
);

const Waitlist =
  mongoose.models.Waitlist || mongoose.model("Waitlist", WaitlistSchema);

async function seed() {
  try {
    console.log("Connecting to MongoDB...");
    await mongoose.connect(MONGODB_URI);
    console.log("Connected successfully.");

    // Clear existing ghosts
    console.log("Clearing existing ghost users...");
    await Waitlist.deleteMany({ is_ghost: true });

    const ghostNames = [
      "Oluwaseun A.",
      "Chidi O.",
      "Fatima B.",
      "Adebayo S.",
      "Ayomide M.",
      "Blessing J.",
      "Ibrahim K.",
      "Zainab T.",
      "Tunde R.",
      "Ngozi E.",
      "Ayo D.",
      "Bisi L.",
      "Umar P.",
      "Kelechi W.",
      "Sade V.",
      "Musa Q.",
      "Ifunanya G.",
      "Kayode H.",
      "Amaka N.",
      "Yusuf X.",
    ];

    // Generate referral counts
    const counts = [];
    // Rank 1-10: 40-60
    for (let i = 0; i < 10; i++) {
      counts.push(Math.floor(Math.random() * (60 - 40 + 1)) + 40);
    }
    // Rank 11-20: 15-30
    for (let i = 0; i < 10; i++) {
      counts.push(Math.floor(Math.random() * (30 - 15 + 1)) + 15);
    }
    // Ensure descending order for rank alignment
    counts.sort((a, b) => b - a);

    const ghosts = [];
    for (let i = 0; i < ghostNames.length; i++) {
      ghosts.push({
        id: uuidv4(),
        referral_code: `GHOST${i}`,
        full_name: ghostNames[i],
        email: `ghost${i}@student.oauife.edu.ng`,
        phone_number: `080${Math.floor(Math.random() * 90000000 + 10000000)}`,
        interests: ["Buyer", "Seller"],
        referral_count: counts[i],
        is_ghost: true,
      });
    }

    console.log(`Inserting ${ghosts.length} ghost users...`);
    await Waitlist.insertMany(ghosts);

    console.log("-----------------------------------------");
    console.log("✅ SEEDING COMPLETE");
    console.log(`- Total Ghost Users: ${ghosts.length}`);
    console.log("- Distribution:");
    console.log(`  Top 10 : 40-60 referrals`);
    console.log(`  Next 10: 15-30 referrals`);
    console.log("-----------------------------------------");

    process.exit(0);
  } catch (error) {
    console.error("❌ Seeding failed:", error);
    process.exit(1);
  }
}

seed();

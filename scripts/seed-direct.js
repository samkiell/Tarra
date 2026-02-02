const mongoose = require("mongoose");
const { v4: uuidv4 } = require("uuid");

// Minimal Schema to match Waitlist
const WaitlistSchema = new mongoose.Schema({
  id: String,
  referral_code: String,
  full_name: String,
  email: String,
  phone_number: String,
  interests: [String],
  referred_by: String,
  created_at: { type: Date, default: Date.now },
});

const Waitlist = mongoose.model("Waitlist", WaitlistSchema);

async function seed() {
  const uri =
    "mongodb+srv://samkiel:tarradb@tarra.ilt1t88.mongodb.net/test?retryWrites=true&w=majority&appName=Tarra";

  try {
    await mongoose.connect(uri);
    console.log("Connected to MongoDB");

    const nigerianNames = [
      "Tunde Oladipo",
      "Femi Balogun",
      "Chioma Adebayo",
      "Aisha Bello",
      "Sola Popoola",
      "Emeka Obi",
      "Zainab Musa",
      "Babajide Sowore",
      "Ifeoluwa Daniel",
      "Opeyemi Ayinde",
    ];

    const generateCode = () =>
      Math.floor(10000 + Math.random() * 90000).toString();

    const seedUsers = [];
    const seedReferrals = [];

    for (let i = 0; i < nigerianNames.length; i++) {
      const name = nigerianNames[i];
      const referralCode = generateCode();
      const userId = uuidv4();

      seedUsers.push({
        id: userId,
        referral_code: referralCode,
        full_name: name,
        email: `seed_${i}_${referralCode}@student.oauife.edu.ng`,
        phone_number: `080${Math.floor(10000000 + Math.random() * 90000000)}`,
        interests: ["Buyer", "Seller"],
        referred_by: null,
        created_at: new Date(),
      });

      const referralCount = Math.floor(Math.random() * (50 - 15 + 1)) + 15;
      for (let j = 0; j < referralCount; j++) {
        seedReferrals.push({
          id: uuidv4(),
          referral_code: generateCode(),
          full_name: `Student ${i}_${j}`,
          email: `student_${i}_${j}_${i}${j}@student.oauife.edu.ng`,
          phone_number: `090${Math.floor(10000000 + Math.random() * 90000000)}`,
          interests: ["Buyer"],
          referred_by: referralCode,
          created_at: new Date(),
        });
      }
    }

    console.log(
      `Inserting ${seedUsers.length} referrers and ${seedReferrals.length} referrals...`,
    );
    await Waitlist.insertMany([...seedUsers, ...seedReferrals]);
    console.log("Seeding complete!");
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

seed();

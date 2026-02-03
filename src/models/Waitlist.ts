import mongoose, { Schema, Document, Model } from "mongoose";

// Interface defining the Waitlist document structure
// Meaningful comment: Captures verified student identity and contact for the OAU campus commerce ecosystem
export interface IWaitlist extends Document {
  id: string; // Secure UUID for session tracking
  referral_code: string; // Unique 5-digit code for sharing
  full_name: string; 
  email: string; 
  phone_number: string; 
  interests: string[]; 
  referred_by: string | null; 
  referral_count: number;
  is_ghost: boolean;
  created_at: Date; 
}

const WaitlistSchema: Schema = new Schema<IWaitlist>(
  {
    id: {
      type: String,
      required: [true, "Unique ID is required"],
      unique: true,
      trim: true,
    },
    referral_code: {
      type: String,
      required: [true, "Referral code is required"],
      unique: true,
      trim: true,
    },
    full_name: {
      type: String,
      required: [true, "Full name is required"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Email address is required"],
      unique: true, // Database-level constraint to prevent multiple signups from the same student
      lowercase: true,
      trim: true,
      // Meaningful comment: Restricts entry to official OAU student accounts as per project mandate
      match: [/@student\.oauife\.edu\.ng$/, "Please use your official @student.oauife.edu.ng email"],
    },
    phone_number: {
      type: String,
      required: [true, "Phone number is required"],
      unique: true, // Database-level constraint to prevent identity duplication
      trim: true,
      // Meaningful comment: Enforces valid Nigerian mobile format starting with approved prefixes (080, 081, 090, 070)
      match: [/^(080|081|090|070)\d{8}$/, "Please provide a valid 11-digit Nigerian phone number"],
    },
    interests: {
      type: [String],
      default: [],
    },
    referred_by: {
      type: String,
      default: null,
    },
    referral_count: {
      type: Number,
      default: 0,
    },
    is_ghost: {
      type: Boolean,
      default: false,
    },
  },
  {
    // Meaningful comment: Automates registration timestamping for conversion auditing
    timestamps: { createdAt: "created_at", updatedAt: false },
    versionKey: false,
  }
);

// Force-delete model to handle HMR schema updates
if (mongoose.models.Waitlist) {
  delete mongoose.models.Waitlist;
}

const Waitlist: Model<IWaitlist> = mongoose.model<IWaitlist>("Waitlist", WaitlistSchema);

export default Waitlist;

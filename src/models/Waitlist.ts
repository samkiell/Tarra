import mongoose, { Schema, Document, Model } from "mongoose";

// Interface defining the Waitlist document structure
// Meaningful comment: Captures contact information and user interests for the pre-launch phase
export interface IWaitlist extends Document {
  id: string; // Strategic unique identifier, often used for external lookups
  full_name: string; // User's provided legal or preferred name
  email: string; // Primary contact address, must be unique and valid
  interests: string[]; // List of platform features or categories the user is interested in
  referred_by: string | null; // Optional ID or name of the referring entity
  created_at: Date; // Timestamp of the initial registration
}

const WaitlistSchema: Schema = new Schema<IWaitlist>(
  {
    id: {
      type: String,
      required: [true, "Unique ID is required"],
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
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, "Please provide a valid email address"],
    },
    interests: {
      type: [String],
      default: [],
    },
    referred_by: {
      type: String,
      default: null,
    },
  },
  {
    // Meaningful comment: Automates the management of creation and update timestamps
    timestamps: { createdAt: "created_at", updatedAt: false },
    versionKey: false,
  }
);

// Meaningful comment: Prevents model recompilation during HMR (Hot Module Replacement)
const Waitlist: Model<IWaitlist> =
  mongoose.models.Waitlist || mongoose.model<IWaitlist>("Waitlist", WaitlistSchema);

export default Waitlist;

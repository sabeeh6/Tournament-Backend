import mongoose from "mongoose";

const Schema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    category: {
      type: String,
      enum: ["Cricket", "Soccer", "Basketball", "Tennis"],
      required: true,
    },
    description: {
      type: String,
      default: "",
    },
    startDate: {
      type: String,
      required: true,
    },
    endDate: {
      type: String,
      required: true,
    },
    entryFee: {
      type: Number,
      default: 0,
    },
    maxPlayers: {
      type: Number,
      required: true,
    },
    location: {
      type: String,
      required: true,
    },

    applications: [
      {
        captainName: { type: String, required: true, trim: true },
        captainEmail: {
          type: String,
          required: true,
          trim: true,
          match: [/^\S+@\S+\.\S+$/, "Invalid email format"],
        },
        captainPhone: {
          type: String,
          required: true,
          trim: true,
          match: [/^\+?\d{7,15}$/, "Invalid phone number"],
        },
        teamName: { type: String, required: true, trim: true },
        appliedAt: { type: Date, default: Date.now },
      },
    ],

    matches: {
      type: String,
      required: true,
    },
    prizeMoney: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      enum: ["upcoming", "ongoing", "completed", "cancelled"],
      default: "upcoming",
    },
  },
  { timestamps: true }
);

export const tournamentSchema = mongoose.model("Tournament", Schema);

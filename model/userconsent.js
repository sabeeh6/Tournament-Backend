import mongoose from "mongoose";

const userConsentSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    anonymousId: {
      type: String,
      default: null,
    },
    consentType: {
      type: String,
      required: true,
      enum: ["cookies", "analytics", "marketing", "functional", "all"],
    },
    isAccepted: {
      type: Boolean,
      required: true,
    },
    ipAddress: {
      type: String,
      required: true,
    },
    userAgent: {
      type: String,
      required: true,
    },
    source: {
      type: String,
      enum: ["web", "mobile"],
      default: "web",
    },
  },
  {
    timestamps: true,
  }
);

// Indexes for fast queries
userConsentSchema.index({ userId: 1, consentType: 1 });
userConsentSchema.index({ anonymousId: 1, consentType: 1 });
userConsentSchema.index({ consentedAt: -1 });

const UserConsent = mongoose.model("UserConsent", userConsentSchema);

export default UserConsent;

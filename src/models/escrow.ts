import mongoose from "mongoose";
const escrowSchema = new mongoose.Schema(
  {
    creatorUserId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    recipientUserId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    // [countryCode] will be in sender countryCode
    countryCode: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      required: true,
      enum: [
        "created",
        "fund",
        "semeRelease",
        "released",
        "canceled",
        "refund",
      ],
      default: "created",
    },
    releaseConditions: {
      type: String,
      required: true,
    },
    refundReason: {
      type: String,
      default: null,
    },
  },
  { timestamps: true }
);

export default escrowSchema;

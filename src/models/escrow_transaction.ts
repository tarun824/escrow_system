import mongoose from "mongoose";

const escrowTransactionSchema = new mongoose.Schema({
  escrowId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Escrow",
    required: true,
  },
  transactionType: {
    type: String,
    enum: ["fund", "semeRelease", "released", "canceled", "refund"],
    required: true,
  },
  paymentType: {
    type: String,
    // we can extend this
    enum: ["wireTransfer", "upi"],
    required: true,
  },
  status: {
    type: String,
    enum: ["Successful", "InternalError", "ExternalError"],
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  countryCode: {
    type: String,
    required: true,
  },
  transactionDate: {
    type: Date,
    default: Date.now(),
  },
  notes: {
    type: String,
    optional: true,
  },
});

export default escrowTransactionSchema;

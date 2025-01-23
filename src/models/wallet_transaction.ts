import mongoose from "mongoose";

const walletTransactionSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  transactionType: {
    type: String,
    enum: ["credit", "debit"],
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
    min: 0,
  },
  countryCode: {
    type: String,
    required: true,
  },
  transactionDate: {
    type: Date,
    default: Date.now(),
  },
  description: {
    type: String,
    optional: true,
  },
});
export default walletTransactionSchema;

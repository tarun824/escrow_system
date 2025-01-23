import mongoose from "mongoose";

const walletSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  balance: {
    type: Number,
    required: true,
  },
  countryCode: {
    type: String,
    required: true,
  },
});
export default walletSchema;

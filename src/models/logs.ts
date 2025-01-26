import mongoose from "mongoose";

const LogsSchema = new mongoose.Schema({
  endpoint: {
    type: String,
    required: true,
  },
  method: {
    type: String,
    required: true,
  },
  responseTime: {
    type: String,
    required: true,
  },
  timestamp: {
    type: Date,
    required: true,
  },
  statusCode: {
    type: Number,
    required: true,
  },
});
export default LogsSchema;

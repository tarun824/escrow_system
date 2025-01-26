import express from "express";
import { PrismaClient } from "@prisma/client";
import mainRouter from "./router/main_router";
import databaseConnection from "./utils/database_connection";
import mongoose from "mongoose";
import userSchema from "./models/user";
import walletSchema from "./models/wallet";
import walletTransactionSchema from "./models/wallet_transaction";
import escrowSchema from "./models/escrow";
import escrowTransactionSchema from "./models/escrow_transaction";
import CurrencyConverter from "currency-converter-lt";
import { rateLimit } from "express-rate-limit";
import LogsSchema from "./models/logs";
import LogsMiddleware from "./middleware/activity/logs_middlewaer";
import IORedis from "ioredis";

import SendEmail from "./utils/send_email";

const prisma = new PrismaClient();
const app = express();

app.use(express.json());

app.get("/", async (req, res) => {
  SendEmail();
  res.send("Server is up and Running");
});

const redisClient = new IORedis(process.env.REDIS_URL ?? "", {
  maxRetriesPerRequest: null,
});

async function redisConnection() {
  // await redisClient.connect();
  console.log("Redis connected");
}
// redisConnection();
// redisClient.on("error", (e) => {
//   console.log("Redis error:" + e);
// });

databaseConnection();
const User = mongoose.model("User", userSchema);
const Wallet = mongoose.model("Wallet", walletSchema);
const WalletTransaction = mongoose.model(
  "WalletTransaction",
  walletTransactionSchema
);
const Escrow = mongoose.model("Excrow", escrowSchema);
const EscrowTransaction = mongoose.model(
  "EscrowTransaction",
  escrowTransactionSchema
);
const Logs = mongoose.model("Logs", LogsSchema);

// Rate Limiter
const rateLimiter = rateLimit({
  // 15 min
  windowMs: 15 * 60 * 1000,
  limit: 100,
  message: "Too many request,Please try later",
});
app.use(rateLimiter);
app.use(LogsMiddleware);
app.use("/api/service", mainRouter);

app.listen(3000, () => {
  console.log("Server is running at port 3000");
});

export {
  app,
  prisma,
  User,
  Wallet,
  WalletTransaction,
  Escrow,
  EscrowTransaction,
  Logs,
  redisClient,
};

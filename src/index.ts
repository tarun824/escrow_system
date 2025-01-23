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

const prisma = new PrismaClient();
const app = express();

app.use(express.json());
app.get("/", async (req, res) => {
  try {
    const currencyConverter = new CurrencyConverter({
      from: "INR",
      to: "INR",
      amount: 100,
    });

    console.log(await currencyConverter.convert());
  } catch (e) {}
  res.send("Server is up and Running");
});

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
};

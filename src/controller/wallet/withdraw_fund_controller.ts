import { Request, Response } from "express";
import { makeTokenInvalid } from "../../utils/jwt_token";
import { Wallet, WalletTransaction } from "../../index";
import transactionSchema from "../../utils/zod_schema/transaction_schema";
import CurrencyConverter from "currency-converter-lt";

const WithdrawFundController = async (
  req: Request,
  res: Response
): Promise<any> => {
  let { paymentType, amount, countryCode, description } = req.body;

  const schemaStatus = transactionSchema.safeParse({
    paymentType,
    amount,
    countryCode,
    description,
  });
  if (!schemaStatus.success) {
    return res.send({
      status: 0,
      message: "Validation Failed: " + schemaStatus.error.toString(),
    });
  }

  const wallet = await Wallet.findOne({ userId: req.user._id });
  if (!wallet) {
    return res.send({ status: 0, message: "Something went wrong" });
  }

  if (countryCode !== wallet.countryCode) {
    // convert that amount to the country code that is in wallet
    try {
      const currencyConverter = new CurrencyConverter({
        from: countryCode,
        to: wallet.countryCode,
        amount: amount,
      });

      amount = await currencyConverter.convert();
    } catch (e) {
      await WalletTransaction.create({
        userId: req.user._id,
        transactionType: "debit",
        paymentType: paymentType,
        status: "InternalError",
        amount: amount,
        countryCode: countryCode,
        description: e,
      });
      return res.send({
        status: 0,
        message: "Could not convert amount to wallet currency ",
      });
    }
  }

  if (wallet.balance < amount) {
    await WalletTransaction.create({
      userId: req.user._id,
      transactionType: "debit",
      paymentType: paymentType,
      status: "InternalError",
      amount: amount,
      countryCode: countryCode,
      description: "Wallet balance is less than Withdraw amount",
    });
    return res.send({
      status: 0,
      message: "Wallet balance is less than Withdraw amount",
    });
  }
  wallet.balance = wallet.balance - amount;
  await wallet.save();

  await WalletTransaction.create({
    userId: req.user._id,
    transactionType: "debit",
    paymentType: paymentType,
    status: "Successful",
    amount: amount,
    countryCode: countryCode,
    description: description,
  });

  return res.send({ status: 1, data: { balance: wallet.balance } });
};
export default WithdrawFundController;

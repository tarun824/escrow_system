import { Request, Response } from "express";
import { Escrow, EscrowTransaction, Wallet } from "../../index";
import escrowTransactionZodSchema from "../../utils/zod_schema/escrow_transaction_zod_schema";
import CurrencyConverter from "currency-converter-lt";

const FundEscrowController = async (
  req: Request,
  res: Response
): Promise<any> => {
  let {
    recipientUserId,
    paymentType,
    amount,
    countryCode,
    releaseConditions,
    description,
  } = req.body;

  const schemaStatus = escrowTransactionZodSchema.safeParse({
    recipientUserId,
    paymentType,
    amount,
    countryCode,
    releaseConditions,
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
  const recipientWallet = await Wallet.findOne({ _id: recipientUserId });
  if (!recipientWallet) {
    return res.send({
      status: 0,
      message: "Something went wrong at Recipient side",
    });
  }

  // check if there is escrow created
  let escrow = await Escrow.findOne({ creatorUserId: req.user._id });

  if (!escrow) {
    escrow = await Escrow.create({
      creatorUserId: req.user._id,
      recipientUserId,
      amount: 0,
      countryCode: req.user.countryCode,
      releaseConditions,
    });
  }

  if (countryCode !== wallet.countryCode) {
    // convert that amount to the country code that is in sender country code

    try {
      const currencyConverter = new CurrencyConverter({
        from: countryCode,
        to: wallet.countryCode,
        amount: amount,
      });

      amount = await currencyConverter.convert();
    } catch (e) {
      await EscrowTransaction.create({
        escrowId: escrow._id,
        transactionType: "fund",
        paymentType: paymentType,
        status: "InternalError",
        amount: amount,
        countryCode: countryCode,
        notes: e,
      });
      return res.send({
        status: 0,
        message: "Could not convert amount to Sender currency ",
      });
    }
  }
  if (wallet.balance < amount) {
    await EscrowTransaction.create({
      escrowId: escrow._id,
      transactionType: "fund",
      paymentType: paymentType,
      status: "InternalError",
      amount: amount,
      countryCode: countryCode,
      notes: "Wallet balance is less than Withdraw amount",
    });
    return res.send({
      status: 0,
      message: "Wallet balance is less than Withdraw amount",
    });
  }
  //   Add amount to Escrow
  escrow.amount = escrow.amount + amount;
  // Minus amount from Sender
  wallet.balance = wallet.balance - amount;
  await wallet.save();
  await escrow.save();
  await EscrowTransaction.create({
    escrowId: escrow._id,
    transactionType: "fund",
    paymentType: paymentType,
    status: "Successful",
    amount: amount,
    countryCode: countryCode,
    notes: "Successful",
  });

  return res.send({ status: 1, data: { balance: escrow.amount } });
};
export default FundEscrowController;

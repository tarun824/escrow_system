import { Request, Response } from "express";
import { Escrow, EscrowTransaction, Wallet } from "../../index";
import { z } from "zod";
import releaseEscrowZodSchema from "../../utils/zod_schema/release_escrow_zod_schema";
import CurrencyConverter from "currency-converter-lt";

const ReleaseEscrowController = async (
  req: Request,
  res: Response
): Promise<any> => {
  let {
    escrowId,
    paymentType,
    amount,
    countryCode,
    releaseConditions,
    description,
  } = req.body;
  let amountAccordingTorecipient = 0;
  const schemaStatus = releaseEscrowZodSchema.safeParse({
    escrowId,
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
  // check if there is escrow created
  const escrow = await Escrow.findOne({ creatorUserId: req.user._id });

  if (!escrow) {
    return res.send({
      status: 0,
      message: "Something went wrong",
    });
  }

  const wallet = await Wallet.findOne({ userId: req.user._id });
  if (!wallet) {
    return res.send({ status: 0, message: "Something went wrong" });
  }
  const recipientWallet = await Wallet.findOne({ _id: escrow.recipientUserId });
  if (!recipientWallet) {
    return res.send({
      status: 0,
      message: "Something went wrong at Recipient side",
    });
  }

  // HERE the amount will be in sender country code or escrow country code
  if (amount > escrow.amount) {
    await EscrowTransaction.create({
      escrowId: escrow._id,
      transactionType: "released",
      paymentType: paymentType,
      status: "InternalError",
      amount: amount,
      countryCode: countryCode,
      notes: "escrow account balance is less than release amount",
    });
    return res.send({
      status: 0,
      notes: "escrow account balance is less than release amount",
    });
  }
  amountAccordingTorecipient = amount;
  // now we haev checked the balance of sender wallet in his country code and then now we are
  // transfering ammount to recipient wallet in recipient country code
  if (recipientWallet.countryCode !== wallet.countryCode) {
    // convert that amount to  recipient country code
    try {
      const currencyConverter = new CurrencyConverter({
        from: wallet.countryCode,
        to: recipientWallet.countryCode,
        amount: amount,
      });

      amountAccordingTorecipient = await currencyConverter.convert();
    } catch (e) {
      await EscrowTransaction.create({
        escrowId: escrow._id,
        transactionType: "canceled",
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
  // now the amout will be in recipient country code

  //   Minus amount frim Escrow
  escrow.amount = escrow.amount - amount;
  escrow.status = "released";
  await escrow.save();
  // Add amount to recipient
  recipientWallet.balance =
    recipientWallet.balance + amountAccordingTorecipient;
  await recipientWallet.save();

  await EscrowTransaction.create({
    escrowId: escrow._id,
    transactionType: "released",
    paymentType: paymentType,
    status: "Successful",
    amount: amountAccordingTorecipient,
    countryCode: recipientWallet.countryCode,
    notes: "Successful",
  });

  return res.send({ status: 1, data: { balance: escrow.amount } });
};
export default ReleaseEscrowController;

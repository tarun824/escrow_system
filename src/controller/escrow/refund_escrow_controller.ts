import { Request, Response } from "express";
import { Escrow, EscrowTransaction, Wallet } from "../../index";
import refundEscrowZodSchema from "../../utils/zod_schema/refund_escrow_zod_schema";

const RefundEscrowController = async (
  req: Request,
  res: Response
): Promise<any> => {
  let {
    escrowId,
    paymentType,
    amount,
    countryCode,
    releaseConditions,
    refundReason,
  } = req.body;
  const schemaStatus = refundEscrowZodSchema.safeParse({
    escrowId,
    paymentType,
    amount,
    countryCode,
    releaseConditions,
    refundReason,
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
  // Add amount to Sender
  wallet.balance = wallet.balance + escrow.amount;
  await wallet.save();
  // Minus mount from escrow
  escrow.amount = 0;
  escrow.status = "refund";
  await escrow.save();

  await EscrowTransaction.create({
    escrowId: escrow._id,
    transactionType: "refund",
    paymentType: paymentType,
    status: "Successful",
    amount: amount,
    countryCode: wallet.countryCode,
    notes: "Successful",
  });

  return res.send({ status: 1, data: { balance: escrow.amount } });
};
export default RefundEscrowController;

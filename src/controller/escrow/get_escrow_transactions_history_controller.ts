import { Request, Response } from "express";
import { Escrow, EscrowTransaction, Wallet } from "../../index";
import { z } from "zod";

const esroHisSchema = z.object({
  escrowId: z.string().min(4, "Enter correct escrow Id"),
  date: z.string().min(4, "Enter correct date formate"),
  limit: z
    .number()
    .int({ message: "Limit must be an integer." })
    .positive({ message: "Limit must be a positive number." })
    .optional(),
  skip: z
    .number()
    .int({ message: "Skip must be an integer." })
    .nonnegative({ message: "Skip must be a non-negative number." })
    .optional(),
});

const GetEscrowTransactionHistroyController = async (
  req: Request,
  res: Response
): Promise<any> => {
  let { escrowId, date, limit, skip } = req.body;
  const schemaStatus = esroHisSchema.safeParse({
    escrowId,
    date,
    limit,
    skip,
  });
  if (!schemaStatus.success) {
    return res.send({
      status: 0,
      message: "Validation Failed: " + schemaStatus.error.toString(),
    });
  }

  // check weather this user is createor or recipient then only we should share them
  const isUserValidForHistory = await Escrow.findOne({
    _id: escrowId,

    $or: [{ creatorUserId: req.user._id }, { recipientUserId: req.user._id }],
  });

  if (!isUserValidForHistory) {
    return res.status(401).send({
      status: 0,
      message: "Unauthorized Access",
    });
  }

  // check if there is escrow created
  const escrow = await EscrowTransaction.find({
    escrowId: escrowId,
    transactionDate: {
      $lt: date,
    },
  })
    .skip(skip)
    .limit(limit);

  return res.send({ status: 1, data: { history: escrow } });
};
export default GetEscrowTransactionHistroyController;

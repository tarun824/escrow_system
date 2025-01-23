import { Request, Response } from "express";
import { makeTokenInvalid } from "../../utils/jwt_token";
import { Wallet } from "../../index";

const ViewBalanceController = async (
  req: Request,
  res: Response
): Promise<any> => {
  const wallet = await Wallet.findOne({ userId: req.user._id });
  if (!wallet) {
    return res.send({ status: 0, message: "Something went wrong" });
  }
  return res.send({ status: 1, data: { balance: wallet.balance } });
};
export default ViewBalanceController;

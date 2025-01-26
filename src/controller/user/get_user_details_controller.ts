import { Request, Response } from "express";
import { Escrow, EscrowTransaction, redisClient, User } from "../../index";
import { z } from "zod";

const GetUserDetailsController = async (
  req: Request,
  res: Response
): Promise<any> => {
  // check user data is in cache
  let chacheUser = await redisClient.get("user:" + req.user._id);
  if (chacheUser) {
    chacheUser = JSON.parse(chacheUser);
    return res.send({ status: 1, data: chacheUser });
  }

  chacheUser = await User.findOne({
    _id: req.user._id,
  });

  if (!chacheUser) {
    return res.send({
      status: 0,
      message: "User Not found",
    });
  }
  // store data in redis
  await redisClient.set("user:" + req.user._id, JSON.stringify(chacheUser));

  return res.send({ status: 1, data: chacheUser });
};
export default GetUserDetailsController;

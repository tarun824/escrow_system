import { NextFunction, Request, Response } from "express";
import { verifyToken } from "../utils/jwt_token";
import { TokenPayload } from "../interfaces/token_payload";
import { User } from "../index";

const UserMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<any> => {
  const token = req.headers.token;
  if (!token) {
    return res.status(403).send({ statusCode: 0, message: "Please login" });
  }
  try {
    const isUser = verifyToken({ token: token as string });

    if (!isUser) {
      return res.status(403).send({ statusCode: 0, message: "Please login" });
    }

    const { email, password, isValid } = isUser;

    if (!isValid) {
      return res.status(403).send({ statusCode: 0, message: "Please login" });
    }

    let isUserInDB = await User.findOne({ email: email });

    if (isUserInDB) {
      req.user = isUserInDB;
      next();
    } else {
      return res.status(403).send({ statusCode: 0, message: "Please login" });
    }
  } catch (e) {
    return res.status(403).send({ statusCode: 0, message: "Please login" });
  }
};
export default UserMiddleware;

import { Request, Response } from "express";
import { makeTokenInvalid } from "../../utils/jwt_token";

const LogoutController = async (req: Request, res: Response): Promise<any> => {
  const { token }: { token: string } = req.body;

  const { email, password } = req.user;

  const getinvalidToken = makeTokenInvalid({ email: email, pass: password });
  return res.send({ status: 1, token: token });
};
export default LogoutController;

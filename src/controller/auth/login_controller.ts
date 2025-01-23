import { Request, Response } from "express";
import { LoginInterface } from "../../interfaces/login_interface";
import { z } from "zod";
import { ComparePassword, HashPassword } from "../../utils/password_hash";
import { generateToken } from "../../utils/jwt_token";
import { User } from "../../index";
const LoginController = async (req: Request, res: Response): Promise<any> => {
  const { email, password } = req.body as LoginInterface;
  const loginSchema = z.object({
    email: z.string().email("Invalid email formate"),
    password: z.string().min(8, "Password must be at least 8 characters long"),
  });

  const loginDetails = {
    email: email,
    password: password,
  };
  const schemaStatus = loginSchema.safeParse(loginDetails);
  // send message if the formate is nor correect
  if (!schemaStatus.success) {
    return res.send({
      status: 0,
      message: "Validation Failed: " + schemaStatus.error.toString(),
    });
  }

  const user = await User.findOne({
    email: email as string,
  });
  if (!user) {
    return res.send({ status: 0, message: "User not found" });
  }
  // check password
  const isPassCorrect = await ComparePassword({
    pass: password as string,
    hash: user.password,
  });
  if (!isPassCorrect) {
    return res.send({ status: 0, message: "Password is Incorrect" });
  }
  const hashedPass = await HashPassword({ pass: password as string });
  // generate token
  const token = generateToken({
    email: email as string,
    pass: hashedPass as string,
  });

  res.send({ status: 1, token: token });
};
export default LoginController;

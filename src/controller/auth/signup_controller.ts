import { NextFunction, Request, Response } from "express";
import { SignupInterface } from "../../interfaces/signup_interface";
import { string, z } from "zod";
import { HashPassword } from "../../utils/password_hash";
import { generateToken } from "../../utils/jwt_token";
import { User, Wallet } from "../../index";

const SignupController = async (req: Request, res: Response): Promise<any> => {
  const { name, email, password, phoneNo, countryCode } =
    req.body as SignupInterface;
  const signupSchema = z.object({
    name: z.string().min(3, "Name must be at least 3 characters long "),
    email: z.string().email("Invalid email format."),
    password: z.string().min(8, "Password must be at least 8 characters long"),
    phoneNo: z.string(),
    countryCode: z
      .string()
      .length(2, { message: "Country code must be exactly 2 characters." }),
  });

  const schemaStatus = signupSchema.safeParse({
    name,
    email,
    password,
    phoneNo,
    countryCode,
  });
  if (!schemaStatus.success) {
    return res.send({
      status: 0,
      message: "Validation Failed: " + schemaStatus.error.toString(),
    });
  }
  console.log(email);
  console.log(typeof email);

  const isUserPresent = await User.findOne({
    email: email,
  });
  if (isUserPresent) {
    return res.send({ status: 0, message: "User already present" });
  }
  // hash the pasword
  const hashedPass = await HashPassword({ pass: password as string });
  const newUser = await User.create({
    name: name as string,
    email: email as string,
    password: hashedPass,
    phoneNo: phoneNo as string,
    countryCode: countryCode as string,
  });
  await Wallet.create({
    userId: newUser._id,
    balance: 0,
    countryCode: countryCode as string,
  });
  // generate token
  const token = generateToken({ email: email as string, pass: hashedPass });

  return res.send({ status: 1, token: token });
};
export default SignupController;

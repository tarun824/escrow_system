import { z } from "zod";

const transactionSchema = z.object({
  paymentType: z.enum(["wireTransfer", "upi"]),
  amount: z
    .number()
    .min(0, "Amount is required and must be a non-negative number."),
  countryCode: z
    .string()
    .min(1, "Country code is required and cannot be empty."),
  description: z.string().optional(),
});
export default transactionSchema;

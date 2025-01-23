import { z } from "zod";

const refundEscrowZodSchema = z.object({
  escrowId: z.string().min(3, "escrowId is Empty "),
  paymentType: z.enum(["wireTransfer", "upi"]),
  amount: z
    .number()
    .min(0, "Amount is required and must be a non-negative number."),
  countryCode: z
    .string()
    .min(1, "Country code is required and cannot be empty."),
  releaseConditions: z
    .string()
    .min(1, "Release Conditions is required and cannot be empty."),
  refundReason: z.string().min(2, "Refund Reason is Empty"),
});
export default refundEscrowZodSchema;

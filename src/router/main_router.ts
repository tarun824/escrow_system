import express from "express";
import authRouter from "./auth/auth_router";
import escrowRouter from "./escrow/escrow_router";
import walletRouter from "./wallet/wallet_router";
import userRouter from "./user/user_router";
import activityRouter from "./activity/activity_router";

const mainRouter = express.Router();

mainRouter.use("/auth", authRouter);
mainRouter.use("/escrow", escrowRouter);
mainRouter.use("/wallet", walletRouter);
mainRouter.use("/user", userRouter);
mainRouter.use(activityRouter);

export default mainRouter;

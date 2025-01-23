import express from "express";
import UserMiddleware from "../../middleware/user_middleware";
import AddFundController from "../../controller/wallet/add_fund_controller";
import WithdrawFundController from "../../controller/wallet/withdraw_fund_controller";
import ViewBalanceController from "../../controller/wallet/view_balance_controller";
const walletRouter = express.Router();

walletRouter.get("/add_fund", UserMiddleware, AddFundController);
walletRouter.get("/withdraw_fund", UserMiddleware, WithdrawFundController);
walletRouter.get("/view_balance", UserMiddleware, ViewBalanceController);

export default walletRouter;

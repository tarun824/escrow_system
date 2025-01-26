import express from "express";
import UserMiddleware from "../../middleware/user_middleware";
import FundEscrowController from "../../controller/escrow/fund_escrow_controller";
import ReleaseEscrowController from "../../controller/escrow/release_escrow_controller";
import RefundEscrowController from "../../controller/escrow/refund_escrow_controller";
import GetEscrowTransactionHistroyController from "../../controller/escrow/get_escrow_transactions_history_controller";
const escrowRouter = express.Router();

escrowRouter.post("/fund_escrow", UserMiddleware, FundEscrowController);
escrowRouter.post("/release_escrow", UserMiddleware, ReleaseEscrowController);
escrowRouter.post("/refund_escrow", UserMiddleware, RefundEscrowController);
escrowRouter.get(
  "/escrow_trx_histroy",
  UserMiddleware,
  GetEscrowTransactionHistroyController
);

export default escrowRouter;

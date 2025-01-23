import express from "express";
import UserMiddleware from "../../middleware/user_middleware";
import FundEscrowController from "../../controller/escrow/fund_escrow_controller";
import ReleaseEscrowController from "../../controller/escrow/release_escrow_controller";
import RefundEscrowController from "../../controller/escrow/refund_escrow_controller";
const escrowRouter = express.Router();

escrowRouter.get("/fund_escrow", UserMiddleware, FundEscrowController);
escrowRouter.get("/release_escrow", UserMiddleware, ReleaseEscrowController);
escrowRouter.get("/refund_escrow", UserMiddleware, RefundEscrowController);

export default escrowRouter;

import express from "express";
import UserMiddleware from "../../middleware/user_middleware";
import GetUserDetailsController from "../../controller/user/get_user_details_controller";
const userRouter = express.Router();

userRouter.get("/get_user_details", UserMiddleware, GetUserDetailsController);

export default userRouter;

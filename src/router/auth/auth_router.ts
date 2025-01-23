
import express from 'express';
import SignupController from '../../controller/auth/signup_controller';
import LoginController from '../../controller/auth/login_controller';
import UserMiddleware from '../../middleware/user_middleware';
import LogoutController from '../../controller/auth/logout_controller';
const authRouter = express.Router();

authRouter.post("/signup", SignupController)
authRouter.get("/login", LoginController)
authRouter.get("/logout", UserMiddleware, LogoutController)



export default authRouter;
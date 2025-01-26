import express from "express";
import HealthController from "../../controller/activity/health_controller";
const activityRouter = express.Router();

activityRouter.get("/health", HealthController);

export default activityRouter;

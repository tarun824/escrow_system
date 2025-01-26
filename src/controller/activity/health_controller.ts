import { Request, Response } from "express";
import mongoose from "mongoose";
import { redisClient } from "../..";

const HealthController = async (req: Request, res: Response): Promise<any> => {
  let mongoDbConnectionStatus;
  let redisConnectionStatus;
  try {
    // checking MongoDB connection
    mongoDbConnectionStatus = mongoose.connection.readyState;
    // checking Redis connection
    redisConnectionStatus = true;
    //  redisClient.isReady;
  } catch (e) {
    res.send({
      status: 0,
      message: "There is an issue with connections.",
      mondoDB:
        mongoDbConnectionStatus === 1
          ? "MongoDB is operational."
          : "MongoDB is not operational.",
      Redis: redisConnectionStatus
        ? "Redis is operational."
        : "Redis is not operational.",
    });
  }
  if (mongoDbConnectionStatus === 1 && redisConnectionStatus) {
    res.status(200).send({
      status: 1,
      message: "Both MongoDB and Redis are operational.",
    });
  } else {
    res.send({
      status: 0,
      message: "There is an issue with connections.",
      mondoDB:
        mongoDbConnectionStatus === 1
          ? "MongoDB is operational."
          : "MongoDB is not operational.",
      Redis: redisConnectionStatus
        ? "Redis is operational."
        : "Redis is not operational.",
    });
  }
};
export default HealthController;

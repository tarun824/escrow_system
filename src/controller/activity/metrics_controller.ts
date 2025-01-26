import { Request, Response } from "express";
import express from "express";

const metricsRouter = express.Router();
import * as client from "prom-client";
metricsRouter.get(
  "/metrics",
  async (req: Request, res: Response): Promise<any> => {
    res.setHeader("Content-Type", client.register.contentType);
    const metrics = await client.register.metrics();
    res.send(metrics);
  }
);

module.exports = metricsRouter;

import { NextFunction, Request, Response } from "express";
import { Logs } from "../../index";

const LogsMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<any> => {
  const startingReq = Date.now();
  await Logs.create({
    endpoint: req.originalUrl,
    method: req.method,
    responseTime: Date.now() - startingReq + "ms",
    statusCode: res.statusCode,
    timestamp: new Date(),
  });
  next();
};
export default LogsMiddleware;

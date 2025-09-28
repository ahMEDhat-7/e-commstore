import express, { Response, NextFunction, Request } from "express";
import { adminRoute, protectRoute } from "../middlewares/auth.middleware";
import {
  getAnalyticsData,
  getDailySalesData,
} from "../services/analytics.service";
import asyncWrapper from "../middlewares/asyncWrapper";
import { CustomError } from "../utils/customError";

const router = express.Router();

router.get(
  "/",
  protectRoute,
  adminRoute,
  asyncWrapper(async (req: Request, res: Response, next: NextFunction) => {
    try {
      const analyticsData = await getAnalyticsData();

      const endDate = new Date();
      const startDate = new Date(endDate.getTime() - 7 * 24 * 60 * 60 * 1000);

      const dailySalesData = await getDailySalesData(startDate, endDate);

      return res.status(200).json({
        analyticsData,
        dailySalesData,
      });
    } catch (error) {
      console.log("Error in analytics route", error);
      return next(new CustomError(500, "Server Error"));
    }
  })
);

export default router;

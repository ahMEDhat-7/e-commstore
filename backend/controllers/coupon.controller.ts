import Coupon from "../models/coupon.model";
import asyncWrapper from "../middlewares/asyncWrapper";
import { CustomError } from "../utils/customError";

export const getCoupon = asyncWrapper(async (req, res, next) => {
  try {
    const user = (req as any)["user"];
    const coupon = await Coupon.findOne({
      userId: user._id,
      isActive: true,
    });
    res.json(coupon || null);
  } catch (error) {
    return next(new CustomError(500, "Server error"));
  }
});

export const validateCoupon = asyncWrapper(async (req, res, next) => {
  try {
    const { code } = req.body;
    const user = (req as any)["user"];
    const coupon = await Coupon.findOne({
      code: code,
      userId: user._id,
      isActive: true,
    });

    if (!coupon) {
      return res.status(404).json({ message: "Coupon not found" });
    }

    if (coupon.expirationDate < new Date()) {
      coupon.isActive = false;
      await coupon.save();
      return res.status(404).json({ message: "Coupon expired" });
    }

    res.json({
      message: "Coupon is valid",
      code: coupon.code,
      discountPercentage: coupon.discountPercentage,
    });
  } catch (error) {
    return next(new CustomError(500, "Server error"));
  }
});

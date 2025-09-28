import { createAsyncThunk } from "@reduxjs/toolkit";
import { fetchMyCoupon, validateCoupon } from "../../common/api/couponApi";

export const getMyCouponThunk = createAsyncThunk(
  "coupon/getMyCoupon",
  async () => {
    const response = await fetchMyCoupon();
    return response;
  }
);

export const applyCouponThunk = createAsyncThunk(
  "coupon/applyCoupon",
  async (code: string) => {
    const response = await validateCoupon(code);
    return response;
  }
);

import { createSlice } from "@reduxjs/toolkit";
import type { RootState } from "../store";
import { applyCouponThunk, getMyCouponThunk } from "./couponThunk";

export interface CouponType {
  code: string;
  discountPercentage: number;
}

interface CouponState {
  coupon: CouponType | null;
  isCouponApplied: boolean;
  loading: boolean;
  error: string | null;
}

const initialState: CouponState = {
  coupon: null,
  isCouponApplied: false,
  loading: false,
  error: null,
};

const couponSlice = createSlice({
  name: "coupon",
  initialState,
  reducers: {
    removeCoupon(state) {
      state.coupon = null;
      state.isCouponApplied = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getMyCouponThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getMyCouponThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.coupon = action.payload;
      })
      .addCase(getMyCouponThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch coupon";
      })
      .addCase(applyCouponThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(applyCouponThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.coupon = action.payload;
        state.isCouponApplied = true;
      })
      .addCase(applyCouponThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to apply coupon";
      });
  },
});

export const { removeCoupon } = couponSlice.actions;
export const selectCoupon = (state: RootState) => state.coupon;
export default couponSlice.reducer;


import { createSlice } from "@reduxjs/toolkit";
import {
  getCartThunk,
  addCartItemThunk,
  updateCartItemThunk,
  removeCartItemThunk,
  clearCartThunk,
  getMyCouponThunk,
  applyCouponThunk,
} from "./cartThunk";
import type { RootState } from "../store";


export interface CartItemType {
  _id: string;
  name: string;
  image: string;
  price: number;
  quantity: number;
}

export interface CouponType {
  code: string;
  discountPercentage: number;
}


interface CartState {
  items: CartItemType[];
  loading: boolean;
  error: string | null;
  coupon: CouponType | null;
  isCouponApplied: boolean;
  couponLoading: boolean;
  couponError: string | null;
  subtotal: number;
  total: number;
}


const initialState: CartState = {
  items: [],
  loading: false,
  error: null,
  coupon: null,
  isCouponApplied: false,
  couponLoading: false,
  couponError: null,
  subtotal: 0,
  total: 0,
};


const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    removeCoupon(state) {
      state.coupon = null;
      state.isCouponApplied = false;
      state.couponError = null;
      state.total = state.subtotal;
    },
    calculateTotals(state) {
      state.subtotal = state.items.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
      );
      if (state.coupon && state.isCouponApplied) {
        state.total = Math.max(
          0,
            state.subtotal - (state.subtotal * state.coupon.discountPercentage) / 100
        );
      } else {
        state.total = state.subtotal;
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getCartThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getCartThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload.cartItems;
      })
      .addCase(getCartThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch products";
      })
      .addCase(addCartItemThunk.fulfilled, (state, action) => {
        state.items.push(...action.payload.cartItems);
      })
      .addCase(updateCartItemThunk.fulfilled, (state, action) => {
        const updatedItem = action.payload.cartItems;
        if (!updatedItem || !updatedItem.productId) return;
        const idx = state.items.findIndex((c) => c._id === updatedItem._id);
        if (idx !== -1) state.items[idx] = updatedItem;
      })
      .addCase(removeCartItemThunk.fulfilled, (state, action) => {
        state.items = state.items.filter((c) => c._id !== action.meta.arg);
      })
      .addCase(clearCartThunk.fulfilled, (state) => {
        state.items = [];
      })
      // Coupon thunks
      .addCase(getMyCouponThunk.pending, (state) => {
        state.couponLoading = true;
        state.couponError = null;
      })
      .addCase(getMyCouponThunk.fulfilled, (state, action) => {
        state.couponLoading = false;
        state.coupon = action.payload;
      })
      .addCase(getMyCouponThunk.rejected, (state, action) => {
        state.couponLoading = false;
        state.couponError = action.error.message || "Failed to fetch coupon";
      })
      .addCase(applyCouponThunk.pending, (state) => {
        state.couponLoading = true;
        state.couponError = null;
      })
      .addCase(applyCouponThunk.fulfilled, (state, action) => {
        state.couponLoading = false;
        state.coupon = action.payload;
        state.isCouponApplied = true;
      })
      .addCase(applyCouponThunk.rejected, (state, action) => {
        state.couponLoading = false;
        state.couponError = action.error.message || "Failed to apply coupon";
      });
  },
});


export const { removeCoupon, calculateTotals } = cartSlice.actions;
export const selectCart = (state: RootState) => state.cart;
export default cartSlice.reducer;

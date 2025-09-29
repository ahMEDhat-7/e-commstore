import { createAsyncThunk } from "@reduxjs/toolkit";
import {
  fetchCart,
  addToCart,
  updateCartItem,
  removeCartItem,
  clearCart,
} from "../../common/api/cartApi";
import { fetchMyCoupon, validateCoupon } from "../../common/api/couponApi";

export const getCartThunk = createAsyncThunk("cart/getCart", () => {
  return fetchCart();
});

export const addCartItemThunk = createAsyncThunk(
  "cart/addCartItem",
  ({ productId, quantity }: { productId: string; quantity?: number }) => {
    return addToCart(productId, quantity ?? 1);
  }
);

export const updateCartItemThunk = createAsyncThunk(
  "cart/updateCartItem",
  ({ productId, quantity }: { productId: string; quantity: number }) => {
    return updateCartItem(productId, quantity);
  }
);

export const removeCartItemThunk = createAsyncThunk(
  "cart/removeCartItem",
  (productId: string) => {
    return removeCartItem(productId);
  }
);

export const clearCartThunk = createAsyncThunk("cart/clearCart", () => {
  return clearCart();
});

// Coupon thunks
export const getMyCouponThunk = createAsyncThunk(
  "cart/getMyCoupon",
  async () => {
    const response = await fetchMyCoupon();
    return response;
  }
);

export const applyCouponThunk = createAsyncThunk(
  "cart/applyCoupon",
  async (code: string) => {
    const response = await validateCoupon(code);
    return response;
  }
);

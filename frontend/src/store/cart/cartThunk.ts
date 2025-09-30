import { createAsyncThunk } from "@reduxjs/toolkit";
import {
  fetchCart,
  addToCart,
  updateCartItem,
  removeCartItem,
  clearCart,
} from "../../common/api/cartApi";
import { fetchMyCoupon, validateCoupon } from "../../common/api/couponApi";
import type { Product } from "../../common/types/Product";

const handleError = (error: unknown): string => {
  if (error instanceof Error) return error.message;
  return "An unexpected error occurred";
};

export const getCartThunk = createAsyncThunk(
  "cart/getCart",
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetchCart();
      return response;
    } catch (error) {
      return rejectWithValue(handleError(error));
    }
  }
);

export const addCartItemThunk = createAsyncThunk(
  "cart/addCartItem",
  async (
    { product, quantity = 1 }: { product: Product; quantity?: number },
    { rejectWithValue }
  ) => {
    try {
      const response = await addToCart(product._id, quantity);
      return response;
    } catch (error) {
      return rejectWithValue(handleError(error));
    }
  }
);

export const updateCartItemThunk = createAsyncThunk(
  "cart/updateCartItem",
  async (
    { productId, quantity }: { productId: string; quantity: number },
    { rejectWithValue }
  ) => {
    try {
      if (quantity < 0) {
        throw new Error("Quantity cannot be negative");
      }
      const response = await updateCartItem(productId, quantity);
      return response;
    } catch (error) {
      return rejectWithValue(handleError(error));
    }
  }
);

export const removeCartItemThunk = createAsyncThunk(
  "cart/removeCartItem",
  async (productId: string, { rejectWithValue }) => {
    try {
      const response = await removeCartItem(productId);
      return response;
    } catch (error) {
      return rejectWithValue(handleError(error));
    }
  }
);

export const clearCartThunk = createAsyncThunk(
  "cart/clearCart",
  async (_, { rejectWithValue }) => {
    try {
      const response = await clearCart();
      return response;
    } catch (error) {
      return rejectWithValue(handleError(error));
    }
  }
);

// Coupon thunks
export const getMyCouponThunk = createAsyncThunk(
  "cart/getMyCoupon",
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetchMyCoupon();
      return response;
    } catch (error) {
      return rejectWithValue(handleError(error));
    }
  }
);

export const applyCouponThunk = createAsyncThunk(
  "cart/applyCoupon",
  async (code: string, { rejectWithValue }) => {
    try {
      if (!code.trim()) {
        throw new Error("Coupon code is required");
      }
      const response = await validateCoupon(code);
      return response;
    } catch (error) {
      return rejectWithValue(handleError(error));
    }
  }
);

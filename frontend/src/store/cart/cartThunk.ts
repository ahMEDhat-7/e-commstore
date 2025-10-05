import { createAsyncThunk } from "@reduxjs/toolkit";
import {
  fetchCart,
  addToCart,
  updateCartItem,
  removeCartItem,
  clearCart,
} from "../../common/api/cartApi";

const handleError = (error: unknown): string => {
  if (error instanceof Error) return error.message;
  return "An unexpected error occurred";
};

export const getCartThunk = createAsyncThunk(
  "cart/getCart",
  async (_, { rejectWithValue }) => {
    try {
      const res = await fetchCart();
      return res.cart;
    } catch (error) {
      return rejectWithValue(handleError(error));
    }
  }
);

export const addCartItemThunk = createAsyncThunk(
  "cart/addCartItem",
  async (
    { productId, quantity = 1 }: { productId: string; quantity: number },
    { rejectWithValue }
  ) => {
    try {
      const res = await addToCart(productId, quantity);
      return res.cart;
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
      const res = await updateCartItem(productId, quantity);
      return res.cart;
    } catch (error) {
      return rejectWithValue(handleError(error));
    }
  }
);

export const removeCartItemThunk = createAsyncThunk(
  "cart/removeCartItem",
  async (productId: string, { rejectWithValue }) => {
    try {
      const res = await removeCartItem(productId);
      return res.cart;
    } catch (error) {
      return rejectWithValue(handleError(error));
    }
  }
);

export const clearCartThunk = createAsyncThunk(
  "cart/clearCart",
  async (_, { rejectWithValue }) => {
    try {
      const res = await clearCart();
      return res.cart;
    } catch (error) {
      return rejectWithValue(handleError(error));
    }
  }
);

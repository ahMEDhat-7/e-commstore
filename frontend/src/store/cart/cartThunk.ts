import { createAsyncThunk } from "@reduxjs/toolkit";
import {
  fetchCart,
  addToCart,
  updateCartItem,
  removeCartItem,
  clearCart,
} from "../../common/api/cartApi";

export const getCart = createAsyncThunk("cart/getCart", async () => {
  return await fetchCart();
});

export const addCartItem = createAsyncThunk(
  "cart/addCartItem",
  async ({ productId, quantity }: { productId: string; quantity?: number }) => {
    return await addToCart(productId, quantity ?? 1);
  }
);

export const updateCartItemThunk = createAsyncThunk(
  "cart/updateCartItem",
  async ({ productId, quantity }: { productId: string; quantity: number }) => {
    return await updateCartItem(productId, quantity);
  }
);

export const removeCartItemThunk = createAsyncThunk(
  "cart/removeCartItem",
  async (productId: string) => {
    return await removeCartItem(productId);
  }
);

export const clearCartThunk = createAsyncThunk("cart/clearCart", async () => {
  return await clearCart();
});

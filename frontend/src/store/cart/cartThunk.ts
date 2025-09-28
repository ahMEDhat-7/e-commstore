import { createAsyncThunk } from "@reduxjs/toolkit";
import {
  fetchCart,
  addToCart,
  updateCartItem,
  removeCartItem,
  clearCart,
} from "../../common/api/cartApi";

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

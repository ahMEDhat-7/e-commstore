import { createSlice } from "@reduxjs/toolkit";
import {
  getCartThunk,
  addCartItemThunk,
  updateCartItemThunk,
  removeCartItemThunk,
  clearCartThunk,
} from "./cartThunk";
import type { RootState } from "../store";

export interface CartItemType {
  _id: string;
  name: string;
  image: string;
  price: number;
  quantity: number;
}

interface CartState {
  items: CartItemType[];
  loading: boolean;
  error: string | null;
}

const initialState: CartState = {
  items: [],
  loading: false,
  error: null,
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {},
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
        console.log(idx, updatedItem);

        if (idx !== -1) state.items[idx] = updatedItem;
      })
      .addCase(removeCartItemThunk.fulfilled, (state, action) => {
        state.items = state.items.filter((c) => c._id !== action.meta.arg);
      })
      .addCase(clearCartThunk.fulfilled, (state) => {
        state.items = [];
      });
  },
});

export const selectCart = (state: RootState) => state.cart;
export default cartSlice.reducer;

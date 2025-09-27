import { createSlice } from "@reduxjs/toolkit";
import {
  getCart,
  addCartItem,
  updateCartItemThunk,
  removeCartItemThunk,
  clearCartThunk,
} from "./cartThunk";
import type { RootState } from "../store";

export interface CartItemType {
  productId: string;
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
      .addCase(getCart.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getCart.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload.items || [];
      })
      .addCase(getCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch cart";
      })
      .addCase(addCartItem.fulfilled, (state, action) => {
        state.items = action.payload.items || [];
      })
      .addCase(updateCartItemThunk.fulfilled, (state, action) => {
        state.items = action.payload.items || [];
      })
      .addCase(removeCartItemThunk.fulfilled, (state, action) => {
        state.items = action.payload.items || [];
      })
      .addCase(clearCartThunk.fulfilled, (state, action) => {
        state.items = [];
      });
  },
});
export const selectCart = (state: RootState) => state.cart;
export default cartSlice.reducer;

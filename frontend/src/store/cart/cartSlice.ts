import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import {
  getCartThunk,
  addCartItemThunk,
  updateCartItemThunk,
  removeCartItemThunk,
  clearCartThunk,
} from "./cartThunk";
import type { RootState } from "../store";
import type { Cart, CartState } from "../../common/types/Cart";

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
    // ---- getCart ----
    builder
      .addCase(getCartThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getCartThunk.fulfilled, (state, action: PayloadAction<Cart>) => {
        state.loading = false;
        state.items = action.payload.items;
      })
      .addCase(getCartThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // ---- addCartItem ----
    builder
      .addCase(addCartItemThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        addCartItemThunk.fulfilled,
        (state, action: PayloadAction<Cart>) => {
          state.loading = false;
          state.items = action.payload.items;
        }
      )
      .addCase(addCartItemThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // ---- updateCartItem ----
    builder
      .addCase(updateCartItemThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        updateCartItemThunk.fulfilled,
        (state, action: PayloadAction<Cart>) => {
          state.loading = false;
          state.items = action.payload.items;
        }
      )
      .addCase(updateCartItemThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // ---- removeCartItem ----
    builder
      .addCase(removeCartItemThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        removeCartItemThunk.fulfilled,
        (state, action: PayloadAction<Cart>) => {
          state.loading = false;
          state.items = action.payload.items;
        }
      )
      .addCase(removeCartItemThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // ---- clearCart ----
    builder
      .addCase(clearCartThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        clearCartThunk.fulfilled,
        (state, action: PayloadAction<Cart>) => {
          state.loading = false;
          state.items = [];
        }
      )
      .addCase(clearCartThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const selectCart = (state: RootState) => state.cart;
export default cartSlice.reducer;

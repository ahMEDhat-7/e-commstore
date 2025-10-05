import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import {
  getCartThunk,
  addCartItemThunk,
  updateCartItemThunk,
  removeCartItemThunk,
  clearCartThunk,
} from "./cartThunk";
import type { RootState } from "../store";
import type { Cart, CartItem, CartState } from "../../common/types/Cart";

const initialState: CartState = {
  items: [],
  total: 0,
  loading: false,
  error: null,
};

const calculateTotal = (items: CartItem[]): number => {
  return items.reduce(
    (sum, item) => sum + item.productId.price * item.quantity,
    0
  );
};
const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    const handleFulfilled = (state: CartState, action: PayloadAction<Cart>) => {
      state.loading = false;
      state.items = action.payload.items;
      state.total = calculateTotal(state.items);
    };

    // ---- getCart ----
    builder
      .addCase(getCartThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getCartThunk.fulfilled, handleFulfilled)
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
      .addCase(addCartItemThunk.fulfilled, handleFulfilled)
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
      .addCase(updateCartItemThunk.fulfilled, handleFulfilled)
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
      .addCase(removeCartItemThunk.fulfilled, handleFulfilled)
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
      .addCase(clearCartThunk.fulfilled, (state) => {
        state.loading = false;
        state.items = [];
        state.total = 0;
      })
      .addCase(clearCartThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const selectCart = (state: RootState) => state.cart;
export default cartSlice.reducer;

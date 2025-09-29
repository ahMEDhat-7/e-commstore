import { configureStore } from "@reduxjs/toolkit";

import authReducer from "./auth/authSlice";
import productReducer from "./product/productSlice";
import cartReducer from "./cart/cartSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    product: productReducer,
    cart: cartReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export type AppStore = typeof store;

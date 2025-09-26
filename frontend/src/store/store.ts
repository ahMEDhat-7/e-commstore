import { configureStore } from "@reduxjs/toolkit";

import authReducer from "./auth/authSlice";
import productReducer from "./product/productSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    product: productReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export type AppStore = typeof store;

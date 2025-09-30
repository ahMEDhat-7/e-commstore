import { createSlice } from "@reduxjs/toolkit";
import type { RootState } from "../store";
import type { AuthState } from "../../common/types";
import {
  loginThunk,
  logoutThunk,
  signupThunk,
  profileThunk,
} from "./authThunk";

const initialState: AuthState = {
  user: null,
  isLoading: false,
};

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(signupThunk.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(signupThunk.fulfilled, (state, action) => {
        state.user = action.payload;
        state.isLoading = false;
      })
      .addCase(signupThunk.rejected, (state) => {
        state.isLoading = false;
      })
      .addCase(loginThunk.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(loginThunk.fulfilled, (state, action) => {
        state.user = action.payload;
        state.isLoading = false;
      })
      .addCase(loginThunk.rejected, (state) => {
        state.isLoading = false;
      })
      .addCase(logoutThunk.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(logoutThunk.fulfilled, (state) => {
        state.user = null;
        state.isLoading = false;
      })
      .addCase(logoutThunk.rejected, (state) => {
        state.isLoading = false;
      })
      .addCase(profileThunk.fulfilled, (state, action) => {
        state.user = action.payload;
      });
  },
});

export const selectAuth = (state: RootState) => state.auth;
export default authSlice.reducer;

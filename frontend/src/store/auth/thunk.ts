import { createAsyncThunk } from "@reduxjs/toolkit";
import { loginAPI, signupAPI } from "../../common/api/authApi";
import type { LoginType, SignupType } from "../../common/types";
import { toast } from "react-hot-toast";

const loginThunk = createAsyncThunk(
  "auth/login",
  async (userData: LoginType, thunkAPI) => {
    try {
      const user = await loginAPI(userData);
      return user.data;
    } catch (error) {
      toast.error("Login Failed !");
      return thunkAPI.rejectWithValue(error);
    }
  }
);

const signupThunk = createAsyncThunk(
  "auth/signup",
  async (userData: SignupType, thunkAPI) => {
    try {
      const user = await signupAPI(userData);
      return user.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  }
);
export { loginThunk, signupThunk };

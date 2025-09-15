import { createAsyncThunk } from "@reduxjs/toolkit";
import { loginAPI, signupAPI } from "../../common/api/authApi";
import type { LoginType, SignupType } from "../../common/types";
import { toast } from "react-hot-toast";
import type { AxiosError } from "axios";

const loginThunk = createAsyncThunk(
  "auth/login",
  async (userData: LoginType, thunkAPI) => {
    try {
      const user = await loginAPI(userData);
      toast.success(user.data.message);
      return user.data;
    } catch (err) {
      const error = err as AxiosError;

      toast.error((error.response?.data as any).message);
      return thunkAPI.rejectWithValue((error.response?.data as any).message);
    }
  }
);

const signupThunk = createAsyncThunk(
  "auth/signup",
  async (userData: SignupType, thunkAPI) => {
    try {
      if (userData.password !== userData.confirmPassword) {
        toast.error("Passwords do not match");
        return thunkAPI.rejectWithValue("Passwords do not match");
      }
      const user = await signupAPI(userData);
      toast.success(user.data.message);
      return user.data;
    } catch (err) {
      const error = err as AxiosError;

      toast.error((error.response?.data as any).message);
      return thunkAPI.rejectWithValue((error.response?.data as any).message);
    }
  }
);
export { loginThunk, signupThunk };

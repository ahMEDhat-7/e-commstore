// api.ts
import axios from "axios";
import type { LoginType, SignupType } from "../types";

const BASE_URL = "http://www.localhost:7000/api/auth";
const API = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
});

export const loginAPI = (userData: LoginType) => {
  return API.post("/login", userData);
};

export const signupAPI = (userData: SignupType) => {
  return API.post("/signup", userData);
};

export const logoutAPI = () => {
  return API.post("/logout");
};

export const profileAPI = () => {
  return API.get("/profile");
};

export const refreshAPI = () => {
  return API.post("/refresh");
};

export const forgotPasswordAPI = (email: string) => {
  return API.post("/forgot-password", { email });
};

export const resetPasswordAPI = (token: string, newPassword: string) => {
  return API.post(`/reset-password/${token}`, { password: newPassword });
};

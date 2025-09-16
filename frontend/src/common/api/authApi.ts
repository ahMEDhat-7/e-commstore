// authAPI.ts
import axios from "axios";
import type { LoginType, SignupType } from "../types";

// Bug cookies can't be sent in req
// we need to fix that

const authAPI = axios.create({
  baseURL:
    import.meta.env.MODE === "development"
      ? "http://localhost:7000/api/auth"
      : "/api/auth",
  withCredentials: true,
});

export const loginAPI = (userData: LoginType) => {
  return authAPI.post("/login", userData);
};

export const signupAPI = (userData: SignupType) => {
  return authAPI.post("/signup", userData);
};

export const logoutAPI = () => {
  return authAPI.post("/logout");
};

export const profileAPI = () => {
  return authAPI.get("/profile");
};

export const refreshAPI = () => {
  return authAPI.post("/refresh");
};

export const forgotPasswordAPI = (email: string) => {
  return authAPI.post("/forgot-password", { email });
};

export const resetPasswordAPI = (token: string, newPassword: string) => {
  return authAPI.post(`/reset-password/${token}`, { password: newPassword });
};

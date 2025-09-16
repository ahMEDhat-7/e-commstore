import  redis  from "../config/redis";
import { Response } from "express";

const isProduction = (process.env.NODE_ENV as string) === "prod";

const setCookies = (
  res: Response,
  tokens: { accessToken: string; refreshToken: string }
) => {
  res.cookie("accessToken", tokens.accessToken, {
    httpOnly: true,
    secure: isProduction,
    sameSite: "lax",
    maxAge: 30 * 60 * 1000,
  });
  res.cookie("refreshToken", tokens.refreshToken, {
    httpOnly: true,
    secure: isProduction,
    sameSite: "lax",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });
};

const clearCookies = (res: Response) => {
  res.clearCookie("accessToken");
  res.clearCookie("refreshToken");
};

const storeRefreshToken = async (userId: string, refToken: string) => {
  await redis.set(`refresh_token:${userId}`, refToken, "EX", 7 * 24 * 60 * 60); // 7d
};

const getRefreshToken = async (userId: string) => {
  return redis.get(`refresh_token:${userId}`);
};

const removeRefreshToken = async (userId: string) => {
  await redis.del(`refresh_token:${userId}`);
};

export {
  setCookies,
  storeRefreshToken,
  removeRefreshToken,
  clearCookies,
  getRefreshToken,
};

import { NextFunction, Request, Response } from "express";
import asyncWrapper from "../middlewares/asyncWrapper";
import { LoginDto, RegisterDto } from "../dtos/auth.dto";
import { genToken, verifyRefreshToken } from "../utils/tokenHelpers";
import {
  clearCookies,
  getRefreshToken,
  removeRefreshToken,
  setCookies,
  storeRefreshToken,
} from "../services/auth.service";
import { createUser, findUser } from "../services/user.service";
import { JwtPayload } from "../utils/types";
import { compareHash } from "../utils/hashHelpers";

const signup = asyncWrapper(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { username, email, password } = req.body as RegisterDto;

      const existingUser = await findUser(email);
      if (existingUser) {
        return res.status(400).json({ message: "Email already in use" });
      }

      const user = await createUser({ username, email, password });

      // token
      const payload: JwtPayload = {
        userId: user._id.toString(),
        role: user.role,
      };
      const { accessToken, refreshToken } = genToken(payload);
      await storeRefreshToken(payload.userId, refreshToken);
      setCookies(res, { accessToken, refreshToken });

      return res.status(201).json({
        user: {
          id: user._id,
          username: user.username,
          email: user.email,
          role: user.role,
        },
        message: "user created successfully",
      });
    } catch (err) {
      return next(err);
    }
  }
);
const login = asyncWrapper(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { email, password } = req.body as LoginDto;
      const user = await findUser(email);
      if (!user) {
        return res.status(400).json({
          message: "Invalid username password try again...",
        });
      }

      if (await compareHash(password, user.password)) {
        const payload: JwtPayload = {
          userId: user._id.toString(),
          role: user.role,
        };
        const { accessToken, refreshToken } = genToken(payload);
        await storeRefreshToken(payload.userId, refreshToken);
        setCookies(res, { accessToken, refreshToken });

        return res.status(200).json({
          user: {
            id: user._id,
            username: user.username,
            email: user.email,
            role: user.role,
          },
          message: "you logged in successfully",
        });
      }
    } catch (err) {
      return next(err);
    }
  }
);

const logout = asyncWrapper(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const refreshToken = req.headers.authorization;

      if (refreshToken) {
        const user = verifyRefreshToken(refreshToken);
        await removeRefreshToken(user.userId);
      }
      clearCookies(res);

      return res.status(200).json({ message: "you logged out." });
    } catch (error) {
      return next(error);
    }
  }
);

const refresh = asyncWrapper(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const refreshTokenFromCookie = req.cookies.refreshToken;
      if (!refreshTokenFromCookie) {
        return res.status(401).json({ message: "No refresh token provided" });
      }
      const user = verifyRefreshToken(refreshTokenFromCookie);
      const refreshTokenStored = await getRefreshToken(user.userId);
      if (
        refreshTokenStored !== refreshTokenFromCookie ||
        !refreshTokenStored
      ) {
        return res.status(401).json({ message: "No refresh token is invalid" });
      }
      const payload: JwtPayload = {
        userId: user.userId,
        role: user.role,
      };
      const { accessToken } = genToken(payload);
      setCookies(res, { accessToken, refreshToken: refreshTokenStored });
      return res.status(200).json({ message: "you refreshed tokens." });
    } catch (error) {
      return next(error);
    }
  }
);

const getProfile = asyncWrapper(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      return res.json({ user: (req as any)["user"] });
    } catch (err) {
      return next(err);
    }
  }
);

export { signup, login, logout, refresh, getProfile };

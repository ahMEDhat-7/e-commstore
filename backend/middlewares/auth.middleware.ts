import { CustomError } from "../utils/customError";
import { verifyAccessToken } from "../utils/tokenHelpers";
import asyncWrapper from "./asyncWrapper";
import { NextFunction, Request, Response } from "express";
import { findUserById } from "../services/user.service";

export const protectRoute = asyncWrapper(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const accessToken = req.cookies.accessToken;

      if (!accessToken) {
        return next(
          new CustomError(401, "Unauthorized - No access token provided")
        );
      }

      try {
        const decoded = verifyAccessToken(accessToken);
        const user = await findUserById(decoded.userId);

        if (!user) {
          return next(new CustomError(401, "User not found"));
        }

        (req as any)["user"] = user;
        
        next();
      } catch (error) {
        return next(
          new CustomError(401, "Unauthorized - Access token expired")
        );
      }
    } catch (error) {
      return next(new CustomError(401, "Unauthorized - Invalid access token"));
    }
  }
);

export const adminRoute = asyncWrapper(
  async (req: Request, res: Response, next: NextFunction) => {
    if ((req as any)["user"] && (req as any)["user"].role === "admin") {
      
      next();
    } else {
      return next(new CustomError(404, "Access denied - Admin only"));
    }
  }
);

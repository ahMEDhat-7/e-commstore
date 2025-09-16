import { findUserById } from "../services/user.service";
import { verifyAccessToken } from "../utils/tokenHelpers";
import { NextFunction, Request, Response } from "express";

const protectedRoute = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const accessToken = req.cookies.accessToken;

    if (!accessToken) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const decoded = verifyAccessToken(accessToken);

    const user = await findUserById(decoded.userId);

    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }

    (req as any)["user"] = user;

    next();
  } catch (error) {
    return next(error);
  }
};

export { protectedRoute };

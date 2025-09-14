import { sign, verify } from "jsonwebtoken";
import { JwtPayload } from "./types";

const genToken = (payload: JwtPayload) => {
  try {
    if (!process.env.JWT_ACC_SECRET || !process.env.JWT_REF_SECRET) {
      throw new Error("JWT SECRETs is not defined in environment variables");
    }
    const accessToken = sign(payload, process.env.JWT_ACC_SECRET, {
      expiresIn: "30m",
    });

    const refreshToken = sign(payload, process.env.JWT_REF_SECRET, {
      expiresIn: "7d",
    });
    return { accessToken, refreshToken };
  } catch (error: any) {
    throw new Error(error.message);
  }
};

const verifyRefreshToken = (refreshToken: string) => {
  try {
    if (!process.env.JWT_REF_SECRET) {
      throw new Error("JWT SECRET is not defined in environment variables");
    }
    const decoded = verify(
      refreshToken,
      process.env.JWT_REF_SECRET
    ) as JwtPayload;
    return decoded;
  } catch (error: any) {
    throw new Error(error.message);
  }
};

const verifyAccessToken = (accessToken: string) => {
  try {
    if (!process.env.JWT_ACC_SECRET) {
      throw new Error("JWT SECRET is not defined in environment variables");
    }
    const decoded = verify(
      accessToken,
      process.env.JWT_ACC_SECRET
    ) as JwtPayload;
    return decoded;
  } catch (error: any) {
    throw new Error(error.message);
  }
};

export { genToken, verifyRefreshToken, verifyAccessToken };

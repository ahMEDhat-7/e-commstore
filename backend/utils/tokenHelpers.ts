import { sign } from "jsonwebtoken";

export const genToken = (userId: string) => {
  try {
    if (!process.env.JWT_ACC_SECRET || !process.env.JWT_REF_SECRET) {
      throw new Error("JWT SECRETs is not defined in environment variables");
    }
    const accessToken = sign({ userId }, process.env.JWT_ACC_SECRET, {
      expiresIn: "30m",
    });

    const refreshToken = sign({ userId }, process.env.JWT_REF_SECRET, {
      expiresIn: "7d",
    });
    return { accessToken, refreshToken };
  } catch (error: any) {
    throw new Error(error.message);
  }
};

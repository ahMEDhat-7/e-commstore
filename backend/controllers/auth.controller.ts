import { NextFunction, Request, Response } from "express";
import asyncWrapper from "../middlewares/asyncWrapper";
import { LoginDto, RegisterDto } from "../dtos/auth.dto";
import { UserModel } from "../models/user.model";
import { storeRefreshToken } from "../config/redis";
import { genToken } from "../utils/tokenHelpers";

const signup = asyncWrapper(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { username, email, password } = req.body as RegisterDto;

      const existingUser = await UserModel.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ message: "Email already in use" });
      }

      const user = new UserModel({ username, email, password });
      await user.save();

      // token
      const { accessToken, refreshToken } = genToken(user._id.toString());
      await storeRefreshToken(user._id.toString(), refreshToken);

      return res.status(201).json({ accessToken, refreshToken });
    } catch (err) {
      return next(err);
    }
  }
);
const login = asyncWrapper(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { email, password } = req.body as LoginDto;

      const user = await UserModel.findOne({ email });
      if (!user) {
        return res.status(400).json({ message: "Invalid credentials" });
      }

      // const isMatch = await User.compare(password, user.password);
      // if (!isMatch) {
      //   return res.status(400).json({ message: "Invalid credentials" });
      // }

      // token
      // const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: "1d" });

      return res.status(200).json(user);
    } catch (err) {
      return next(err);
    }
  }
);

const logout = asyncWrapper((req: Request, res: Response) => {
  res.status(200).json({ message: "logout endpoint" });
});

export { signup, login, logout };

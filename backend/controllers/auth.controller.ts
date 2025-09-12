import { NextFunction, Request, Response } from "express";
import asyncWrapper from "../middlewares/asyncWrapper";

const signup = asyncWrapper(
  (req: Request, res: Response, next: NextFunction) => {
    res.status(201).json({ message: "signup endpoint" });
  }
);
const login = asyncWrapper((req: Request, res: Response) => {
  res.status(200).json({ message: "login endpoint" });
});

const logout = asyncWrapper((req: Request, res: Response) => {
  res.status(200).json({ message: "logout endpoint" });
});

export { signup, login, logout };

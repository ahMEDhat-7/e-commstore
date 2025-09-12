import { LoginDto, RegisterDto } from "../dtos/auth.dto";
import { Request, Response } from "express";

const signup = (user: RegisterDto) => {};

const login = (user: LoginDto) => {};

const logout = (req: Request, res: Response) => {
  res.status(200).json({ message: "logout endpoint" });
};

export { signup, login, logout };

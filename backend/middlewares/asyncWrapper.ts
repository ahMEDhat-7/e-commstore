import { NextFunction, Request, Response } from "express";

export default (
  asyncFn: (req: Request, res: Response, next: NextFunction) => void
) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      asyncFn(req, res, next);
      console.log(`[+] ${req.method} ${req.originalUrl} at ${Date()} `);
    } catch (error) {
      next();
    }
  };
};

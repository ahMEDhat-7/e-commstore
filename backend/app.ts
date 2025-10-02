import express, { Express, NextFunction, Request, Response } from "express";
import helmet from "helmet";
import cors from "cors";
import cookieParser from "cookie-parser";
import morgan from "morgan";

import authRoute from "./routes/auth.route";
import productRoute from "./routes/product.route";
import cartRoutes from "./routes/cart.route";
import couponRoutes from "./routes/coupon.route";
import analyticsRoutes from "./routes/analytics.route";
import paymentsRoutes from "./routes/payment.route";
import { protectRoute } from "./middlewares/auth.middleware";
import { CustomError } from "./utils/customError";

const app: Express = express();

// Middleware
app.use(helmet());
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);
app.use(morgan("combined"));
app.use(cookieParser());
app.use(express.json());

// Routes
app.use("/api/auth", authRoute);
app.use("/api/products", productRoute);
app.use("/api/coupons", protectRoute, couponRoutes);
app.use("/api/carts", protectRoute, cartRoutes);
app.use("/api/analytics", analyticsRoutes);
app.use("/api/payments", protectRoute, paymentsRoutes);

app.use((err: CustomError, req: Request, res: Response, next: NextFunction) => {
  console.log("Error :", err);

  const status = err.statusCode || 500;
  res.status(status).json({
    message: err.message || "Internal Server Error",
  });
  next();
});

export default app;

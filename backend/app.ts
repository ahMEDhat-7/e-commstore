import express, { Express, NextFunction, Request, Response } from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import authRoute from "./routes/auth.route";
import productRoute from "./routes/product.route";
import cartRoutes from "./routes/cart.route";
import analyticsRoutes from "./routes/analytics.route";
import couponRoutes from "./routes/coupon.route";
import paymentsRoutes from "./routes/payment.route";
import { CustomError } from "./utils/customError";

const app: Express = express();

// Middleware
app.use(helmet());
app.use(
  cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    credentials: true,
  })
);
app.use(cookieParser());
app.use(express.json({ limit: "10mb" }));
app.use(morgan("combined"));

// Routes
app.use("/api/auth", authRoute);
app.use("/api/products", productRoute);
app.use("/api/carts", cartRoutes);
app.use("/api/coupons", couponRoutes);
app.use("/api/analytics", analyticsRoutes);
app.use("/api/payments", paymentsRoutes);

app.use((err: CustomError, req: Request, res: Response, next: NextFunction) => {
  console.log("Error Middleware:", err);

  const status = err.statusCode || 500;
  res.status(status).json({
    message: err.message || "Internal Server Error",
  });
  next();
});

export default app;

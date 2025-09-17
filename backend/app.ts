import express, { Express, NextFunction, Request, Response } from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import authRoute from "./routes/auth.route";
import productRoute from "./routes/product.route";
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
app.use(cookieParser());
app.use(express.json());
app.use(morgan("combined"));

// Routes
app.use("/api/auth", authRoute);
app.use("/api/products", productRoute);

app.use((err: CustomError, req: Request, res: Response, next: NextFunction) => {
  res.status(err.statusCode).json({ message: err.message });
  next();
});

export default app;

import express, { Express, NextFunction, Request, Response } from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import authRoute from "./routes/auth.route";
import cookieParser from "cookie-parser";

const app: Express = express();

// Middleware
app.use(helmet());
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieParser());
app.use(morgan("combined"));

// Routes
app.use("/api/auth", authRoute);

app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  res.status(400).json({ name: err.name, error: err.message });
  next();
});

export default app;

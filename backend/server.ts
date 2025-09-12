import "dotenv/config";
import db from "./config/db";
import app from "./app";
import { Express } from "express";

async function bootStrap(expressApp: Express) {
  await db();
  expressApp.listen(process.env.PORT || 3000, () => {
    console.log(
      `[+] Server running on http://localhost:${process.env.PORT || 3000}`
    );
  });
}

bootStrap(app);

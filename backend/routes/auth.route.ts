import express from "express";
import { login, logout, signup } from "../controllers/auth.controller";

const router = express.Router();

router.route("/signup").get(signup);

router.route("/login").get(login);

router.route("/logout").get(logout);

export default router;

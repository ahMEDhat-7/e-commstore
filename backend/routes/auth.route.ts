import express from "express";
import {
  getProfile,
  login,
  logout,
  refresh,
  signup,
} from "../controllers/auth.controller";
import { protectedRoute } from "../middlewares/protectedRoute";

const router = express.Router();

router.route("/signup").post(signup);

router.route("/login").post(login);

router.route("/logout").post(logout);

router.route("/refresh").post(refresh);
router.route("/profile").get(protectedRoute, getProfile);

export default router;

import { Router } from "express";
import { protectRoute } from "../middlewares/auth.middleware";
import {
  checkoutSuccess,
  createCheckoutSession,
} from "../controllers/payment.controller";

const router = Router();

router.post("/create-checkout-session", createCheckoutSession);
router.post("/checkout-success", checkoutSuccess);

export default router;

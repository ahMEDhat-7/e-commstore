import { Router } from "express";
import {
  addToCart,
  getCartProducts,
  removeFromCart,
  updateQuantity,
} from "../controllers/cart.controller";
import { protectRoute } from "../middlewares/auth.middleware";

const router = Router();

router.get("/", protectRoute, getCartProducts);
router.post("/", protectRoute, addToCart);
router.delete("/", protectRoute, removeFromCart);
router.put("/:productId", protectRoute, updateQuantity);

export default router;

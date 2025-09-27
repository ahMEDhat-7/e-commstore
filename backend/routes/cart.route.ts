import express from "express";
import {
  addToCart,
  getCartProducts,
  removeAllFromCart,
  updateQuantity,
} from "../controllers/cart.controller";
import { protectRoute } from "../middlewares/auth.middleware";

const router = express.Router();

router
  .route("/")
  .get(protectRoute, getCartProducts)
  .post(protectRoute, addToCart)
  .delete(protectRoute, removeAllFromCart);

router.put("/:id", protectRoute, updateQuantity);

export default router;

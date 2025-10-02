import { Router } from "express";
import {
  getCartProducts,
  addToCart,
  removeFromCart,
  updateQuantity,
} from "../controllers/cart.controller";

const router = Router();

// `/api/carts`
router.route("/").get(getCartProducts).post(addToCart).delete(removeFromCart);

// `/api/carts/:id`
router.patch("/:id", updateQuantity);

export default router;

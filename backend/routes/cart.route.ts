import { Router } from "express";
import {
  getCartProducts,
  addToCart,
  updateCartItem,
  removeCartItem,
  clearCart,
} from "../controllers/cart.controller";

const router = Router();

router.post("/", addToCart);
router.get("/", getCartProducts);
router.patch("/", updateCartItem);
router.delete("/:productId", removeCartItem);
router.delete("/", clearCart);

export default router;

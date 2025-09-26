import { Router } from "express";
import {
  createNewProduct,
  deleteProduct,
  getAllProducts,
  getFeaturedProducts,
  getProductsByCategory,
  getRecommendedProducts,
  toggleFeaturedProduct,
} from "../controllers/product.controller";
import { protectRoute, adminRoute } from "../middlewares/auth.middleware";

const router = Router();

router
  .route("/")
  .get(protectRoute, adminRoute, getAllProducts)
  .post(protectRoute, adminRoute, createNewProduct);

router
  .route("/:id")
  .patch(protectRoute, adminRoute, toggleFeaturedProduct)
  .delete(protectRoute, adminRoute, deleteProduct);

router.get("/featured", getFeaturedProducts);

router.get("/category/:category", getProductsByCategory);

router.get("/recommendations", getRecommendedProducts);

export default router;

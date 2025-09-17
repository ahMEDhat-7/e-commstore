import "dotenv/config";
import { CreateProductDto } from "../dtos/product.dto";
import ProductModel from "../models/product.model";
import redis from "../config/redis";

const createProduct = async (Product: CreateProductDto) => {
  const newProduct = new ProductModel({ ...Product });
  return newProduct.save();
};
const findProducts = async () => {
  return ProductModel.find();
};
const findProductById = async (id: string) => {
  return ProductModel.findOne({ _id: id });
};
const findProductsFeatured = async () => {
  return ProductModel.find({ isFeatured: true });
};
const updateProduct = () => {};
const removeProduct = () => {};

const getFeaturedProductsCached = async () => {
  return redis.get("featured_products");
};

const setFeaturedProductsCached = async (featuredProducts: string) => {
  await redis.set("featured_products", featuredProducts);
};

export {
  createProduct,
  findProducts,
  updateProduct,
  removeProduct,
  findProductById,
  findProductsFeatured,
  getFeaturedProductsCached,
  setFeaturedProductsCached,
};

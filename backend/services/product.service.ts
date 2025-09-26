import "dotenv/config";
import { CreateProductDto } from "../dtos/product.dto";
import ProductModel from "../models/product.model";
import redis from "../config/redis";

const createProduct = async (product: CreateProductDto) => {
  const newProduct = new ProductModel({ ...product });
  return newProduct.save();
};
const findProducts = async () => {
  return ProductModel.find();
};
const findProductById = async (id: string) => {
  return ProductModel.findOne({ _id: id });
};
const findProductByCategory = async (category: string) => {
  return ProductModel.findOne({ category });
};

const findProductsFeatured = async () => {
  return ProductModel.find({ isFeatured: true }).lean();
};
const updateProduct = (id: string, product: CreateProductDto) => {
  return ProductModel.findByIdAndUpdate(
    { _id: id },
    { ...product },
    { new: true }
  );
};
const removeProduct = (id: string) => {
  return ProductModel.findByIdAndDelete({ _id: id });
};

const getFeaturedProductsCached = () => {
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
  findProductByCategory,
  getFeaturedProductsCached,
  setFeaturedProductsCached,
};

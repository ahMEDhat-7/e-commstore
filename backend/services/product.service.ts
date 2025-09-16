import "dotenv/config";
import { CreateProductDto } from "../dtos/product.dto";
import ProductModel from "../models/product.model";

const createProduct = async (Product: CreateProductDto) => {
  const newProduct = new ProductModel({ ...Product });
  return newProduct.save();
};
const findProducts = async () => {
  return ProductModel.findOne();
};
const findProductById = async (id: string) => {
  return ProductModel.findOne({ _id: id }).select("-password");
};
const findProductsFeatured = async () => {
  return ProductModel.find({ isFeatured: true }).lean();
};
const updateProduct = () => {};
const removeProduct = () => {};

export {
  createProduct,
  findProducts,
  updateProduct,
  removeProduct,
  findProductById,
  findProductsFeatured,
};

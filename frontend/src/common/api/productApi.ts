import axios from "axios";
import type { Product } from "../types/Product";

const productAPI = axios.create({
  baseURL: import.meta.env.VITE_BASE_URL + "/products",

  withCredentials: true,
});

export const fetchProducts = async () => {
  const res = await productAPI.get("");
  return res.data.products;
};

export const fetchProductById = async (id: string) => {
  const res = await productAPI.get(`/${id}`);
  return res.data.product;
};

export const createProduct = async (product: Omit<Product, "_id">) => {
  const res = await productAPI.post("", product);
  return res.data.product;
};

export const updateProduct = async (id: string) => {
  const res = await productAPI.patch(`/${id}`);
  return res.data.updatedProduct;
};

export const deleteProduct = async (id: string) => {
  const res = await productAPI.delete(`/${id}`);
  return res.data;
};

export const fetchFeaturedProducts = async () => {
  const res = await productAPI.get(`/featured`);
  return res.data.products;
};

export const fetchProductsByCategory = async (category: string) => {
  const res = await productAPI.get(`/category/${category}`);
  return res.data.products;
};

export const fetchRecommendedProducts = async () => {
  const res = await productAPI.get(`/recommendations`);
  return res.data.products;
};

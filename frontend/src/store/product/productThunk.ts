import { createAsyncThunk } from "@reduxjs/toolkit";
import {
  fetchProducts,
  fetchProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  fetchFeaturedProducts,
  fetchProductsByCategory,
  fetchRecommendedProducts,
} from "../../common/api/productApi";

export const getProducts = createAsyncThunk("product/getProducts", async () => {
  return fetchProducts();
});

export const getProductById = createAsyncThunk(
  "product/getProductById",
  async (id: string) => {
    return fetchProductById(id);
  }
);

export const addProduct = createAsyncThunk(
  "product/addProduct",
  async (product: any) => {
    return createProduct(product);
  }
);

export const editProduct = createAsyncThunk(
  "product/editProduct",
  async ({ id }: { id: string }) => {
    return updateProduct(id);
  }
);

export const removeProduct = createAsyncThunk(
  "product/removeProduct",
  async (id: string) => {
    return deleteProduct(id);
  }
);

export const getFeaturedProducts = createAsyncThunk(
  "product/getFeaturedProducts",
  async () => {
    return fetchFeaturedProducts();
  }
);

export const getProductsByCategory = createAsyncThunk(
  "product/getProductsByCategory",
  async (category: string) => {
    return fetchProductsByCategory(category);
  }
);

export const getRecommendedProducts = createAsyncThunk(
  "product/getRecommendedProducts",
  async () => {
    return fetchRecommendedProducts();
  }
);

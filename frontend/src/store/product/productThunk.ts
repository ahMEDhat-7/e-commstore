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
  return await fetchProducts();
});

export const getProductById = createAsyncThunk(
  "product/getProductById",
  async (id: string) => {
    return await fetchProductById(id);
  }
);

export const addProduct = createAsyncThunk(
  "product/addProduct",
  async (product: any) => {
    return await createProduct(product);
  }
);

export const editProduct = createAsyncThunk(
  "product/editProduct",
  async ({ id }: { id: string }) => {
    return await updateProduct(id);
  }
);

export const removeProduct = createAsyncThunk(
  "product/removeProduct",
  async (id: string) => {
    return await deleteProduct(id);
  }
);

export const getFeaturedProducts = createAsyncThunk(
  "product/getFeaturedProducts",
  async () => {
    return await fetchFeaturedProducts();
  }
);

export const getProductsByCategory = createAsyncThunk(
  "product/getProductsByCategory",
  async (category: string) => {
    return await fetchProductsByCategory(category);
  }
);

export const getRecommendedProducts = createAsyncThunk(
  "product/getRecommendedProducts",
  async () => {
    return await fetchRecommendedProducts();
  }
);

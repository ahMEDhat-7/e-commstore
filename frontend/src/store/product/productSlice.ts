import { createSlice } from "@reduxjs/toolkit";
import type { Product } from "../../common/types/Product";
import {
  getProducts,
  getProductById,
  addProduct,
  editProduct,
  removeProduct,
  getFeaturedProducts,
  getProductsByCategory,
  getRecommendedProducts,
} from "./productThunk";

interface ProductState {
  products: Product[];
  featured: Product[];
  recommended: Product[];
  categoryProducts: Product[];
  selectedProduct: Product | null;
  loading: boolean;
  error: string | null;
}

const initialState: ProductState = {
  products: [],
  featured: [],
  recommended: [],
  categoryProducts: [],
  selectedProduct: null,
  loading: false,
  error: null,
};

const productSlice = createSlice({
  name: "product",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.products = action.payload;
      })
      .addCase(getProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch products";
      })
      .addCase(getProductById.fulfilled, (state, action) => {
        state.selectedProduct = action.payload;
      })
      .addCase(addProduct.fulfilled, (state, action) => {
        state.products.push(action.payload);
      })
      .addCase(editProduct.fulfilled, (state, action) => {
        const idx = state.products.findIndex(
          (p) => p._id === action.payload._id
        );
        if (idx !== -1) state.products[idx] = action.payload;
      })
      .addCase(removeProduct.fulfilled, (state, action) => {
        state.products = state.products.filter(
          (p) => p._id !== action.meta.arg
        );
      })
      .addCase(getFeaturedProducts.fulfilled, (state, action) => {
        state.featured = action.payload;
      })
      .addCase(getProductsByCategory.fulfilled, (state, action) => {
        state.categoryProducts = action.payload;
      })
      .addCase(getRecommendedProducts.fulfilled, (state, action) => {
        state.recommended = action.payload;
      });
  },
});

export default productSlice.reducer;

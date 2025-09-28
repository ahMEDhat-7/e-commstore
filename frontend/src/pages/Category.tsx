import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { motion } from "framer-motion";
import ProductCard from "../components/ProductCard";
import { useDispatch, useSelector } from "react-redux";
import { selectProducts } from "../store/product/productSlice";
import type { AppDispatch } from "../store/store";
import { getProductsByCategory } from "../store/product/productThunk";
import type { Product } from "../common/types/Product";

const Category = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { categoryProducts } = useSelector(selectProducts);
  const productsList = Array.isArray(categoryProducts) ? categoryProducts : [];

  const { category } = useParams();

  useEffect(() => {
    if (category) {
      dispatch(getProductsByCategory(category));
    }
  }, [category, dispatch]);

  return (
    <div className="min-h-screen">
      <div className="relative z-10 max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <motion.h1
          className="text-center text-4xl sm:text-5xl font-bold text-emerald-400 mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          {category ? category.charAt(0).toUpperCase() + category.slice(1) : ""}
        </motion.h1>

        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 justify-items-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          {productsList.length === 0 && (
            <h2 className="text-3xl font-semibold text-gray-300 text-center col-span-full">
              No products found
            </h2>
          )}

          {productsList.map((product: Product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </motion.div>
      </div>
    </div>
  );
};
export default Category;

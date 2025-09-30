import { ShoppingCart } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { useState } from "react";
import type { AppDispatch } from "../store/store";
import type { Product } from "../common/types/Product";
import { addCartItemThunk } from "../store/cart/cartThunk";

import type { RootState } from "../store/store";
import { selectAuth } from "../store/auth/authSlice";

const ProductCard = ({ product }: { product: Product }) => {
  const dispatch = useDispatch<AppDispatch>();
  const { user } = useSelector(selectAuth);
  const { items: cartItems, loading } = useSelector(
    (state: RootState) => state.cart
  );
  const isInCart = cartItems.some((item) => item._id === product._id);
  const [isAdding, setIsAdding] = useState(false);

  const handleAddToCart = async () => {
    if (isAdding || !user || isInCart) return;
    setIsAdding(true);
    try {
      await dispatch(addCartItemThunk({ product })).unwrap();
    } catch (error) {
      console.error("Failed to add item to cart:", error);
    } finally {
      setIsAdding(false);
    }
  };

  return (
    <div className="flex w-full relative flex-col overflow-hidden rounded-lg border border-gray-700 shadow-lg">
      <div className="relative mx-3 mt-3 flex h-60 overflow-hidden rounded-xl">
        <img
          className="object-cover w-full"
          src={product.image}
          alt={product.name}
        />
        <div className="absolute inset-0 bg-black bg-opacity-20" />
      </div>

      <div className="mt-4 px-5 pb-5">
        <h5 className="text-xl font-semibold tracking-tight text-white">
          {product.name}
        </h5>
        <p className="mt-1 text-sm text-gray-400 line-clamp-2">
          {product.description}
        </p>
        <div className="mt-2 mb-5 flex items-center justify-between">
          <p>
            <span className="text-3xl font-bold text-emerald-400">
              ${product.price}
            </span>
          </p>
        </div>
        {user ? (
          isInCart ? (
            <div className="flex items-center justify-center text-emerald-400 text-sm font-semibold">
              <ShoppingCart size={18} className="mr-2" />
              Added to cart
            </div>
          ) : (
            <button
              className={`w-full flex items-center justify-center rounded-lg bg-emerald-600 px-5 py-2.5 text-center text-sm font-medium
                text-white hover:bg-emerald-700 focus:outline-none focus:ring-4 focus:ring-emerald-300 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200`}
              onClick={handleAddToCart}
              disabled={isAdding || loading}
            >
              <ShoppingCart size={22} className="mr-2" />
              {isAdding ? "Adding..." : "Add to cart"}
            </button>
          )
        ) : (
          <p className="text-center text-sm text-gray-400">
            Sign in to add to cart
          </p>
        )}
      </div>
    </div>
  );
};
export default ProductCard;

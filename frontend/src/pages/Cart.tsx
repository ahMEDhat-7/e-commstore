import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Loader2, ShoppingCart } from "lucide-react";
import CartItem from "../components/CartItem";
import PeopleAlsoBought from "../components/PeopleAlsoBought";
import OrderSummary from "../components/OrderSummary";
import type { AppDispatch } from "../store/store";
import { useDispatch, useSelector } from "react-redux";
import { getCartThunk } from "../store/cart/cartThunk";
import { selectCart } from "../store/cart/cartSlice";

const Cart = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { items, loading, error } = useSelector(selectCart);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin text-emerald-500" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <p className="text-red-500">Failed to load cart: {error}</p>
        <button
          onClick={() => dispatch(getCartThunk())}
          className="mt-4 px-4 py-2 bg-emerald-500 rounded-md text-white hover:bg-emerald-600 transition-colors"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="py-8 md:py-16">
      <div className="mx-auto max-w-screen-xl px-4 2xl:px-0">
        <div className="mt-6 sm:mt-8 md:gap-6 lg:flex lg:items-start xl:gap-8">
          <AnimatePresence mode="wait">
            <motion.div
              key="cart-items"
              className="mx-auto w-full flex-none lg:max-w-2xl xl:max-w-4xl"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.5 }}
            >
              {items.length === 0 ? (
                <EmptyCartUI />
              ) : (
                <div className="space-y-6">
                  {items.map((item) => (
                    <CartItem key={item.productId} item={item} />
                  ))}
                </div>
              )}
              {items.length > 0 && <PeopleAlsoBought />}
            </motion.div>
          </AnimatePresence>

          <AnimatePresence>
            {items.length > 0 && (
              <motion.div
                key="cart-summary"
                className="mx-auto mt-6 max-w-4xl flex-1 space-y-6 lg:mt-0 lg:w-full"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.5 }}
              >
                <OrderSummary />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};
export default Cart;

const EmptyCartUI = () => (
  <motion.div
    className="flex flex-col items-center justify-center space-y-4 py-16"
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5 }}
  >
    <ShoppingCart className="h-24 w-24 text-gray-300" />
    <h3 className="text-2xl font-semibold ">Your cart is empty</h3>
    <p className="text-gray-400">
      Looks like you {"haven't"} added anything to your cart yet.
    </p>
    <Link
      className="mt-4 rounded-md bg-emerald-500 px-6 py-2 text-white transition-colors hover:bg-emerald-600"
      to="/"
    >
      Start Shopping
    </Link>
  </motion.div>
);

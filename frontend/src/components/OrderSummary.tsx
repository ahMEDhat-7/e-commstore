import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import { Loader2, MoveRight, AlertCircle } from "lucide-react";
import { loadStripe } from "@stripe/stripe-js";
import { useSelector } from "react-redux";
import { useState, useCallback } from "react";
import { selectCart } from "../store/cart/cartSlice";
import { selectAuth } from "../store/auth/authSlice";
import { createCheckoutSession } from "../common/api/paymentApi";

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUB_KEY);

const OrderSummary = () => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [checkoutError, setCheckoutError] = useState<string | null>(null);
  const {
    loading: cartLoading,
    error: cartError,
    items,
    total,
  } = useSelector(selectCart);
  const { user } = useSelector(selectAuth);

  const formattedTotal = total.toFixed(2);

  const handlePayment = useCallback(async () => {
    if (!user) {
      setCheckoutError("Please sign in to proceed with checkout");
      return;
    }

    if (items.length === 0) {
      setCheckoutError("Your cart is empty");
      return;
    }

    setCheckoutError(null);
    setIsProcessing(true);

    try {
      const stripe = await stripePromise;
      if (!stripe) throw new Error("Payment system is currently unavailable");

      const response = await createCheckoutSession({ products: items });
      const result = await stripe.redirectToCheckout({
        sessionId: response.id,
      });

      if (result.error)
        throw new Error(result.error.message || "Payment initiation failed");
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Payment processing failed";
      setCheckoutError(errorMessage);
      console.error("Payment error:", err);
    } finally {
      setIsProcessing(false);
    }
  }, [user, items]);

  return (
    <motion.div
      className="space-y-4 rounded-lg border border-gray-700 bg-gray-800 p-4 shadow-sm sm:p-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-emerald-400">
          Order Summary
        </h2>
        {cartLoading && (
          <Loader2 className="h-5 w-5 animate-spin text-emerald-400" />
        )}
      </div>

      {/* Price Summary */}
      <div className="space-y-4">
        <AnimatePresence mode="wait">
          <div className="space-y-2">
            <dl className="flex items-center justify-between gap-4 border-t border-gray-600 pt-2">
              <dt className="text-base font-bold text-white">Total</dt>
              <dd className="text-base font-bold text-emerald-400">
                ${formattedTotal}
              </dd>
            </dl>
          </div>
        </AnimatePresence>

        {/* Error Message */}
        <AnimatePresence>
          {(checkoutError || cartError) && (
            <motion.div
              className="flex items-center justify-center gap-2 rounded-md bg-red-900/20 p-2 text-sm text-red-400"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
            >
              <AlertCircle className="h-4 w-4" />
              <span>{checkoutError || cartError}</span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Checkout Button */}
        <motion.button
          className={`flex w-full items-center justify-center rounded-lg px-5 py-2.5 text-sm font-medium text-white 
            focus:outline-none focus:ring-4 focus:ring-emerald-300 disabled:cursor-not-allowed transition-all duration-200
            ${
              isProcessing || cartLoading || !user
                ? "bg-emerald-600/50"
                : "bg-emerald-600 hover:bg-emerald-700"
            }`}
          whileHover={{
            scale: isProcessing || cartLoading || !user ? 1 : 1.02,
          }}
          whileTap={{ scale: isProcessing || cartLoading || !user ? 1 : 0.98 }}
          onClick={handlePayment}
          disabled={isProcessing || cartLoading || items.length === 0 || !user}
        >
          {isProcessing ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Processing Checkout...
            </>
          ) : !user ? (
            "Sign in to Checkout"
          ) : items.length === 0 ? (
            "Add Items to Cart"
          ) : (
            "Proceed to Checkout"
          )}
        </motion.button>

        {/* Continue Shopping */}
        <div className="flex items-center justify-center gap-2">
          <span className="text-sm font-normal text-gray-400">or</span>
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-sm font-medium text-emerald-400 hover:text-emerald-300 transition-colors"
          >
            Continue Shopping
            <MoveRight
              size={16}
              className="transition-transform group-hover:translate-x-1"
            />
          </Link>
        </div>
      </div>
    </motion.div>
  );
};

export default OrderSummary;

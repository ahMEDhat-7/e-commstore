import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Loader2, MoveRight } from "lucide-react";
import { loadStripe } from "@stripe/stripe-js";
import { useDispatch, useSelector } from "react-redux";
import { useState, useEffect } from "react";
import type { RootState, AppDispatch } from "../store/store";
import axios from "axios";
import { calculateTotals } from "../store/cart/cartSlice";

const stripePromise = loadStripe(
  "pk_test_51SCod6QlyX6I17P3Mkodeo4tHzRY6CBDs9eypPvb5W2t7KZmALoAu4WMiinodNVkgkLge3RjtgecF5Cb8EIY6t0F002bvCajcn"
);

const OrderSummary = () => {
  const { total, subtotal, items, coupon, isCouponApplied, loading } =
    useSelector((state: RootState) => state.cart);
  const dispatch = useDispatch<AppDispatch>();
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    dispatch(calculateTotals());
  }, [items, coupon, isCouponApplied, dispatch]);

  const savings = subtotal - total;
  const formattedSubtotal = subtotal.toFixed(2);
  const formattedTotal = total.toFixed(2);
  const formattedSavings = savings.toFixed(2);

  const handlePayment = async () => {
    setError(null);
    setIsProcessing(true);
    try {
      const stripe = await stripePromise;
      const res = await axios.post("/payments/create-checkout-session", {
        products: items,
        couponCode: coupon ? coupon.code : null,
      });

      const session = res.data;
      const result = await stripe?.redirectToCheckout({
        sessionId: session.id,
      });

      if (result?.error) {
        throw new Error(result.error.message || "Payment failed");
      }
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Payment processing failed"
      );
      console.error("Payment error:", err);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <motion.div
      className="space-y-4 rounded-lg border border-gray-700 bg-gray-800 p-4 shadow-sm sm:p-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <p className="text-xl font-semibold text-emerald-400">Order summary</p>

      <div className="space-y-4">
        <div className="space-y-2">
          <dl className="flex items-center justify-between gap-4">
            <dt className="text-base font-normal text-gray-300">
              Original price
            </dt>
            <dd className="text-base font-medium text-white">
              ${formattedSubtotal}
            </dd>
          </dl>

          {savings > 0 && (
            <dl className="flex items-center justify-between gap-4">
              <dt className="text-base font-normal text-gray-300">Savings</dt>
              <dd className="text-base font-medium text-emerald-400">
                -${formattedSavings}
              </dd>
            </dl>
          )}

          {coupon && isCouponApplied && (
            <dl className="flex items-center justify-between gap-4">
              <dt className="text-base font-normal text-gray-300">
                Coupon ({coupon.code})
              </dt>
              <dd className="text-base font-medium text-emerald-400">
                -{coupon.discountPercentage}%
              </dd>
            </dl>
          )}
          <dl className="flex items-center justify-between gap-4 border-t border-gray-600 pt-2">
            <dt className="text-base font-bold text-white">Total</dt>
            <dd className="text-base font-bold text-emerald-400">
              ${formattedTotal}
            </dd>
          </dl>
        </div>

        {error && (
          <div className="text-sm text-red-400 text-center">{error}</div>
        )}

        <motion.button
          className={`flex w-full items-center justify-center rounded-lg bg-emerald-600 px-5 py-2.5 text-sm font-medium
            text-white hover:bg-emerald-700 focus:outline-none focus:ring-4 focus:ring-emerald-300 disabled:opacity-50
            disabled:cursor-not-allowed transition-colors ${
              loading || isProcessing ? "cursor-not-allowed" : ""
            }`}
          whileHover={{ scale: loading || isProcessing ? 1 : 1.05 }}
          whileTap={{ scale: loading || isProcessing ? 1 : 0.95 }}
          onClick={handlePayment}
          disabled={loading || isProcessing || items.length === 0}
        >
          {isProcessing ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Processing...
            </>
          ) : (
            "Proceed to Checkout"
          )}
        </motion.button>

        <div className="flex items-center justify-center gap-2">
          <span className="text-sm font-normal text-gray-400">or</span>
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-sm font-medium text-emerald-400 underline hover:text-emerald-300 hover:no-underline"
          >
            Continue Shopping
            <MoveRight size={16} />
          </Link>
        </div>
      </div>
    </motion.div>
  );
};
export default OrderSummary;

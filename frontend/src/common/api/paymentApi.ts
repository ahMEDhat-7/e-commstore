import axios from "axios";
import type { CartItemType } from "../../store/cart/cartSlice";

const paymentAPI = axios.create({
  baseURL:
    import.meta.env.MODE === "development"
      ? "http://localhost:7000/api/payments"
      : "/api/auth",
  withCredentials: true,
});

export const createCheckoutSession = async (data: {
  products: CartItemType[];
  couponCode?: string | null;
}) => {
  const res = await paymentAPI.post("/create-checkout-session", data);

  return res.data;
};

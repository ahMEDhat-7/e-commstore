import axios from "axios";
import type { CouponType } from "../../store/coupon/couponSlice";

const couponAPI = axios.create({
  baseURL:
    import.meta.env.MODE === "development"
      ? "http://localhost:7000/api/coupon"
      : "/api/coupon",
  withCredentials: true,
});

export const fetchMyCoupon = async (): Promise<CouponType> => {
  const response = await couponAPI.get("");
  return response.data;
};

export const validateCoupon = async (code: string): Promise<CouponType> => {
  const response = await couponAPI.post("/validate", { code });
  return response.data;
};

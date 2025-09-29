import axios from "axios";

const couponAPI = axios.create({
  baseURL:
    import.meta.env.MODE === "development"
      ? "http://localhost:7000/api/coupons"
      : "/api/coupon",
  withCredentials: true,
});

export const fetchMyCoupon = async () => {
  const response = await couponAPI.get("");
  return response.data;
};

export const validateCoupon = async (code: string) => {
  const response = await couponAPI.post("/validate", { code });
  console.log(response.data);

  return response.data;
};

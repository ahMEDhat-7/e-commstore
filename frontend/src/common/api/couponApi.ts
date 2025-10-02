import axios from "axios";

const couponAPI = axios.create({
  baseURL: import.meta.env.VITE_BASE_URL + "/coupons",
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

import axios from "axios";

const cartAPI = axios.create({
  baseURL:
    import.meta.env.MODE === "development"
      ? "http://localhost:7000/api/cart"
      : "/api/cart",
  withCredentials: true,
});

export const fetchCart = async () => {
  const res = await cartAPI.get("/");
  return res.data;
};

export const addToCart = async (productId: string, quantity: number = 1) => {
  const res = await cartAPI.post("/", { productId, quantity });
  return res.data;
};

export const updateCartItem = async (productId: string, quantity: number) => {
  const res = await cartAPI.patch(`/${productId}`, { quantity });
  return res.data;
};

export const removeCartItem = async (productId: string) => {
  const res = await cartAPI.delete(`/${productId}`);
  return res.data;
};

export const clearCart = async () => {
  const res = await cartAPI.delete("/");
  return res.data;
};

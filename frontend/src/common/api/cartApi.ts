import axios from "axios";

const API_BASE = "/api/cart";

export const fetchCart = async () => {
  const res = await axios.get(API_BASE);
  return res.data.cart;
};

export const addToCart = async (productId: string, quantity: number = 1) => {
  const res = await axios.post(API_BASE, { productId, quantity });
  return res.data.cart;
};

export const updateCartItem = async (productId: string, quantity: number) => {
  const res = await axios.patch(`${API_BASE}/${productId}`, { quantity });
  return res.data.cart;
};

export const removeCartItem = async (productId: string) => {
  const res = await axios.delete(`${API_BASE}/${productId}`);
  return res.data.cart;
};

export const clearCart = async () => {
  const res = await axios.delete(`${API_BASE}/clear`);
  return res.data.cart;
};

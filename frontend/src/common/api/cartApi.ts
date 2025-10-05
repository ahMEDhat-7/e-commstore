import axios, { AxiosError } from "axios";

const cartAPI = axios.create({
  baseURL: import.meta.env.VITE_BASE_URL + "/carts",
  withCredentials: true,
});

const handleApiError = (error: unknown) => {
  if (error instanceof AxiosError) {
    throw new Error(
      error.response?.data?.message ||
        "An error occurred with the cart operation"
    );
  }
  throw error;
};

export const fetchCart = async () => {
  try {
    const res = await cartAPI.get("/");
    return res.data;  
  } catch (error) {
    throw handleApiError(error);
  }
};

export const addToCart = async (productId: string, quantity: number = 1) => {
  try {
    const res = await cartAPI.post("/", { productId, quantity });
    return res.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

export const updateCartItem = async (productId: string, quantity: number) => {
  try {
    const res = await cartAPI.patch(`/`, { productId, quantity });
    return res.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

export const removeCartItem = async (productId: string) => {
  try {
    const res = await cartAPI.delete(`/${productId}`);
    return res.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

export const clearCart = async () => {
  try {
    const res = await cartAPI.delete("/");
    return res.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

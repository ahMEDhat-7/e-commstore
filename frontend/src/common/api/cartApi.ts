import axios, { AxiosError } from "axios";

interface CartResponse {
  cartItems: Array<{
    _id: string;
    name: string;
    price: number;
    image: string;
    quantity: number;
  }>;
  subtotal: number;
  total: number;
}

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

export const fetchCart = async (): Promise<CartResponse> => {
  try {
    const res = await cartAPI.get("");
    return res.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

export const addToCart = async (
  productId: string,
  quantity: number = 1
): Promise<CartResponse> => {
  try {
    const res = await cartAPI.post("", { productId, quantity });
    return res.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

export const updateCartItem = async (
  productId: string,
  quantity: number
): Promise<CartResponse> => {
  try {
    const res = await cartAPI.patch(`/${productId}`, { quantity });

    return res.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

export const removeCartItem = async (
  productId: string
): Promise<CartResponse> => {
  try {
    const res = await cartAPI.delete("", { data: { productId } });
    return res.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

export const clearCart = async (): Promise<CartResponse> => {
  try {
    const res = await cartAPI.delete("");
    return res.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

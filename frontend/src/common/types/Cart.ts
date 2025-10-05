import type { Product } from "./Product";

export interface CartItem {
  _id: string;
  productId: Product;
  quantity: number;
}

export interface Cart {
  _id: string;
  userId: string;
  items: CartItem[];
}

export interface CartState {
  items: CartItem[];
  loading: boolean;
  error: string | null;
}

import { Minus, Plus, Trash } from "lucide-react";
import { useDispatch } from "react-redux";
import type { AppDispatch } from "../store/store";
import {
  removeCartItemThunk,
  updateCartItemThunk,
} from "../store/cart/cartThunk";
import { useState } from "react";
import type { CartItem } from "../common/types/Cart";

const CartItemViewer = ({ item }: { item: CartItem }) => {
  const dispatch = useDispatch<AppDispatch>();
  const [isUpdating, setIsUpdating] = useState(false);

  const handleQuantityUpdate = async (newQuantity: number) => {
    if (isUpdating || newQuantity === item.quantity) return;
    setIsUpdating(true);
    try {
      dispatch(
        updateCartItemThunk({
          productId: item.productId._id,
          quantity: newQuantity,
        })
      );
    } catch (error) {
      console.error("Failed to update item:", error);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleRemoveItem = () => {
    if (isUpdating) return;
    setIsUpdating(true);
    try {
      dispatch(removeCartItemThunk(item.productId._id));
    } catch (error) {
      console.error("Failed to remove item:", error);
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="rounded-lg border p-4 shadow-sm border-gray-700 bg-gray-800 md:p-6">
      <div className="space-y-4 md:flex md:items-center md:justify-between md:gap-6 md:space-y-0">
        <div className="shrink-0 md:order-1">
          <img
            className="h-20 md:h-32 rounded object-cover"
            src={item.productId.image}
            alt={item.productId.name}
          />
        </div>

        <div className="flex items-center justify-between md:order-3 md:justify-end">
          <div className="flex items-center gap-2">
            <button
              onClick={() =>
                item.quantity > 1 && handleQuantityUpdate(item.quantity - 1)
              }
              disabled={isUpdating || item.quantity <= 1}
              className="inline-flex h-5 w-5 items-center justify-center rounded-md border border-gray-600 bg-gray-700 hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-emerald-500 disabled:opacity-50"
            >
              <Minus className="text-gray-300" />
            </button>
            <p>{item.quantity}</p>
            <button
              onClick={() => handleQuantityUpdate(item.quantity + 1)}
              disabled={isUpdating}
              className="inline-flex h-5 w-5 items-center justify-center rounded-md border border-gray-600 bg-gray-700 hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-emerald-500 disabled:opacity-50"
            >
              <Plus className="text-gray-300" />
            </button>
          </div>

          <div className="text-end md:order-4 md:w-32">
            <p className="text-base font-bold text-emerald-400">
              ${item.productId.price}
            </p>
            <p className="text-sm text-gray-400">
              Total: $ {item.productId.price * item.quantity}
            </p>
          </div>
        </div>

        <div className="w-full min-w-0 flex-1 space-y-4 md:order-2 md:max-w-md">
          <p className="text-base font-medium text-white hover:text-emerald-400 hover:underline">
            {item.productId.name}
          </p>
          <button
            onClick={handleRemoveItem}
            disabled={isUpdating}
            className="inline-flex items-center text-sm font-medium text-red-400 hover:text-red-300 hover:underline disabled:opacity-50"
          >
            <Trash />
          </button>
        </div>
      </div>
    </div>
  );
};

export default CartItemViewer;

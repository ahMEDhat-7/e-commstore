import { Minus, Plus, Trash } from "lucide-react";
import type { CartItemType } from "../store/cart/cartSlice";
import { useDispatch } from "react-redux";
import type { AppDispatch } from "../store/store";
import {
  removeCartItemThunk,
  updateCartItemThunk,
} from "../store/cart/cartThunk";
import { useState } from "react";

const CartItem = ({ item }: { item: CartItemType }) => {
  const dispatch = useDispatch<AppDispatch>();
  const [quantityItem, setQuantityItem] = useState<number>(item.quantity);
  return (
    <div className="rounded-lg border p-4 shadow-sm border-gray-700 bg-gray-800 md:p-6">
      <div className="space-y-4 md:flex md:items-center md:justify-between md:gap-6 md:space-y-0">
        <div className="shrink-0 md:order-1">
          <img className="h-20 md:h-32 rounded object-cover" src={item.image} />
        </div>
        <label className="sr-only">Choose quantity:</label>

        <div className="flex items-center justify-between md:order-3 md:justify-end">
          <div className="flex items-center gap-2">
            <button
              className="inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-md border border-gray-600 bg-gray-700 hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              onClick={() => {
                if (item.quantity > 1) {
                  setQuantityItem((prev) => prev - 1);
                  dispatch(
                    updateCartItemThunk({
                      productId: item._id,
                      quantity: quantityItem,
                    })
                  );
                }
              }}
            >
              <Minus className="text-gray-300" />
            </button>
            <p>{quantityItem}</p>
            <button
              className="inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-md border border-gray-600 bg-gray-700 hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              onClick={() => {
                setQuantityItem((prev) => prev + 1);
                dispatch(
                  updateCartItemThunk({
                    productId: item._id,
                    quantity: quantityItem,
                  })
                );
              }}
            >
              <Plus className="text-gray-300" />
            </button>
          </div>

          <div className="text-end md:order-4 md:w-32">
            <p className="text-base font-bold text-emerald-400">
              ${item.price}
            </p>
          </div>
        </div>

        <div className="w-full min-w-0 flex-1 space-y-4 md:order-2 md:max-w-md">
          <p className="text-base font-medium text-white hover:text-emerald-400 hover:underline">
            {item.name}
          </p>
          <div className="flex items-center gap-4">
            <button
              className="inline-flex items-center text-sm font-medium text-red-400
							 hover:text-red-300 hover:underline"
              onClick={() => dispatch(removeCartItemThunk(item._id))}
            >
              <Trash />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
export default CartItem;

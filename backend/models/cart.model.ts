import mongoose from "mongoose";

const CartItemSchema = new mongoose.Schema({
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
    min: 1,
  },
});

const CartSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    items: [CartItemSchema],
    subtotal: {
      type: Number,
      default: 0,
    },
    total: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

// Middleware to calculate totals before saving
CartSchema.pre("save", async function (next) {
  const cart = this;
  let subtotal = 0;

  if (cart.items.length > 0) {
    // Populate products to get current prices
    const populatedCart = await cart.populate("items.productId");
    subtotal = populatedCart.items.reduce(
      (sum, item: any) => sum + item.productId.price * item.quantity,
      0
    );
  }

  cart.subtotal = subtotal;
  cart.total = subtotal; // Will be modified if coupons are applied

  next();
});

const Cart = mongoose.model("Cart", CartSchema);
export default Cart;

import { NextFunction, Request, Response } from "express";
import Cart from "../models/cart.model";
import Product from "../models/product.model";
import asyncWrapper from "../middlewares/asyncWrapper";
import { CustomError } from "../utils/customError";

interface PopulatedCartItem {
  productId: {
    _id: string;
    name: string;
    price: number;
    image: string;
  };
  quantity: number;
}

interface CartItemResponse {
  _id: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
}

const mapCartItemsToResponse = (
  items: PopulatedCartItem[]
): CartItemResponse[] => {
  return items.map((item) => ({
    _id: item.productId._id,
    name: item.productId.name,
    price: item.productId.price,
    image: item.productId.image,
    quantity: item.quantity,
  }));
};

export const getCartProducts = asyncWrapper(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = (req as any).user._id;

      const cart = await Cart.findOne({ userId }).populate<{
        items: PopulatedCartItem[];
      }>("items.productId", "_id name price image");

      if (!cart) {
        return res.status(200).json({ cartItems: [], subtotal: 0, total: 0 });
      }

      const cartItems = mapCartItemsToResponse(cart.items);

      return res.status(200).json({
        cartItems,
        subtotal: cart.subtotal,
        total: cart.total,
      });
    } catch (error) {
      console.error("Error in getCartProducts controller:", error);
      return next(new CustomError(500, "Server error"));
    }
  }
);

export const addToCart = asyncWrapper(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = (req as any).user._id;
      const { productId, quantity = 1 } = req.body;

      if (!productId) {
        return next(new CustomError(400, "Product ID is required"));
      }

      if (quantity < 1) {
        return next(new CustomError(400, "Quantity must be at least 1"));
      }

      // Use findById with projection to optimize query
      const product = await Product.findById(productId).select("_id");
      if (!product) {
        return next(new CustomError(404, "Product not found"));
      }

      // First, try to find the existing cart and update quantity if item exists
      let cart = await Cart.findOneAndUpdate(
        {
          userId,
          "items.productId": productId,
        },
        {
          $inc: {
            "items.$.quantity": quantity,
          },
        },
        {
          new: true,
        }
      );

      // If cart doesn't exist or item is not in cart, create/update it
      if (!cart) {
        cart = await Cart.findOneAndUpdate(
          { userId },
          {
            $setOnInsert: { userId },
            $push: {
              items: { productId, quantity },
            },
          },
          {
            new: true,
            upsert: true,
          }
        );

        // Get populated cart with necessary fields only
        const populatedCart = await Cart.findById(cart?._id).populate<{
          items: PopulatedCartItem[];
        }>("items.productId", "_id name price image");

        if (!populatedCart) {
          return next(new CustomError(404, "Cart not found"));
        }

        const cartItems = mapCartItemsToResponse(populatedCart.items);

        return res.status(201).json({
          cartItems,
          subtotal: populatedCart.subtotal,
          total: populatedCart.total,
        });
      }
    } catch (error) {
      console.error("Error in addToCart controller:", error);
      return next(new CustomError(500, "Server error"));
    }
  }
);

export const removeFromCart = asyncWrapper(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = (req as any).user._id;
      const { productId } = req.body;

      // Use findOneAndUpdate to handle race conditions
      const cart = await Cart.findOneAndUpdate(
        { userId },
        productId
          ? { $pull: { items: { productId } } }
          : { $set: { items: [] } },
        { new: true }
      );

      if (!cart) {
        return next(new CustomError(404, "Cart not found"));
      }

      // Get populated cart with necessary fields only
      const populatedCart = await Cart.findById(cart._id).populate<{
        items: PopulatedCartItem[];
      }>("items.productId", "_id name price image");

      if (!populatedCart) {
        return next(new CustomError(404, "Cart not found"));
      }
      const cartItems = mapCartItemsToResponse(populatedCart.items);

      return res.status(200).json({
        cartItems,
        subtotal: populatedCart.subtotal,
        total: populatedCart.total,
      });
    } catch (error) {
      console.error("Error in removeFromCart controller:", error);
      return next(new CustomError(500, "Server error"));
    }
  }
);

export const updateQuantity = asyncWrapper(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = (req as any).user._id;
      const { productId } = req.params;
      const { quantity } = req.body;

      if (quantity < 0) {
        return next(new CustomError(400, "Quantity cannot be negative"));
      }

      let cart;
      if (quantity === 0) {
        // Remove item if quantity is 0
        cart = await Cart.findOneAndUpdate(
          { userId },
          { $pull: { items: { productId } } },
          { new: true }
        );
      } else {
        // Update quantity if item exists, return null if item doesn't exist
        cart = await Cart.findOneAndUpdate(
          {
            userId,
            "items.productId": productId,
          },
          {
            $set: { "items.$.quantity": quantity },
          },
          { new: true }
        );
      }

      if (!cart) {
        return next(
          new CustomError(
            404,
            quantity === 0 ? "Cart not found" : "Product not found in cart"
          )
        );
      }

      // Get populated cart with necessary fields only
      const populatedCart = await Cart.findById(cart._id).populate<{
        items: PopulatedCartItem[];
      }>("items.productId", "_id name price image");

      if (!populatedCart) {
        return next(new CustomError(404, "Cart not found"));
      }
      const cartItems = mapCartItemsToResponse(populatedCart.items);

      return res.status(200).json({
        cartItems,
        subtotal: populatedCart.subtotal,
        total: populatedCart.total,
      });
    } catch (error) {
      console.error("Error in updateQuantity controller:", error);
      return next(new CustomError(500, "Server error"));
    }
  }
);

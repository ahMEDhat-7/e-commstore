import { NextFunction, Request, Response } from "express";
import Cart from "../models/cart.model";
import Product from "../models/product.model";
import asyncWrapper from "../middlewares/asyncWrapper";
import { CustomError } from "../utils/customError";
/**
 * @desc Add product to cart (create if not exists)
 * @route POST /api/cart
 */
export const addToCart = asyncWrapper(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = (req as any)["user"];
      const { productId, quantity } = req.body;

      let cart = await Cart.findOne({ userId });

      if (!cart) {
        cart = new Cart({
          userId,
          items: [{ productId, quantity }],
        });
      } else {
        const existingItem = cart.items.find(
          (item: any) => item.productId.toString() === productId
        );

        if (existingItem) {
          existingItem.quantity += quantity;
        } else {
          cart.items.push({ productId, quantity });
        }
      }

      await cart.save();
      const populatedCart = await cart.populate("items.productId");

      return res.status(200).json({
        message: "Item added to cart",
        cart: populatedCart,
      });
    } catch (error: any) {
      return next(new CustomError(500, error.message));
    }
  }
);

/**
 * @desc Get user cart (with product data)
 * @route GET /api/cart
 */
export const getCartProducts = asyncWrapper(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = (req as any)["user"];
      const cart = await Cart.findOne({ userId }).populate("items.productId");

      if (!cart) {
        return res.status(404).json({ message: "Cart not found" });
      }

      return res.status(200).json({
        message: "Cart fetched successfully",
        cart,
      });
    } catch (error: any) {
      return next(new CustomError(500, error.message));
    }
  }
);

/**
 * @desc Update quantity of a product in the cart
 * @route PATCH /api/cart
 */
export const updateCartItem = asyncWrapper(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = (req as any)["user"];
      const { productId, quantity } = req.body;

      const cart = await Cart.findOne({ userId });
      if (!cart) return next(new CustomError(404, "Cart not found"));

      const item = cart.items.find(
        (item: any) => item.productId.toString() === productId
      );
      if (!item) return next(new CustomError(404, "Item not found in cart"));

      item.quantity = quantity;
      await cart.save();

      const populatedCart = await cart.populate("items.productId");
      return res.status(200).json({
        message: "Cart item updated",
        cart: populatedCart,
      });
    } catch (error: any) {
      return next(new CustomError(500, error.message));
    }
  }
);

/**
 * @desc Remove a product from the cart
 * @route DELETE /api/cart/:productId
 */
export const removeCartItem = asyncWrapper(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = (req as any)["user"];
      const { productId } = req.params;

      const updatedCart = await Cart.findOneAndUpdate(
        { userId },
        { $pull: { items: { productId } } },
        { new: true }
      ).populate("items.productId");

      if (!updatedCart)
        return next(new CustomError(404, "Cart not found or item missing"));

      return res.status(200).json({
        message: "Item removed from cart",
        cart: updatedCart,
      });
    } catch (error: any) {
      return next(new CustomError(500, error.message));
    }
  }
);

/**
 * @desc Clear all items from the user's cart
 * @route DELETE /api/cart
 */
export const clearCart = asyncWrapper(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = (req as any)["user"];
      const clearedCart = await Cart.findOneAndUpdate(
        { userId },
        { $set: { items: [] } },
        { new: true }
      );

      if (!clearedCart) return next(new CustomError(404, "Cart not found"));

      return res.status(200).json({
        message: "Cart cleared successfully",
        cart: clearedCart,
      });
    } catch (error: any) {
      return next(new CustomError(500, error.message));
    }
  }
);
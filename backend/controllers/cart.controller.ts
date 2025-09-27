import { NextFunction, Request, Response } from "express";
import Product from "../models/product.model.js";
import asyncWrapper from "../middlewares/asyncWrapper";
import { CustomError } from "../utils/customError";

export const getCartProducts = asyncWrapper(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const user = (req as any)["user"];
      const products = await Product.find({
        _id: { $in: user.cartItems },
      });

      // add quantity for each product
      const cartItems = products.map((product) => {
        const item = user.cartItems.find(
          (cartItem: any) => cartItem.id === product.id
        );
        return { ...product.toJSON(), quantity: item.quantity };
      });

      res.json(cartItems);
    } catch (error) {
      console.log("Error in getCartProducts controller", error);
      next(new CustomError(500, "Server error"));
    }
  }
);

export const addToCart = asyncWrapper(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { productId } = req.body;
      const user = (req as any)["user"];

      const existingItem = user.cartItems.find(
        (item: any) => item.id === productId
      );
      if (existingItem) {
        existingItem.quantity += 1;
      } else {
        user.cartItems.push(productId);
      }

      await user.save();
      res.json(user.cartItems);
    } catch (error) {
      console.log("Error in addToCart controller", error);
      next(new CustomError(500, "Server error"));
    }
  }
);

export const removeAllFromCart = asyncWrapper(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { productId } = req.body;
      const user = (req as any)["user"];
      if (!productId) {
        user.cartItems = [];
      } else {
        user.cartItems = user.cartItems.filter(
          (item: any) => item.id !== productId
        );
      }
      await user.save();
      res.json(user.cartItems);
    } catch (error) {
      console.log("Error in addToCart controller", error);
      next(new CustomError(500, "Server error"));
    }
  }
);

export const updateQuantity = asyncWrapper(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id: productId } = req.params;
      const { quantity } = req.body;
      const user = (req as any)["user"];
      const existingItem = user.cartItems.find(
        (item: any) => item.id === productId
      );

      if (existingItem) {
        if (quantity === 0) {
          user.cartItems = user.cartItems.filter(
            (item: any) => item.id !== productId
          );
          await user.save();
          return res.json(user.cartItems);
        }

        existingItem.quantity = quantity;
        await user.save();
        res.json(user.cartItems);
      } else {
        res.status(404).json({ message: "Product not found" });
      }
    } catch (error) {
      console.log("Error in addToCart controller", error);
      next(new CustomError(500, "Server error"));
    }
  }
);

import { NextFunction, Request, Response } from "express";
import Product from "../models/product.model";
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

      return res.status(200).json({ cartItems });
    } catch (error) {
      console.log("Error in getCartProducts controller", error);
      return next(new CustomError(500, "Server error"));
    }
  }
);

export const addToCart = asyncWrapper(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const user = (req as any)["user"];
      const { productId } = req.body;
      if (!productId) {
        return next(new CustomError(400, "Product ID is required"));
      }
      let item = user.cartItems.find(
        (cartItem: any) => cartItem.id === productId
      );
      if (item) {
        item.quantity += 1;
      } else {
        user.cartItems.push({ id: productId, quantity: 1 });
      }
      await user.save();
      return res.status(201).json({ cartItems: user.cartItems });
    } catch (error) {
      console.log("Error in addToCart controller", error);
      return next(new CustomError(500, "Server error"));
    }
  }
);

export const removeAllFromCart = asyncWrapper(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const user = (req as any)["user"];
      console.log(req.body);
      
      const {  productId } = req.body;
      if (!productId) {
        user.cartItems = [];
      } else {
        user.cartItems = user.cartItems.filter(
          (item: any) => item.id !== productId
        );
      }
      await user.save();
      return res.status(200).json({ cartItems: user.cartItems });
    } catch (error) {
      console.log("Error in removeAllFromCart controller", error);
      return next(new CustomError(500, "Server error"));
    }
  }
);

export const updateQuantity = asyncWrapper(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const user = (req as any)["user"];
      const { id: productId } = req.params;
      const { quantity } = req.body;
      let item = user.cartItems.find(
        (cartItem: any) => cartItem.id === productId
      );
      if (!item) {
        return next(new CustomError(404, "Product not found in cart"));
      }
      if (quantity <= 0) {
        user.cartItems = user.cartItems.filter(
          (cartItem: any) => cartItem.id !== productId
        );
      } else {
        item.quantity = quantity;
      }
      await user.save();
      return res.status(200).json({ cartItems: user.cartItems });
    } catch (error) {
      console.log("Error in updateQuantity controller", error);
      return next(new CustomError(500, "Server error"));
    }
  }
);

import { NextFunction, Request, Response } from "express";
import Coupon from "../models/coupon.model";
import Order from "../models/order.model";
import stripe from "../config/stripe";
import asyncWrapper from "../middlewares/asyncWrapper";
import { CustomError } from "../utils/customError";

export const createCheckoutSession = asyncWrapper(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { products } = req.body;
      if (!Array.isArray(products) || products.length === 0) {
        return res
          .status(400)
          .json({ error: "Invalid or empty products array" });
      }

      let totalAmount = 0;

      const lineItems = products.map((product) => {
        const amount = Math.round(product.productId.price * 100);
        totalAmount += amount * product.quantity;
        return {
          price_data: {
            currency: "EGP",
            product_data: {
              name: product.productId.name,
              images: [product.productId.image],
            },
            unit_amount: amount,
          },
          quantity: product.quantity || 1,
        };
      });

      const user = (req as any)["user"];

      const session = await stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        line_items: lineItems,
        mode: "payment",
        success_url: `${process.env.CLIENT_URL}/purchase-success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${process.env.CLIENT_URL}/purchase-cancel`,
        metadata: {
          userId: user._id.toString(),
          products: JSON.stringify(
            products.map((p) => ({
              id: p._id,
              quantity: p.quantity,
              price: p.productId.price,
            }))
          ),
        },
      });

      res.status(200).json({ id: session.id, totalAmount: totalAmount / 100 });
    } catch (error) {
      return next(new CustomError(500, "Server error" + error));
    }
  }
);

export const checkoutSuccess = asyncWrapper(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { sessionId } = req.body;
      const session = await stripe.checkout.sessions.retrieve(sessionId);

      if (session.payment_status === "paid") {
        // create a new Order
        if (!session.metadata) {
          throw new Error("Session metadata is missing");
        }
        const products = JSON.parse(session.metadata.products);
        const newOrder = new Order({
          user: session.metadata.userId,
          products: products.map((product: any) => ({
            product: product.id,
            quantity: product.quantity,
            price: product.price,
          })),
          totalAmount: session.amount_total ?? 0 / 100, // convert from cents to dollars,
          stripeSessionId: sessionId,
        });

        await newOrder.save();

        return res.status(200).json({
          success: true,
          message:
            "Payment successful, order created, and coupon deactivated if used.",
          orderId: newOrder._id,
        });
      }
    } catch (error) {
      return next(new CustomError(500, `Server error:${error}`));
    }
  }
);

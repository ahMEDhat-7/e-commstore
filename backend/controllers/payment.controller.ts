import { NextFunction, Request, Response } from "express";
import Coupon from "../models/coupon.model";
import Order from "../models/order.model";
import stripe from "../config/stripe";
import asyncWrapper from "../middlewares/asyncWrapper";
import { CustomError } from "../utils/customError";

export const createCheckoutSession = asyncWrapper(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { products, couponCode } = req.body;

      if (!Array.isArray(products) || products.length === 0) {
        return res
          .status(400)
          .json({ error: "Invalid or empty products array" });
      }

      let totalAmount = 0;

      const lineItems = products.map((product) => {
        const amount = Math.round(product.price * 100);
        totalAmount += amount * product.quantity;

        return {
          price_data: {
            currency: "usd",
            product_data: {
              name: product.name,
              images: [product.image],
            },
            unit_amount: amount,
          },
          quantity: product.quantity || 1,
        };
      });

      const user = (req as any)["user"];
      let coupon = null;
      if (couponCode) {
        coupon = await Coupon.findOne({
          code: couponCode,
          userId: user._id,
          isActive: true,
        });
        if (coupon) {
          totalAmount -= Math.round(
            (totalAmount * coupon.discountPercentage) / 100
          );
        }
      }

      const session = await stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        line_items: lineItems,
        mode: "payment",
        success_url: `${process.env.CLIENT_URL}/purchase-success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${process.env.CLIENT_URL}/purchase-cancel`,
        discounts: coupon
          ? [
              {
                coupon: await createStripeCoupon(coupon.discountPercentage),
              },
            ]
          : [],
        metadata: {
          userId: user._id.toString(),
          couponCode: couponCode || "",
          products: JSON.stringify(
            products.map((p) => ({
              id: p._id,
              quantity: p.quantity,
              price: p.price,
            }))
          ),
        },
      });

      if (totalAmount >= 20000) {
        await createNewCoupon(user._id);
      }
      res.status(200).json({ id: session.id, totalAmount: totalAmount / 100 });
    } catch (error) {
      return next(new CustomError(500, "Server error"));
    }
  }
);

export const checkoutSuccess = asyncWrapper(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { sessionId } = req.body;
      const session = await stripe.checkout.sessions.retrieve(sessionId);

      if (session.payment_status === "paid") {
        if (session?.metadata?.couponCode) {
          await Coupon.findOneAndUpdate(
            {
              code: session.metadata.couponCode,
              userId: session.metadata.userId,
            },
            {
              isActive: false,
            }
          );
        }

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
      return next(new CustomError(500, "Server error"));
    }
  }
);

async function createStripeCoupon(discountPercentage: number) {
  const coupon = await stripe.coupons.create({
    percent_off: discountPercentage,
    duration: "once",
  });

  return coupon.id;
}

async function createNewCoupon(userId: string) {
  await Coupon.findOneAndDelete({ userId });

  const newCoupon = new Coupon({
    code: "GIFT" + Math.random().toString(36).substring(2, 8).toUpperCase(),
    discountPercentage: 10,
    expirationDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
    userId: userId,
  });

  await newCoupon.save();

  return newCoupon;
}

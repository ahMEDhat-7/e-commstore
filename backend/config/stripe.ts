import Stripe from "stripe";
import "dotenv/config";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string);

console.log("[+] stripe connected successfully");
export default stripe;

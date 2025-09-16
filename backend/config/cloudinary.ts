import { v2 as cloudinaryService } from "cloudinary";
import dotenv from "dotenv";

dotenv.config();

const cloudinary = cloudinaryService.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

if (!cloudinary) {
  throw new Error("Unable to connect to cloudinary");
}
console.log(`[+] cloudinary connected successfully`);
export default cloudinary;

import cloudinary from "../config/cloudinary";
import ProductModel from "../models/product.model";
import asyncWrapper from "../middlewares/asyncWrapper";
import { NextFunction, Request, Response } from "express";
import {
  findProducts,
  findProductsFeatured,
  getFeaturedProductsCached,
  setFeaturedProductsCached,
} from "../services/product.service";

export const getAllProducts = asyncWrapper(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const products = await findProducts();
      res.json({ products });
    } catch (error) {
      return next(error);
    }
  }
);

export const getFeaturedProducts = asyncWrapper(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      let featuredProducts: any = await getFeaturedProductsCached();
      if (featuredProducts) {
        return res.status(200).json(JSON.parse(featuredProducts));
      }

      // if not in redis, fetch from mongodb
      featuredProducts = await findProductsFeatured();

      if (!featuredProducts) {
        return res.status(404).json({ message: "No featured products found" });
      }

      // store in redis for future quick access

      await setFeaturedProductsCached(JSON.stringify(featuredProducts));

      res.json(featuredProducts);
    } catch (error) {
      return next(error);
    }
  }
);

export const createProduct = asyncWrapper(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { name, description, price, image, category } = req.body;

      let cloudinaryResponse = null;

      if (image) {
        cloudinaryResponse = await cloudinary.uploader.upload(image, {
          folder: "products",
        });
      }

      const product = await ProductModel.create({
        name,
        description,
        price,
        image: cloudinaryResponse?.secure_url
          ? cloudinaryResponse.secure_url
          : "",
        category,
      });

      res.status(201).json(product);
    } catch (error) {
      return next(error);
    }
  }
);

export const deleteProduct = asyncWrapper(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const product = await ProductModel.findById(req.params.id);

      if (!product) {
        return res.status(404).json({ message: "ProductModel not found" });
      }

      if (product.image) {
        const publicId = product.image.split("/").pop()?.split(".")[0];
        try {
          await cloudinary.uploader.destroy(`products/${publicId}`);
          console.log("deleted image from cloduinary");
        } catch (error) {
          console.log("error deleting image from cloduinary", error);
        }
      }

      await ProductModel.findByIdAndDelete(req.params.id);

      res.json({ message: "ProductModel deleted successfully" });
    } catch (error) {
      return next(error);
    }
  }
);

export const getRecommendedProducts = asyncWrapper(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const products = await ProductModel.aggregate([
        {
          $sample: { size: 4 },
        },
        {
          $project: {
            _id: 1,
            name: 1,
            description: 1,
            image: 1,
            price: 1,
          },
        },
      ]);

      res.json(products);
    } catch (error) {
      return next(error);
    }
  }
);

export const getProductsByCategory = asyncWrapper(
  async (req: Request, res: Response, next: NextFunction) => {
    const { category } = req.params;
    try {
      const products = await ProductModel.find({ category });
      res.json({ products });
    } catch (error) {
      return next(error);
    }
  }
);

export const toggleFeaturedProduct = asyncWrapper(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const product = await ProductModel.findById(req.params.id);
      if (product) {
        product.isFeatured = !product.isFeatured;
        const updatedProduct = await product.save();
        await updateFeaturedProductsCache();
        res.json(updatedProduct);
      } else {
        res.status(404).json({ message: "ProductModel not found" });
      }
    } catch (error) {
      return next(error);
    }
  }
);

async function updateFeaturedProductsCache() {
  try {
    // The lean() method  is used to return plain JavaScript objects instead of full Mongoose documents. This can significantly improve performance

    const featuredProducts = await ProductModel.find({
      isFeatured: true,
    }).lean();
    await getFeaturedProductsCached();
  } catch (error) {
    console.log("Error:", error);
  }
}

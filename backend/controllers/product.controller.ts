import cloudinary from "../config/cloudinary";
import ProductModel from "../models/product.model";
import asyncWrapper from "../middlewares/asyncWrapper";
import { NextFunction, Request, Response } from "express";
import {
  createProduct,
  findProducts,
  findProductsFeatured,
  getFeaturedProductsCached,
  setFeaturedProductsCached,
} from "../services/product.service";
import { CreateProductDto } from "backend/dtos/product.dto";

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
      let products: any = await getFeaturedProductsCached();
      if (products) {
        return res.status(200).json({ products: JSON.parse(products) });
      }

      // if not in redis, fetch from mongodb
      products = await findProductsFeatured();

      if (!products) {
        return res.status(404).json({ message: "No featured products found" });
      }

      // store in redis for future quick access
      await setFeaturedProductsCached(JSON.stringify(products));

      res.json({ products });
    } catch (error) {
      return next(error);
    }
  }
);

export const createNewProduct = asyncWrapper(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { name, description, price, image, category } =
        req.body as CreateProductDto;

      console.log(name, description, price, image, category);

      // let cloudinaryResponse = null;

      // if (image) {
      //   cloudinaryResponse = await cloudinary.uploader.upload(image, {
      //     folder: "products",
      //   });
      // }
      // cloudinaryResponse?.secure_url
      //     ? cloudinaryResponse.secure_url
      //     : ""

      const product = await createProduct(req.body);
      // await updateFeaturedProductsCache();
      // await setFeaturedProductsCached(JSON.stringify(product));

      return res.status(201).json({ product });
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

      res.json({ products });
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

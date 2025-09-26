import cloudinary from "../config/cloudinary";
import ProductModel from "../models/product.model";
import asyncWrapper from "../middlewares/asyncWrapper";
import { NextFunction, Request, Response } from "express";
import {
  createProduct,
  findProductByCategory,
  findProductById,
  findProducts,
  findProductsFeatured,
  getFeaturedProductsCached,
  removeProduct,
  setFeaturedProductsCached,
  updateProduct,
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
      let products: any = JSON.parse(
        (await getFeaturedProductsCached()) as string
      );
      if (products.length > 0) {
        return res.status(200).json({ products });
      }

      // if not in redis, fetch from mongodb
      products = await findProductsFeatured();

      if (!products) {
        return res.status(404).json({ message: "No featured products found" });
      }

      // store in redis for future quick access
      await setFeaturedProductsCached(JSON.stringify(products));

      return res.status(200).json({ products });
    } catch (error) {
      return next(error);
    }
  }
);

export const createNewProduct = asyncWrapper(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { name, description, price, image, category, isFeatured } =
        req.body as CreateProductDto;
      console.log(image);

      let cloudinaryResponse = null;

      if (image) {
        cloudinaryResponse = await cloudinary.uploader.upload(image, {
          folder: "products",
        });
      }
      const imageUrl = cloudinaryResponse?.secure_url || "";

      const product = await createProduct({
        name,
        description,
        price,
        image: imageUrl,
        category,
        isFeatured,
      });
      await updateFeaturedProductsCache();

      return res.status(201).json({ product });
    } catch (error) {
      return next(error);
    }
  }
);

export const deleteProduct = asyncWrapper(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const product = await findProductById(req.params.id);

      if (!product) {
        return res.status(404).json({ message: "ProductModel not found" });
      }

      console.log(product);

      if (product.image) {
        const publicId = product.image.split("/").pop()?.split(".")[0];
        try {
          await cloudinary.uploader.destroy(`products/${publicId}`);
          console.log("deleted image from cloduinary");
        } catch (error) {
          console.log("error deleting image from cloduinary", error);
        }
      }

      await removeProduct(req.params.id);
      await updateFeaturedProductsCache();
      return res.status(200).json({ message: "Product deleted successfully" });
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
      const products = await findProductByCategory(category);
      return res.status(200).json({ products });
    } catch (error) {
      return next(error);
    }
  }
);

export const toggleFeaturedProduct = asyncWrapper(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const product = await findProductById(req.params.id);
      if (product) {
        product.isFeatured = !product.isFeatured;
        const updatedProduct = await updateProduct(req.params.id, product);
        await updateFeaturedProductsCache();
        return res.status(200).json({ updatedProduct });
      } else {
        return res.status(404).json({ message: "ProductModel not found" });
      }
    } catch (error) {
      return next(error);
    }
  }
);

async function updateFeaturedProductsCache() {
  try {
    const featuredProducts = await findProductsFeatured();
    await setFeaturedProductsCached(JSON.stringify(featuredProducts));
  } catch (error) {
    console.log("Error:", error);
  }
}

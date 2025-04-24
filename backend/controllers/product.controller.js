import { AppError } from "../lib/appError.js";
import { catchAsync } from "../lib/catchAsync.js";
import { redis } from "../lib/redis.js";
import Product from "../models/product.model.js";

export const getAllProducts = catchAsync(async (req, res) => {
  const products = await Product.find({});
  res.status(200).json({
    success: true,
    message: "Products fetched successfully",
    products,
  });
});

export const getFeaturedProducts = catchAsync(async (req, res) => {
  const cached = await redis.get("featured_products");
  if (cached) {
    res.status(200).json({
      success: true,
      message: "Featured Products fetched successfully (from cache)",
      products: JSON.parse(cached),
    });
  }
  const featured_products = await Product.find({ isFeatured: true }).lean();
  if (!featured_products || featured_products.length === 0)
    throw new AppError("No featured products found", 404);

  await redis.set("featured_products", JSON.stringify(featured_products));
  res.status(200).json({
    success: true,
    message: "Featured Products fetched successfully",
    products: JSON.parse(featured_products),
  });
});

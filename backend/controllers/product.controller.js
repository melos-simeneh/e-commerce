import { catchAsync } from "../lib/catchAsync.js";
import Product from "../models/product.model.js";

export const getAllProducts = catchAsync(async (req, res) => {
  const products = await Product.find({});
  res
    .status(200)
    .json({
      success: true,
      message: "Products fetched successfully",
      products,
    });
});

import { AppError } from "../lib/appError.js";
import { catchAsync } from "../lib/catchAsync.js";
import cloudinary from "../lib/cloudinary.js";
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

export const createProduct = catchAsync(async (req, res) => {
  const { name, description, price, image, category } = req.body;
  let imageUrl = null;
  if (image) {
    const cloudinaryResponse = await cloudinary.uploader.upload(image, {
      folder: "products",
    });
    imageUrl = cloudinaryResponse.secure_url;
  }
  const product = await Product.create({
    name,
    description,
    price,
    image: imageUrl,
    category,
  });
  res
    .status(201)
    .json({ success: true, message: "Product created successfully", product });
});

export const deleteProduct = catchAsync(async (req, res) => {
  const { id } = req.params;
  const product = await Product.findById(id);
  if (!product) throw new AppError("Product not found", 404);

  if (product.image) {
    const publicId = product.image.split("/").pop().split(".")[0];
    await cloudinary.uploader.destroy(`products/${publicId}`);
  }
  await Product.findByIdAndDelete(id);

  res
    .status(200)
    .json({ success: true, message: "Product deleted successfully" });
});

export const getRecommendedProducts = catchAsync(async (req, res) => {
  const products = await Product.aggregate([
    { $sample: { size: 3 } },
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

  res.status(200).json({
    success: true,
    message: "Products fetched for recommendation successfully",
    products,
  });
});

export const getProductsByCategory = catchAsync(async (req, res) => {
  const { category } = req.params;
  const products = await Product.find({ category });
  res.status(200).json({
    success: true,
    message: "Products fetched by category successfully",
    products,
  });
});

export const toggleFeaturedProduct = catchAsync(async (req, res) => {
  const { id } = req.params;
  const product = await Product.findById(id);
  if (!product) throw new AppError("Product not found", 404);

  product.isFeatured = !product.isFeatured;
  const updatedProduct = await product.save();
  await updateFeaturedProductsCache();
  res.status(200).json({
    success: true,
    message: "Products toggled successfully",
    product: updatedProduct,
  });
});

const updateFeaturedProductsCache = async () => {
  const featuredProducts = await Product.find({ isFeatured: true }).lean();
  await redis.set("featured_products", JSON.stringify(featuredProducts));
};

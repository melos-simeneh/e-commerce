import { AppError } from "../lib/appError.js";
import { catchAsync } from "../lib/catchAsync.js";
import Product from "../models/product.model.js";

export const getCartProducts = catchAsync(async (req, res) => {
  const products = await Product.find({ _id: { $in: req.user.cartItems } });
  const cartItems = products.map((product) => {
    const item = req.use.cartItems.find(
      (cartItem) => cartItem.id == product.id
    );
    return { ...product.toJSON(), quantity: item.quantity };
  });

  res.status(200).json({
    success: true,
    message: "Cart Products fetched successfully",
    cartItems,
  });
});

export const addToCart = catchAsync(async (req, res) => {
  const { productId } = req.body;
  const user = req.user;
  const existingItem = user.cartItems.find((item) => item.id == productId);
  if (existingItem) {
    existingItem.quantity += 1;
  } else {
    user.cartItems.push(productId);
  }
  await user.save();

  res
    .status(201)
    .json({ success: true, message: "Cart Added", cartItems: user.cartItems });
});

export const removeAllFromCart = catchAsync(async (req, res) => {
  const { productId } = req.body;
  const user = req.user;
  if (!productId) {
    user.cartItems = [];
  } else {
    user.cartItems = user.cartItems.filter((item) => item.id != productId);
  }

  await user.save();
  res
    .status(200)
    .json({
      success: true,
      message: "Cart removed",
      cartItems: user.cartItems,
    });
});

export const updateQuantity = catchAsync(async (req, res) => {
  const { id: productId } = req.params;
  const { quantity } = req.body;
  const user = req.user;
  const existingItem = user.cartItems.find((item) => item.id == productId);

  if (!existingItem) throw new AppError("Product not found", 404);

  if (quantity === 0) {
    user.cartItems = user.cartItems.find((item) => item.id != productId);
    await user.save();
    res.status(200).json({
      success: true,
      message: "Cart updated",
      cartItems: user.cartItems,
    });
  }

  existingItem.quantity = quantity;
  await user.save();
  res.status(200).json({
    success: true,
    message: "Cart updated",
    cartItems: user.cartItems,
  });
});

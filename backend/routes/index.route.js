import express from "express";
import authRoutes from "./auth.route.js";
import productRoutes from "./product.route.js";
import cartRoutes from "./cart.route.js";
import couponRoutes from "./coupon.route.js";
import paymentRoutes from "./payment.route.js";

const router = express.Router();

router.use("/auth", authRoutes);
router.use("/products", productRoutes);
router.use("/cart", cartRoutes);
router.use("/coupons", couponRoutes);
router.use("/payments", paymentRoutes);

export default router;

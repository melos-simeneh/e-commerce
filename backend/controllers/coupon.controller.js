import { AppError } from "../lib/appError.js";
import { catchAsync } from "../lib/catchAsync.js";
import Coupon from "../models/coupon.model";

export const getCoupon = catchAsync(async (req, res) => {
  const coupon = await Coupon.findOne({ userId: req.user._id, isActive: true });
  res.json({ success: true, message: "Coupon found", coupon });
});

export const validateCoupon = catchAsync(async (req, res) => {
  const { code } = req.body;
  const coupon = await Coupon.findOne({
    code,
    userId: req.user._id,
    isActive: true,
  });

  if (!coupon) throw new AppError("Coupon not found", 404);

  if (coupon.expirationDate < new Date()) {
    coupon.isActive = false;
    await coupon.save();
    throw new AppError("Coupon is expired", 400);
  }
  res.json({
    success: true,
    message: "Coupon is valid",
    coupon: {
      code: coupon.code,
      discountPercentage: coupon.discountPercentage,
    },
  });
});

import { Router } from "express";
import { protectRoute } from "../middlewares/auth.middleware";
import { validateCoupon } from "../controllers/coupon.controller";

const router = Router();

router.get("/", protectRoute, getCoupon);
router.post("/", protectRoute, validateCoupon);

export default router;

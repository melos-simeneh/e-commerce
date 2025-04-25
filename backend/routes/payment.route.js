import { Router } from "express";
import { protectRoute } from "../middlewares/auth.middleware.js";
import {
  checkoutSession,
  createCheckoutSession,
} from "../controllers/payment.controller.js";

const router = Router();

router.post("/create-checkout-session", protectRoute, createCheckoutSession);
router.post("/checkout-success", protectRoute, checkoutSession);

export default router;

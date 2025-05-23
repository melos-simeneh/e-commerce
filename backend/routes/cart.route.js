import { Router } from "express";
import {
  addToCart,
  getCartProducts,
  removeAllFromCart,
  updateQuantity,
} from "../controllers/cart.controller.js";
import { protectRoute } from "../middlewares/auth.middleware.js";

const router = Router();

router.get("/", protectRoute, getCartProducts);
router.post("/", protectRoute, addToCart);
router.delete("/", protectRoute, removeAllFromCart);
router.put("/", protectRoute, updateQuantity);

export default router;

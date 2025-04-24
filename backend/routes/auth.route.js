import { Router } from "express";
import {
  login,
  logout,
  refreshToken,
  signup,
} from "../controllers/auth.controller.js";
import { validateLoginBody } from "../middlewares/validation.middleware.js";

const router = Router();

router.post("/signup", signup);
router.post("/login", validateLoginBody, login);
router.post("/logout", logout);
router.post("/refresh-token", refreshToken);

export default router;

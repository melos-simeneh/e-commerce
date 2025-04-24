import jwt from "jsonwebtoken";
import User from "../models/user.model.js";
import { AppError } from "../lib/appError.js";

export const protectRoute = async (req, res, next) => {
  const accessToken = req.cookies.accessToken;

  if (!accessToken) {
    return next(new AppError("Unauthorized - No access token provided", 401));
  }

  try {
    const decoded = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET);

    const user = await User.findById(decoded.userId);

    if (!user) {
      return next(new AppError("User not found", 401));
    }

    req.user = user;
    next();
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return next(new AppError("Unauthorized - Access token expired", 401));
    }

    return next(new AppError("Unauthorized - Invalid access token", 401));
  }
};

export const adminRoute = (req, res, next) => {
  if (!(req.user && req.user.role === "admin")) {
    return next(new AppError("Access denied - Admins only", 403));
  }

  next();
};

import mongoose from "mongoose";
import { AppError } from "./appError.js";

export const globalErrorHandler = (err, req, res, next) => {
  const isDev = process.env.NODE_ENV === "development";

  let statusCode = 500;
  let message = "Internal Server Error";
  let extra = {};

  if (err instanceof mongoose.Error.ValidationError) {
    statusCode = 400;
    message = "Validation Error";
    extra.errors = Object.values(err.errors).map((e) => e.message);
  } else if (err instanceof AppError) {
    statusCode = err.statusCode || 500;
    message = err.message;
  } else {
    message = err.message || message;
  }

  if (isDev) {
    extra.stack = err.stack;
  }

  res.status(statusCode).json({
    success: false,
    message,
    ...extra,
  });
};

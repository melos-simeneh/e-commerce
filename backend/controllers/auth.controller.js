import { AppError } from "../lib/appError.js";
import { catchAsync } from "../lib/catchAsync.js";
import User from "../models/user.model.js";

export const signup = catchAsync(async (req, res, next) => {
  const { name, email, password } = req.body || {};

  const userExists = await User.findOne({
    email: email.toLowerCase().trim(),
  });

  if (userExists) {
    throw new AppError("Email already exists", 400);
  }

  const user = await User.create({ name, email, password });

  res.status(201).json({
    success: true,
    message: "User created successfully",
    user: { ...user.toJSON(), password: undefined },
  });
});

export const login = async (req, res) => {
  res.status(200).json({ success: true, message: "login" });
};

export const logout = async (req, res) => {
  res.status(200).json({ success: true, message: "logout" });
};

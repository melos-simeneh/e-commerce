import mongoose from "mongoose";
import User from "../models/user.model.js";

export const signup = async (req, res, next) => {
  try {
    const { name, email, password } = req.body || {};
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res
        .status(400)
        .json({ success: false, message: "Email already exists" });
    }
    const user = await User.create({ name, email, password });

    res
      .status(200)
      .json({ success: true, message: "User created successfully", user });
  } catch (error) {
    next(error);
  }
};

export const login = async (req, res) => {
  res.status(200).json({ success: true, message: "login" });
};

export const logout = async (req, res) => {
  res.status(200).json({ success: true, message: "logout" });
};

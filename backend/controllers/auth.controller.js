import { AppError } from "../lib/appError.js";
import { catchAsync } from "../lib/catchAsync.js";
import { generateTokens, verifyRefreshToken } from "../lib/jwt.js";
import { redis } from "../lib/redis.js";
import User from "../models/user.model.js";

const cookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "strict",
};

const setCookies = (res, accessToken, refreshToken) => {
  res.cookie("accessToken", accessToken, {
    ...cookieOptions,
    maxAge: 15 * 60 * 1000, // 15 minutes
  });

  res.cookie("refreshToken", refreshToken, {
    ...cookieOptions,
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  });
};

const storeRefreshToken = async (userId, refreshToken) => {
  await redis.setex(`refresh_token:${userId}`, 7 * 24 * 60 * 60, refreshToken); // 7 days
};

export const signup = catchAsync(async (req, res) => {
  const { name, email, password } = req.body;

  const userExists = await User.findOne({
    email: email?.toLowerCase()?.trim(),
  });
  if (userExists) throw new AppError("Email already exists", 400);

  const user = await User.create({ name, email, password });

  const { access_token, refresh_token } = generateTokens(user._id);

  await storeRefreshToken(user._id, refresh_token);
  setCookies(res, access_token, refresh_token);

  res.status(201).json({
    success: true,
    message: "User created successfully",
    user: {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
  });
});

export const login = catchAsync(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email: email.toLowerCase() }).select(
    "+password"
  );
  if (!user || !(await user.comparePassword(password))) {
    throw new AppError("Incorrect email or password", 401);
  }
  const { access_token, refresh_token } = generateTokens(user._id);

  await storeRefreshToken(user._id, refresh_token);
  setCookies(res, access_token, refresh_token);

  res.status(200).json({
    success: true,
    message: "Logged in successfully",
    user: {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
  });
});

export const logout = catchAsync(async (req, res) => {
  const refreshToken = req.cookies?.refreshToken;

  if (refreshToken) {
    const decoded = verifyRefreshToken(refreshToken);
    await redis.del(`refresh_token:${decoded.userId}`);
  }

  res.clearCookie("accessToken");
  res.clearCookie("refreshToken");

  res.status(200).json({ success: true, message: "Logged out successfully" });
});

export const refreshToken = catchAsync(async (req, res) => {
  const refreshToken = req.cookies?.refreshToken;

  if (!refreshToken) {
    res.clearCookie("accessToken");
    res.clearCookie("refreshToken");
    throw new AppError("No refresh token provided", 401);
  }

  const decoded = verifyRefreshToken(refreshToken);
  const storedToken = await redis.get(`refresh_token:${decoded.userId}`);

  if (storedToken !== refreshToken) {
    res.clearCookie("accessToken");
    res.clearCookie("refreshToken");
    throw new AppError("Invalid refresh token", 401);
  }

  const { access_token } = generateTokens(decoded.userId);
  setCookies(res, access_token, refreshToken);

  res.json({ success: true, message: "Token refreshed successfully" });
});

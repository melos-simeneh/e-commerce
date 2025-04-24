import jwt from "jsonwebtoken";
export const generateTokens = (userId) => {
  const payload = { userId: userId.toString() };

  const access_token = jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: "15m",
  });
  const refresh_token = jwt.sign(payload, process.env.REFRESH_TOKEN_SECRET, {
    expiresIn: "7d",
  });

  return { access_token, refresh_token };
};

export const verifyRefreshToken = (refresh_token) => {
  try {
    return jwt.verify(refresh_token, process.env.REFRESH_TOKEN_SECRET);
  } catch (error) {
    if (error.name === "JsonWebTokenError") {
      throw new AppError("Invalid refresh token", 401);
    }
    if (error.name === "TokenExpiredError") {
      throw new AppError("Refresh token has expired", 401);
    }
    throw error;
  }
};

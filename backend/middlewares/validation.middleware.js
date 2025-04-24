import { loginBodyValidation } from "../validators/auth.validator.js";

export const validateLoginBody = (req, res, next) => {
  const { error } = loginBodyValidation(req.body);
  if (error) {
    return next(error);
  }
  next();
};

import Joi from "joi";

export const loginBodyValidation = (body = {}) => {
  const schema = Joi.object({
    email: Joi.string().trim().required(),
    password: Joi.string().required(),
  });
  return schema.validate(body, {
    abortEarly: false,
  });
};

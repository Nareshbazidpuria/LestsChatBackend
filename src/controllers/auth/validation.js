import { Joi } from "express-validation";

export const signUpValidation = {
  body: Joi.object({
    name: Joi.string().required().min(3).max(16),
    email: Joi.string().required(),
    userName: Joi.string()
      .required()
      .min(3)
      .max(16)
      .regex(/^(?![0-9_])[a-z0-9_]{3,30}$/)
      .messages({
        "string.pattern.base":
          '"Only lower case, underscore and numbers are allowed !"',
      }),
    password: Joi.string().required().min(8).max(30),
  }),
};

export const loginValidation = {
  body: Joi.object({
    userName: Joi.string().required(),
    password: Joi.string().required(),
  }),
};

export const forgotPasswordValidation = {
  body: Joi.object({
    userName: Joi.string().required(),
  }),
};

export const setPasswordValidation = {
  body: Joi.object({
    otp: Joi.string().required(),
    token: Joi.string().required(),
    password: Joi.string().required(),
  }),
};

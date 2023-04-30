import { Joi } from "express-validation";

export const updateProfileValidation = {
  body: Joi.object({
    name: Joi.string().optional().min(3).max(30),
    profilePic: Joi.string().optional(),
    email: Joi.string().optional(),
  }),
};

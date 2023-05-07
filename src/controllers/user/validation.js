import { Joi } from "express-validation";

export const getUsersValidation = {
  query: Joi.object({
    type: Joi.string().valid("friends"),
    name: Joi.string().allow(""),
    sortBy: Joi.string().allow(""),
    order: Joi.string().valid("1", "-1").allow(""),
    limit: Joi.number().positive().allow(""),
    page: Joi.number().positive().allow(""),
  }),
};

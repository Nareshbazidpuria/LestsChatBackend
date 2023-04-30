import { Joi } from "express-validation";

export const getUsersValidation = {
  query: Joi.object({
    name: Joi.string().allow(""),
    search: Joi.string().allow(""),
    searchField: Joi.string().allow(""),
    sortBy: Joi.string().allow(""),
    order: Joi.string().valid("1", "-1").allow(""),
    limit: Joi.number().positive().allow(""),
    page: Joi.number().positive().allow(""),
  }),
};

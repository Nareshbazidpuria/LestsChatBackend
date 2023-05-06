import { Joi } from "express-validation";

export const sendMsgValidation = {
  body: Joi.object({
    message: Joi.string().required(),
  }),
};

export const readMsgValidation = {
  body: Joi.object({
    sortBy: Joi.string().allow(""),
    order: Joi.string().valid("1", "-1").allow(""),
    limit: Joi.number().positive().allow(""),
    page: Joi.number().positive().allow(""),
  }),
};

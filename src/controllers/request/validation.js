import { Joi } from "express-validation";

export const sendReqValidation = {
  body: Joi.object({
    to: Joi.string().required(),
  }),
};

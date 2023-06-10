import { Joi } from "express-validation";
import { EMOJI_TYPE, SHOW_PROFILE_PIC } from "../../../config/constant";

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

export const setPreferenceValidation = {
  body: Joi.object({
    preferences: Joi.object({
      darkMode: Joi.boolean().required(),
      showEmail: Joi.boolean().required(),
      showProfilePic: Joi.string()
        .required()
        .valid(...Object.values(SHOW_PROFILE_PIC)),
      emoji: Joi.string()
        .required()
        .valid(...Object.values(EMOJI_TYPE)),
    }).required(),
  }),
};

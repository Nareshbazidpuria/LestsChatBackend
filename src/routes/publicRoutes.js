import { Router } from "express";
import { validate } from "express-validation";
import {
  forgotPassword,
  login,
  setPassword,
  signUp,
} from "../controllers/auth/controller";
import {
  forgotPasswordValidation,
  loginValidation,
  setPasswordValidation,
  signUpValidation,
} from "../controllers/auth/validation";

export const publicRouter = Router();

publicRouter.post("/signup", validate(signUpValidation), signUp);
publicRouter.post("/login", validate(loginValidation), login);
publicRouter.post(
  "/forgot-password",
  validate(forgotPasswordValidation),
  forgotPassword
);
publicRouter.post(
  "/set-password",
  validate(setPasswordValidation),
  setPassword
);

import { Router } from "express";
import { changePassword, deleteAccount, logout } from "./controller";
import { validate } from "express-validation";
import { changePasswordValidation } from "./validation";

export const authRouter = Router();

authRouter.post("/logout", logout);
authRouter.post(
  "/change-password",
  validate(changePasswordValidation),
  changePassword
);
authRouter.delete("/account", deleteAccount);

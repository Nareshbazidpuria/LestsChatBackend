import { Router } from "express";
import { getAllUsers, getUser, setPreferences, unfriend } from "./controller";
import { validate } from "express-validation";
import { getUsersValidation, setPreferenceValidation } from "./validation";

export const userRouter = Router();

userRouter.get("/", validate(getUsersValidation), getAllUsers);
userRouter.put(
  "/preferences",
  validate(setPreferenceValidation),
  setPreferences
);
userRouter.get("/:id", validate(getUsersValidation), getUser);
userRouter.put("/:id", unfriend);

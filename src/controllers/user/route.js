import { Router } from "express";
import { getAllUsers } from "./controller";
import { validate } from "express-validation";
import { getUsersValidation } from "./validation";

export const userRouter = Router();

userRouter.get("/", validate(getUsersValidation), getAllUsers);

import { Router } from "express";
import { getProfile, updateProfile } from "./controller";
import { validate } from "express-validation";
import { updateProfileValidation } from "./validation";

export const profileRouter = Router();

profileRouter.get("/", getProfile);
profileRouter.put("/", validate(updateProfileValidation), updateProfile);

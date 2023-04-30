import { Router } from "express";
import { getProfile } from "./controller";

export const profileRouter = Router()

profileRouter.get('/', getProfile)
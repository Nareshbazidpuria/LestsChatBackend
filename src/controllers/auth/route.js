import { Router } from "express";
import { logout } from "./controller";

export const authRouter = Router()

authRouter.post('/logout', logout)
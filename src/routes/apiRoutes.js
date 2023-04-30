import { Router } from "express";
import { authRouter } from "../controllers/auth/route";
import { profileRouter } from "../controllers/profile/route";
import { userRouter } from "../controllers/user/route";
import { genericRouter } from "../controllers/generic/route";

export const apiRouter = Router();

apiRouter.use("/auth", authRouter);
apiRouter.use("/profile", profileRouter);
apiRouter.use("/user", userRouter);
apiRouter.use("/generic", genericRouter);

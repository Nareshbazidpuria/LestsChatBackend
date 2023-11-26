import { Router } from "express";
import { authRouter } from "../controllers/auth/route";
import { profileRouter } from "../controllers/profile/route";
import { userRouter } from "../controllers/user/route";
import { genericRouter } from "../controllers/generic/route";
import { reqRouter } from "../controllers/request/route";
import { msgRouter } from "../controllers/message/route";
import { storyRouter } from "../controllers/story/route";

export const apiRouter = Router();

apiRouter.use("/auth", authRouter);
apiRouter.use("/profile", profileRouter);
apiRouter.use("/user", userRouter);
apiRouter.use("/generic", genericRouter);
apiRouter.use("/request", reqRouter);
apiRouter.use("/message", msgRouter);
apiRouter.use("/story", storyRouter);

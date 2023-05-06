import { Router } from "express";
import { readMsgs, sendMsg } from "./controller";
import { validate } from "express-validation";
import { readMsgValidation, sendMsgValidation } from "./validation";

export const msgRouter = Router();

msgRouter.post("/:roomId", validate(sendMsgValidation), sendMsg);
msgRouter.get("/:roomId", validate(readMsgValidation), readMsgs);

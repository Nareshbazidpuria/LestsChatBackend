import { Router } from "express";
import { confirmRequest, sendRequest } from "./controller";
import { validate } from "express-validation";
import { sendReqValidation } from "./validation";

export const reqRouter = Router();

reqRouter.post("/", validate(sendReqValidation), sendRequest);
reqRouter.put("/:id", confirmRequest);

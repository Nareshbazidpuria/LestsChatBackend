import { Router } from "express";
import {
  confirmRequest,
  getRequests,
  rejectRequest,
  scanQr,
  sendRequest,
} from "./controller";
import { validate } from "express-validation";
import { sendReqValidation } from "./validation";
import { getUsersValidation } from "../user/validation";

export const reqRouter = Router();

reqRouter.post("/", validate(sendReqValidation), sendRequest);
reqRouter.post("/scan", validate(sendReqValidation), scanQr);
reqRouter.get("/", validate(getUsersValidation), getRequests);
reqRouter.put("/:id", confirmRequest);
reqRouter.delete("/:id", rejectRequest);

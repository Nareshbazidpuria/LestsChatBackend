import { Router } from "express";
import { uploadFile } from "./controller";
import { upload } from "../../utils/multer";

export const genericRouter = Router();

genericRouter.post("/upload", upload.single("image"), uploadFile);

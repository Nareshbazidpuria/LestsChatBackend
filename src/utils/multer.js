import multer from "multer";
import path from "path";
import { fileUploadConfig } from "../../config/constant";

const storageEngine = multer.diskStorage({
  destination: "./public/images",
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const checkFileType = function (file, cb) {
  console.log(file);
  const fileTypes = fileUploadConfig.FILE_TYPES; //check extension names
  const extName = fileTypes.test(path.extname(file.originalname).toLowerCase());
  const mimeType = fileTypes.test(file.mimetype);
  if (mimeType && extName) {
    return cb(null, true);
  } else {
    cb("MulterError: You can Only Upload Images!!");
  }
};

export const upload = multer({
  storage: storageEngine,
  limits: { fileSize: fileUploadConfig.FILE_SIZE },
  // fileFilter: (req, file, cb) => {
  //   checkFileType(file, cb);
  // },
});

import { responseCode, responseMessage } from "../../../config/constant";
import { responseMethod } from "../../utils/common";

export const uploadFile = async (req, res) => {
  try {
    if (req?.file) {
      req.file.path = req.file.path?.replace("public", "");
      return responseMethod(
        res,
        responseCode.OK,
        responseMessage.FILE_UPLOADED,
        true,
        { src: req.file.path }
      );
    }
    return responseMethod(
      res,
      responseCode.BAD_REQUEST,
      responseMessage.FILE_NOT_FOUND,
      false,
      {}
    );
  } catch (error) {
    console.log(error);
    return responseMethod(
      res,
      responseCode.INTERNAL_SERVER_ERROR,
      responseMessage.INTERNAL_SERVER_ERROR,
      false,
      {}
    );
  }
};

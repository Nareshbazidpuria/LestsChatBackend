import { responseCode, responseMessage } from "../../../config/constant";
import { responseMethod } from "../../utils/common";
import { getUserService, updateUserService } from "../user/service";

export const getProfile = async (req, res) => {
  try {
    delete req.auth._doc.password;
    return responseMethod(
      res,
      responseCode.OK,
      responseMessage.PROFILE_GET_SUCCESS,
      true,
      req.auth
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

export const updateProfile = async (req, res) => {
  try {
    const user = await updateUserService({ _id: req.auth._id }, req.body);
    if (user) {
      delete user._doc.password;
      return responseMethod(
        res,
        responseCode.OK,
        responseMessage.PROFILE_UPDATED_SUCCESS,
        true,
        user
      );
    }
    return responseMethod(
      res,
      responseCode.BAD_REQUEST,
      responseMessage.BAD_REQUEST,
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

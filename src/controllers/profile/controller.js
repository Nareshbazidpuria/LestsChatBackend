import { responseCode, responseMessage } from "../../../config/constant";
import { responseMethod } from "../../utils/common";
import { getUserService } from "../user/service";

export const getProfile = async (req, res) => {
  try {
    const user = await getUserService({ _id: req.auth._id });
    if (!user) {
      return responseMethod(
        res,
        responseCode.BAD_REQUEST,
        responseMessage.USER_NOT_FOUND,
        false,
        {}
      );
    }
    delete user._doc.password;
    return responseMethod(
      res,
      responseCode.OK,
      responseMessage.PROFILE_GET_SUCCESS,
      true,
      user
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

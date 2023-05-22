import { responseCode, responseMessage } from "../../../config/constant";
import {
  getDefaultPagination,
  getSearchParams,
  responseMethod,
} from "../../utils/common";
import {
  getAllUsersService,
  getFriendsService,
  getUserService,
} from "./service";

export const getAllUsers = async (req, res) => {
  try {
    const { limit, skip, sort } = getDefaultPagination(req?.query);
    const search = getSearchParams(req?.query);
    let users;
    if (req?.query?.type === "friends") {
      users = await getFriendsService(limit, skip, sort, req.auth, search);
    } else {
      users = await getAllUsersService(limit, skip, sort, req.auth, search);
    }
    if (users[0]?.data?.length) {
      return responseMethod(
        res,
        responseCode.OK,
        responseMessage.USERS,
        true,
        users[0]
      );
    }
    return responseMethod(
      res,
      responseCode.NOT_FOUND,
      responseMessage.NOT_FOUND,
      true,
      users[0] || {}
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

export const getUser = async (req, res) => {
  try {
    if (user) {
      delete user?._doc?.password;
      user._doc.friends = user._doc.friends?.length;
      return responseMethod(
        res,
        responseCode.OK,
        responseMessage.PROFILE_GET_SUCCESS,
        true,
        user
      );
    }
    return responseMethod(
      res,
      responseCode.NOT_FOUND,
      responseMessage.NOT_FOUND,
      true,
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

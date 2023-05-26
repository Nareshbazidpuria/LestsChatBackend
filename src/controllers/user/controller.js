import { responseCode, responseMessage } from "../../../config/constant";
import { ObjectId } from "mongodb";
import {
  getDefaultPagination,
  getSearchParams,
  responseMethod,
} from "../../utils/common";
import {
  getAllUsersService,
  getFriendsService,
  getUserInfoService,
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
    let user = await getUserInfoService(
      { _id: ObjectId(req?.params?.id) },
      req.auth
    );
    if (user?.length) {
      return responseMethod(
        res,
        responseCode.OK,
        responseMessage.PROFILE_GET_SUCCESS,
        true,
        user[0]
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

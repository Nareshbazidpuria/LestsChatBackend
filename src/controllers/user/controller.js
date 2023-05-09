import { responseCode, responseMessage } from "../../../config/constant";
import {
  getDefaultPagination,
  getSearchParams,
  responseMethod,
} from "../../utils/common";
import { getAllUsersService } from "./service";

export const getAllUsers = async (req, res) => {
  try {
    const { limit, skip, sort } = getDefaultPagination(req?.query);
    const search = getSearchParams(req?.query);
    let users;
    if (req?.query?.type === "friends") {
      users = await getAllUsersService(limit, skip, sort, req.auth._id, {
        ...search,
        _id: { $in: req.auth.friends },
      });
    } else {
      users = await getAllUsersService(limit, skip, sort, req.auth._id, {
        ...search,
        $and: [
          { _id: { $ne: req.auth._id } },
          { _id: { $nin: req.auth.friends } },
        ],
      });
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

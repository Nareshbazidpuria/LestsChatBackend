import { responseCode, responseMessage } from "../../../config/constant";
import { getDefaultPagination, responseMethod } from "../../utils/common";
import { getMsgsService, readMsgsService, sendMsgService } from "./service";

export const sendMsg = async (req, res) => {
  try {
    const msg = {
      ...req.body,
      sentBy: req.auth._id,
      roomId: req.params.roomId,
    };
    const message = await sendMsgService(msg);
    if (message) {
      return responseMethod(
        res,
        responseCode.CREATED,
        responseMessage.MSG_SENT,
        true,
        {}
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

export const readMsgs = async (req, res) => {
  try {
    const { limit, skip } = getDefaultPagination(req?.query);
    const msgs = await getMsgsService(limit, skip, req.params.roomId);
    if (msgs[0]?.data?.length) {
      await readMsgsService(req.auth._id);
      return responseMethod(
        res,
        responseCode.OK,
        responseMessage.MSGS,
        true,
        msgs[0]
      );
    }
    return responseMethod(
      res,
      responseCode.NOT_FOUND,
      responseMessage.NOT_FOUND,
      true,
      msgs[0] || {}
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

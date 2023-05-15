import { responseCode, responseMessage } from "../../../config/constant";
import { getDefaultPagination, responseMethod } from "../../utils/common";
import { socketIo } from "../../utils/socket.io";
import { updateUserService } from "../user/service";
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
    if (!req?.params?.roomId) {
      return responseMethod(
        res,
        responseCode.BAD_REQUEST,
        responseMessage.BAD_REQUEST,
        false,
        {}
      );
    }
    const roomId = req.params.roomId.toString();
    if (req.auth.lastJoined) socketIo.leave(req.auth.lastJoined.toString());
    socketIo.join(roomId);
    await updateUserService({ _id: req.auth._id }, { lastJoined: roomId });
    if (roomId === "644d362526d8c8d7b063e6ca") {
      return responseMethod(
        res,
        responseCode.OK,
        responseMessage.MSGS,
        false,
        {}
      );
    }
    const { limit, skip } = getDefaultPagination(req?.query);
    const msgs = await getMsgsService(limit, skip, roomId, req.auth._id);
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

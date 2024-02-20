import { responseCode, responseMessage } from "../../../config/constant";
import {
  getDefaultPagination,
  getSearchParams,
  responseMethod,
} from "../../utils/common";
import { addFriendService, getUserService } from "../user/service";
import {
  confirmReqService,
  createRoomService,
  deleteReqService,
  getReqService,
  getReqsService,
  getRoomService,
  sendReqService,
} from "./service";

export const sendRequest = async (req, res) => {
  try {
    req.body.by = req.auth._id;
    const alreadySent = await getReqService(req.body);
    if (alreadySent) {
      return responseMethod(
        res,
        responseCode.BAD_REQUEST,
        responseMessage.REQ_ALREADY_SENT,
        false,
        {}
      );
    }
    const alreadyReceived = await getReqService({
      to: req.body.by,
      by: req.body.to,
    });
    if (alreadyReceived) {
      return responseMethod(
        res,
        responseCode.BAD_REQUEST,
        responseMessage.REQ_ALREADY_RECEIVED,
        false,
        {}
      );
    }
    const request = await sendReqService(req.body);
    if (request) {
      return responseMethod(
        res,
        responseCode.CREATED,
        responseMessage.REQ_SENT,
        true,
        request
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

export const getRequests = async (req, res) => {
  try {
    const { limit, skip, sort } = getDefaultPagination(req?.query);
    const search = getSearchParams(req?.query);
    const reqs = await getReqsService(limit, skip, sort, req.auth._id, search);
    if (reqs[0]?.data?.length) {
      return responseMethod(
        res,
        responseCode.OK,
        responseMessage.REQS,
        true,
        reqs[0]
      );
    }
    return responseMethod(
      res,
      responseCode.NOT_FOUND,
      responseMessage.NOT_FOUND,
      true,
      reqs[0] || {}
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

export const confirmRequest = async (req, res) => {
  try {
    const alreadyConfirmed = await getReqService({
      _id: req.params.id,
      confirmed: true,
    });
    if (alreadyConfirmed) {
      return responseMethod(
        res,
        responseCode.OK,
        responseMessage.REQ_ALREADY_ACCEPTED,
        true,
        {}
      );
    }
    const request = await confirmReqService(req.params.id);
    if (request) {
      await addFriendService(request.to, request.by);
      await addFriendService(request.by, request.to);
      await createRoomService({ members: [request.to, request.by] });
      return responseMethod(
        res,
        responseCode.OK,
        responseMessage.REQ_ACCEPTED,
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

export const rejectRequest = async (req, res) => {
  try {
    const rejected = await deleteReqService({ _id: req.params.id });
    if (rejected) {
      return responseMethod(
        res,
        responseCode.OK,
        req?.query?.type === "cancel"
          ? responseMessage.REQ_CANCELED
          : responseMessage.REQ_REJECTED,
        true,
        {}
      );
    }
    return responseMethod(
      res,
      responseCode.BAD_REQUEST,
      responseMessage.REQ_ALREADY_REJECTED,
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

export const scanQr = async (req, res) => {
  try {
    const by = req.auth._id,
      to = req.body.to;
    if (to?.toString() === by?.toString())
      return responseMethod(
        res,
        responseCode.BAD_REQUEST,
        "You cannot add yoursef",
        true
      );
    const alreadyFriends = await getRoomService({
      members: { $all: [to, by] },
    });
    if (alreadyFriends) {
      const friend = await getUserService({ _id: to });
      return responseMethod(
        res,
        responseCode.OK,
        "You are already friends",
        true,
        { ...friend?._doc, room: { _id: alreadyFriends?._id } }
      );
    }
    const [room] = await Promise.all([
      createRoomService({ members: [to, by] }),
      addFriendService(to, by),
      addFriendService(by, to),
    ]);
    if (room) {
      const friend = await getUserService({ _id: to });
      return responseMethod(res, responseCode.OK, "You are now friends", true, {
        ...friend?._doc,
        room: { _id: room?._id },
      });
    }
  } catch (error) {
    console.log(error);
    return responseMethod(
      res,
      responseCode.INTERNAL_SERVER_ERROR,
      responseMessage.INTERNAL_SERVER_ERROR
    );
  }
};

import { responseCode, responseMessage } from "../../../config/constant";
import {
  getDefaultPagination,
  getSearchParams,
  responseMethod,
} from "../../utils/common";
import { addFriendService } from "../user/service";
import {
  confirmReqService,
  createRoomService,
  getReqService,
  getReqsService,
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
    const request = await sendReqService(req.body);
    if (request) {
      return responseMethod(
        res,
        responseCode.CREATED,
        responseMessage.REQ_SENT,
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
    const sentByYou = await getReqService({ by: req.auth._id });
    if (sentByYou) {
      return responseMethod(
        res,
        responseCode.BAD_REQUEST,
        responseMessage.BAD_REQUEST,
        false,
        {}
      );
    }
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
import { Request } from "../../models/request";
import { Room } from "../../models/room";

export const sendReqService = (request) =>
  Request.findOneAndUpdate(
    { to: request.to, by: request.by },
    { $set: request },
    { upsert: true }
  );

export const confirmReqService = (_id) =>
  Request.findOneAndUpdate({ _id }, { confirmed: true }, { new: true });

export const getReqService = (filter) => Request.findOne(filter);

export const createRoomService = (room) => Room.create(room);

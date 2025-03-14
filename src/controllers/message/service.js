import { ObjectId } from "mongodb";
import { Message } from "../../models/message";
import { MESSAGE_TYPE } from "../../../config/constant";

export const sendMsgService = (msg) => Message.create(msg);

export const readMsgsService = (sentBy) =>
  Message.updateMany(
    { sentBy: { $ne: sentBy }, read: false },
    { read: true },
    { new: true }
  );

export const getMsgsService = (limit, skip, roomId, authId) =>
  Message.aggregate([
    {
      $match: {
        roomId: new ObjectId(roomId),
      },
    },
    {
      $sort: {
        createdAt: -1,
      },
    },
    {
      $addFields: {
        type: {
          $cond: [
            { $eq: ["$sentBy", authId] },
            MESSAGE_TYPE.OUTGOING,
            MESSAGE_TYPE.INCOMMING,
          ],
        },
      },
    },
    {
      $facet: {
        data: [
          {
            $skip: skip,
          },
          {
            $limit: limit,
          },
          {
            $sort: {
              createdAt: 1,
            },
          },
        ],
        totalRecords: [
          {
            $count: "count",
          },
        ],
      },
    },
    {
      $set: {
        totalRecords: {
          $ifNull: [{ $arrayElemAt: ["$totalRecords.count", 0] }, 0],
        },
      },
    },
  ]);

export const deleteAllMsgsService = (filter) => Message.deleteMany(filter);

import { ObjectId } from "mongodb";
import { Message } from "../../models/message";

export const sendMsgService = (msg) => Message.create(msg);

export const readMsgsService = (sentBy) =>
  Message.findOneAndUpdate(
    { sentBy: { $ne: sentBy }, read: false },
    { read: true },
    { new: true }
  );

export const getMsgsService = (limit, skip, roomId) =>
  Message.aggregate([
    {
      $match: {
        roomId: ObjectId(roomId),
      },
    },
    {
      $sort: {
        createdAt: -1,
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

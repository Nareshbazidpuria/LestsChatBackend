import { Request } from "../../models/request";
import { Room } from "../../models/room";

export const sendReqService = (request) => Request.create(request);

export const getReqService = (filter) => Request.findOne(filter);

export const createRoomService = (room) => Room.create(room);

export const confirmReqService = (_id) =>
  Request.findOneAndUpdate({ _id }, { confirmed: true }, { new: true });

export const getReqsService = (limit, skip, sort, authId, search) =>
  Request.aggregate([
    {
      $match: { to: authId, confirmed: false },
    },
    {
      $lookup: {
        from: "users",
        localField: "by",
        foreignField: "_id",
        as: "user",
      },
    },
    {
      $unwind: "$user",
    },
    {
      $project: {
        _id: "$user._id",
        name: "$user.name",
        userName: "$user.userName",
        profilePic: "$user.profilePic",
        requestId: "$_id",
      },
    },
    {
      $match: search,
    },
    {
      $sort: sort,
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

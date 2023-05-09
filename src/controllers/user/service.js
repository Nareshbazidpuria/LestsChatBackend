import { statusEnum } from "../../../config/constant";
import { User } from "../../models/user";

export const signUpService = (user) => User.create(user);

export const getUserService = (filter) =>
  User.findOne({ ...filter, status: statusEnum.ACTIVE });

export const updateUserService = (filter, user) =>
  User.findOneAndUpdate(filter, user, { new: true });

export const addFriendService = (_id, friendId) =>
  User.findOneAndUpdate(
    { _id },
    { $addToSet: { friends: friendId } },
    { new: true }
  );

export const getAllUsersService = (limit, skip, sort, authId, filter) =>
  User.aggregate([
    {
      $match: {
        ...filter,
        status: statusEnum.ACTIVE,
      },
    },
    {
      $lookup: {
        from: "requests",
        let: { id: "$_id" },
        pipeline: [
          {
            $match: {
              $expr: {
                $eq: ["$by", "$$id"],
              },
              to: authId,
            },
          },
          {
            $project: {
              _id: 1,
            },
          },
        ],
        as: "reqReceived",
      },
    },
    {
      $lookup: {
        from: "requests",
        let: { id: "$_id" },
        pipeline: [
          {
            $match: {
              $expr: {
                $eq: ["$to", "$$id"],
              },
              by: authId,
            },
          },
          {
            $project: {
              _id: 1,
            },
          },
        ],
        as: "reqSent",
      },
    },
    {
      $set: {
        reqReceived: {
          $arrayElemAt: ["$reqReceived", 0],
        },
        reqSent: {
          $arrayElemAt: ["$reqSent", 0],
        },
      },
    },
    {
      $unset: ["password", "__v", "friends"],
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

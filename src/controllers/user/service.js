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

export const getAllUsersService = (limit, skip, sort, filter) =>
  User.aggregate([
    {
      $match: {
        ...filter,
        status: statusEnum.ACTIVE,
      },
    },
    {
      $unset: ["password", "__v"],
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

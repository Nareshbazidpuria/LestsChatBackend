import { statusEnum } from "../../../config/constant";
import { User } from "../../models/user";

export const signUpService = (body) => {
  return User.create(body);
};

export const getUserService = (filter) => {
  return User.findOne({ ...filter, status: statusEnum.ACTIVE });
};

export const getAllUsersService = (limit, skip, sort, authId, search) => {
  return User.aggregate([
    {
      $match: {
        status: statusEnum.ACTIVE,
        _id: { $ne: authId },
        ...search,
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
};

export const updateUserService = (filter, body) => {
  return User.findOneAndUpdate(filter, body, { new: true });
};

import { MESSAGE_TYPE, statusEnum } from "../../../config/constant";
import { User } from "../../models/user";

export const signUpService = (user) => User.create(user);

export const getUserService = (filter) =>
  User.findOne({ ...filter, status: statusEnum.ACTIVE });

export const getUserInfoService = (filter, auth) =>
  User.aggregate([
    { $match: { ...filter, status: statusEnum.ACTIVE } },
    {
      $lookup: {
        from: "rooms",
        let: { id: "$_id" },
        pipeline: [
          {
            $match: {
              $and: [
                {
                  $expr: {
                    $in: ["$$id", "$members"],
                  },
                },
                {
                  $expr: {
                    $in: [auth._id, "$members"],
                  },
                },
              ],
            },
          },
          {
            $project: {
              _id: 1,
            },
          },
        ],
        as: "room",
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
              to: auth._id,
              confirmed: false,
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
              by: auth._id,
              confirmed: false,
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
        room: {
          $arrayElemAt: ["$room", 0],
        },
        friends: {
          $size: "$friends",
        },
      },
    },
    {
      $unset: ["password"],
    },
  ]);

export const updateUserService = (filter, user) =>
  User.findOneAndUpdate(filter, user, { new: true });

export const addFriendService = (_id, friendId) =>
  User.findOneAndUpdate(
    { _id },
    { $addToSet: { friends: friendId } },
    { new: true }
  );

export const getAllUsersService = (limit, skip, sort, auth, search) =>
  User.aggregate([
    {
      $match: {
        ...search,
        $and: [{ _id: { $ne: auth._id } }, { _id: { $nin: auth.friends } }],
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
              to: auth._id,
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
              by: auth._id,
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

export const getFriendsService = (limit, skip, sort, auth, search) =>
  User.aggregate([
    {
      $match: {
        ...search,
        _id: { $in: auth.friends },
        status: statusEnum.ACTIVE,
      },
    },
    {
      $lookup: {
        from: "rooms",
        let: { id: "$_id" },
        pipeline: [
          {
            $match: {
              $and: [
                {
                  $expr: {
                    $in: ["$$id", "$members"],
                  },
                },
                {
                  $expr: {
                    $in: [auth._id, "$members"],
                  },
                },
              ],
            },
          },
          {
            $project: {
              _id: 1,
            },
          },
          {
            $lookup: {
              from: "messages",
              let: { id: "$_id" },
              pipeline: [
                {
                  $match: {
                    $expr: {
                      $eq: ["$roomId", "$$id"],
                    },
                  },
                },
                {
                  $sort: {
                    createdAt: -1,
                  },
                },
                {
                  $limit: 1,
                },
                {
                  $project: {
                    createdAt: 1,
                    message: 1,
                    type: {
                      $cond: [
                        { $eq: ["$sentBy", auth._id] },
                        MESSAGE_TYPE.OUTGOING,
                        MESSAGE_TYPE.INCOMMING,
                      ],
                    },
                  },
                },
              ],
              as: "lastMessage",
            },
          },
          {
            $set: {
              lastMessage: {
                $arrayElemAt: ["$lastMessage", 0],
              },
            },
          },
        ],
        as: "room",
      },
    },
    {
      $set: {
        room: {
          $arrayElemAt: ["$room", 0],
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

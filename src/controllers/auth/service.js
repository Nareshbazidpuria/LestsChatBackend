import { Auth } from "../../models/auth";
import { Room } from "../../models/room";

export const userLoginService = (auth) => Auth.create(auth);

export const getAuthService = (filter) => Auth.findOne(filter);

export const logoutService = (filter) => Auth.findOneAndDelete(filter);

export const logoutAllService = (filter) => Auth.deleteMany(filter);

export const getExpoTokens = (filter, sentBy) =>
  Room.aggregate([
    {
      $match: filter,
    },
    {
      $lookup: {
        from: "auths",
        let: { ids: "$members" },
        pipeline: [
          {
            $match: {
              $expr: {
                $in: ["$userId", "$$ids"],
              },
              userId: {
                $ne: sentBy,
              },
              expoToken: {
                $exists: true,
              },
            },
          },
        ],
        as: "auth",
      },
    },
    {
      $unwind: "$auth",
    },
    {
      $group: {
        _id: null,
        tokens: {
          $addToSet: "$auth.expoToken",
        },
      },
    },
  ]);

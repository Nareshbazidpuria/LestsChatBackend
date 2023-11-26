import { Story } from "../../models/story";

export const addStoryDB = (story) => Story.create(story);

export const getStoryDB = (id) => Story.findById(id);

export const getStoryDetailsDB = (_id) =>
  Story.aggregate([
    {
      $match: {
        _id,
      },
    },
    {
      $lookup: {
        from: "users",
        let: { ids: "$viewedBy" },
        pipeline: [
          {
            $match: {
              $expr: {
                $in: ["$_id", "$$ids"],
              },
            },
          },
          {
            $project: {
              name: 1,
              _id: 0,
            },
          },
        ],
        as: "user",
      },
    },
    {
      $project: {
        counts: {
          $size: "$viewedBy",
        },
        image: 1,
        user: 1,
        _id: 0,
      },
    },
  ]);

export const viewStoryDB = (_id, userId) =>
  Story.findOneAndUpdate(
    { _id },
    { $addToSet: { viewedBy: userId } },
    { new: true }
  );

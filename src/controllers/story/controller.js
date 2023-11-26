import {
  addStoryDB,
  getStoryDB,
  getStoryDetailsDB,
  viewStoryDB,
} from "./service";

export const addStory = async (req, res) => {
  try {
    const added = await addStoryDB({ ...req.body, userId: req.auth._id });
    if (added) res.send("added");
  } catch (error) {
    res.send(error);
  }
};

export const viewStory = async (req, res) => {
  try {
    const story = await getStoryDB(req.params.id);
    if (!story) return res.send("story not found");
    if (story?.userId?.toString() === req.auth._id?.toString()) {
      const details = await getStoryDetailsDB(story._id);
      return res.send(details?.[0]);
    }
    const seen = await viewStoryDB(req.params.id, req.auth._id);
    if (seen) return res.send("seen");
  } catch (error) {
    console.log(error);
    res.send(error?.message);
  }
};

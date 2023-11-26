import { Schema, model } from "mongoose";
import { ObjectId } from "mongodb";

const schema = new Schema({
  image: String,
  userId: ObjectId,
  viewedBy: [ObjectId],
});

export const Story = model("stories", schema);

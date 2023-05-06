import { model, Schema } from "mongoose";
import { ObjectId } from "mongodb";

const room = new Schema(
  {
    members: {
      type: [ObjectId],
    },
  },
  { timestamps: true }
);

export const Room = model("rooms", room);

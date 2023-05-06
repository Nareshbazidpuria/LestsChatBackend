import { model, Schema } from "mongoose";
import { ObjectId } from "mongodb";

const message = new Schema(
  {
    roomId: {
      type: ObjectId,
    },
    sentBy: {
      type: ObjectId,
    },
    message: {
      type: String,
    },
    read: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

export const Message = model("messages", message);

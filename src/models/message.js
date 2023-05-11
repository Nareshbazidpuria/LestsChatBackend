import { model, Schema } from "mongoose";
import { ObjectId } from "mongodb";
import { CONTENT_TYPE } from "../../config/constant";

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
    contentType: {
      type: String,
      enum: Object.values(CONTENT_TYPE),
      default: CONTENT_TYPE.TEXT,
    },
    read: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

export const Message = model("messages", message);

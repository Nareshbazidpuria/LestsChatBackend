import { model, Schema } from "mongoose";
import { ObjectId } from "mongodb";

const request = new Schema(
  {
    to: {
      type: ObjectId,
    },
    by: {
      type: ObjectId,
    },
    confirmed: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

export const Request = model("requests", request);

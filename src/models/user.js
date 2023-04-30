import { model, Schema } from "mongoose";
import { ObjectId } from "mongodb";
import { statusEnum } from "../../config/constant";

const user = new Schema(
  {
    name: {
      type: String,
    },
    userName: {
      type: String,
    },
    password: {
      type: String,
    },
    profilePic: {
      type: String,
    },
    email: {
      type: String,
    },
    friends: {
      type: [ObjectId],
    },
    status: {
      type: String,
      default: statusEnum.ACTIVE,
      enum: Object.values(statusEnum),
    },
  },
  { timestamps: true }
);

export const User = model("users", user);

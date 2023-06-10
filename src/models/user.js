import { model, Schema } from "mongoose";
import { ObjectId } from "mongodb";
import {
  EMOJI_TYPE,
  SHOW_PROFILE_PIC,
  statusEnum,
} from "../../config/constant";

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
    room: {
      type: String,
    },
    friends: {
      type: [ObjectId],
    },
    lastJoined: {
      type: String,
    },
    status: {
      type: String,
      default: statusEnum.ACTIVE,
      enum: Object.values(statusEnum),
    },
    preferences: {
      type: new Schema(
        {
          darkMode: {
            type: Boolean,
            default: false,
          },
          showEmail: {
            type: Boolean,
            default: true,
          },
          showProfilePic: {
            type: String,
            default: SHOW_PROFILE_PIC.ALL,
            enum: Object.values(SHOW_PROFILE_PIC),
          },
          emoji: {
            type: String,
            default: EMOJI_TYPE.FACEBOOK,
            enum: Object.values(EMOJI_TYPE),
          },
        },
        {
          _id: false,
        }
      ),
    },
  },
  { timestamps: true }
);

export const User = model("users", user);

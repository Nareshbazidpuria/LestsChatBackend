import { model, Schema } from "mongoose";
import { ObjectId } from "mongodb";

const auth = new Schema(
  {
    userId: {
      type: ObjectId,
    },
    accessToken: {
      type: String,
    },
  },
  { timestamps: true }
);

export const Auth = model("auths", auth);

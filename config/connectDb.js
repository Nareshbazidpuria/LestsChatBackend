import { connect, set } from "mongoose";

export const connectDatabase = () => {
  set("strictQuery", true);
  connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
    .then(() => console.log("Database Connected"))
    .catch((err) => console.log(err));
};

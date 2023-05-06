import { Auth } from "../../models/auth";

export const userLoginService = (auth) => Auth.create(auth);

export const getAuthService = (filter) => Auth.findOne(filter);

export const logoutService = (filter) => Auth.findOneAndDelete(filter);

export const logoutAllService = (filter) => Auth.deleteMany(filter);

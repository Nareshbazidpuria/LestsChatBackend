import { Auth } from "../../models/auth";

export const userLoginService = (body) => {
  return Auth.create(body);
};

export const getAuthService = (filter) => {
  return Auth.findOne(filter);
};

export const logoutService = (filter) => {
  return Auth.findOneAndDelete(filter);
};

export const logoutAllService = (filter) => {
  return Auth.deleteMany(filter);
};

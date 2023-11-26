import bcrypt from "bcryptjs";
import Cryptr from "cryptr";
import { sign } from "jsonwebtoken";

export const hashPassword = async (password) => {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
};

export const comparePassword = (password, hash) =>
  bcrypt.compare(password, hash);

export const generateToken = async (payload) =>
  sign(payload, process.env.JWT_SECRET);

export const encrypt = async (str) => {
  const cryptr = new Cryptr(process.env.JWT_SECRET);
  return cryptr.encrypt(str);
};

export const decrypt = async (str) => {
  const cryptr = new Cryptr(process.env.JWT_SECRET);
  return cryptr.decrypt(str);
};

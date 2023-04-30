import bcrypt from 'bcryptjs'
import Cryptr from 'cryptr'
import { sign } from 'jsonwebtoken';

export const hashPassword = async (password) => {
  const salt = await bcrypt.genSalt(10);
  const securePass = await bcrypt.hash(password, salt);
  return securePass
}

export const comparePassword = async (password, hash) => {
  return bcrypt.compare(password, hash);
}

export const generateToken = async (payload) => {
  return sign(payload, process.env.JWT_SECRET)
}

export const encrypt = async (str) => {
  const cryptr = new Cryptr(process.env.JWT_SECRET);
  return cryptr.encrypt(str)
}

export const decrypt = async (str) => {
  const cryptr = new Cryptr(process.env.JWT_SECRET);
  return cryptr.decrypt(str)
}

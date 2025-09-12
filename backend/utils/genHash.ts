import { compare, hash } from "bcryptjs";

export const getHash = async (password: string) => {
  if (!process.env.HASH_SALT) {
    throw new Error("HASH SALT is not defined in environment variables");
  }
  return hash(password, process.env.HASH_SALT);
};

export const compareHash = async (password: string, hash: string) => {
  return compare(password, hash);
};

import { compare, genSalt, hash } from "bcryptjs";

const getHash = async (password: string) => {
  try {
    if (!process.env.HASH_SALT) {
      throw new Error("HASH SALT is not defined in environment variables");
    }
    const salt = await genSalt(+process.env.HASH_SALT);

    return hash(password, salt);
  } catch (error: any) {
    throw new Error(error.message);
  }
};

const compareHash = async (password: string, hash: string) => {
  try {
    return compare(password, hash);
  } catch (error) {
    throw error;
  }
};

export { getHash, compareHash };

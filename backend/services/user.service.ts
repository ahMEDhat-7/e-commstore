import "dotenv/config";
import { RegisterDto } from "../dtos/auth.dto";
import { UserModel } from "../models/user.model";

const createUser = async (user: RegisterDto) => {
  const newUser = new UserModel({ ...user });
  return newUser.save();
};
const findUser = async (email: string) => {
  return UserModel.findOne({ email });
};
const findUserById = async (id: string) => {
  return UserModel.findOne({ _id: id }).select("-password");
};
const findAllUsers = () => {};
const updateUser = () => {};
const removeUser = () => {};

export {
  createUser,
  findUser,
  findAllUsers,
  updateUser,
  removeUser,
  findUserById,
};

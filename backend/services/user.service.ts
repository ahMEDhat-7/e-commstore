import "dotenv/config";
import { RegisterDto } from "../dtos/auth.dto";
import UserModel from "../models/user.model";

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
const findAllUsers = () => {
  return UserModel.findOne({});
};
const updateUser = async (id: string, updatedData: { password: string }) => {
  const checkUser = await findUserById(id);
  if (!checkUser) {
    throw new Error("User not found");
  }
  const update = await UserModel.updateOne({ id }, updatedData);
  return update;
};
const removeUser = async (id: string) => {
  const checkUser = await findUserById(id);
  if (!checkUser) {
    throw new Error("User not found");
  }
  const deleted = await UserModel.deleteOne({ id });
  return deleted;
};
export {
  createUser,
  findUser,
  findAllUsers,
  updateUser,
  removeUser,
  findUserById,
};

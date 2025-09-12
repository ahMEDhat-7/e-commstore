import mongoose, { model, Schema } from "mongoose";
import { compareHash, getHash } from "@backend/utils/genHash";

const usersSchema = new Schema(
  {
    username: {
      type: String,
      required: [true, "username is required"],
    },
    email: {
      type: String,
      unique: true,
      required: [true, "email is required"],
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: [true, "password is required"],
      minlength: [6, "password must be at least 6 characters long"],
    },
    cartItems: [
      {
        quantity: {
          type: Number,
          default: 1,
        },
        product: {
          type: Schema.Types.ObjectId,
          ref: "Product",
        },
      },
    ],
    role: {
      type: String,
      enum: ["customer", "admin"],
      default: "customer",
    },
  },
  {
    timestamps: true,
  }
);

const User = model("User", usersSchema);

usersSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await getHash(this.password);
  next();
  try {
  } catch (error) {}
});

usersSchema.methods.comparePassword = async function (password: string) {
  return compareHash(password, this.password);
};

export default User;

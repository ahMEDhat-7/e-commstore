import mongoose from "mongoose";
import { compareHash, getHash } from "../utils/hashHelpers";

const UserSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: [true, "value is missed"],
    },
    email: {
      type: String,
      unique: true,
      required: [true, "value is missed"],
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: [true, "value is missed"],
      minlength: [6, "password must be at least 6 characters long"],
    },
    cartItems: [
      {
        quantity: {
          type: Number,
          default: 1,
        },
        product: {
          type: mongoose.Schema.Types.ObjectId,
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

UserSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  try {
    this.password = await getHash(this.password);
    next();
  } catch (err) {
    console.log(err);

    next(new Error("Error in Salt"));
  }
});

const UserModel = mongoose.model("User", UserSchema);

export default UserModel;

import { Schema, model } from "mongoose";
import { GENDERS } from "../../common/constants/gender.js";
//schema
const userSchema = new Schema(
  {
    email: {
      type: String,
      required: true,
      unique: [true, "email already exists"],
      lowercase: true,
    },
    password: { type: String, required: true },
    userName: {
      type: String,
      required: true,
      unique: [true, "name already exists"],
      minlength: 2,
      maxlength: 25,
    },
    phoneNumber: {
      type: String,
      required: true,
      unique: [true, "phone already exists"],
    },
    gender: { type: String, enum: Object.values(GENDERS) },
    isConfirmed: { type: Boolean, default: false },
    isDeleted: { type: Boolean, default: false },
    deletedAt: Date,
  },
  { timestamps: true, versionKey: false },
);

//model
export const Users = model("users", userSchema);

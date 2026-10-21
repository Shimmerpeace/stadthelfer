import mongoose, { Schema, model } from "mongoose";

export interface IUser {
  name: string;
  email: string;
  password: string;
  role: "user" | "provider" | "admin";
}

const userSchema = new Schema<IUser>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    password: { type: String, required: true, minlength: 6 },
    role: {
      type: String,
      enum: ["user", "provider", "admin"],
      default: "user",
    },
  },
  { timestamps: true }
);

export const User = model<IUser>("User", userSchema);
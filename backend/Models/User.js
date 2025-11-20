// models/User.js
import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: true,
    },
    mobile: {
      type: String,
      required: true,
      match: /^[0-9]{10}$/, // ensures 10-digit number
    },
    dob: {
      type: Date,
      required: true,
    },
    gender: {
      type: String,
      enum: ["Male", "Female", "Other"],
      required: true,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    otpCode: {
      type: String, // store as string; optionally hash later
    },
    otpExpiresAt: {
      type: Date,
    },
  },
  { timestamps: true } // automatically adds createdAt & updatedAt
);

export default mongoose.model("User", userSchema);






import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../Models/User.js";
import { issueOtpForUser } from "./OTP.js";

export const register = async (req, res) => {
  try {
    const { name, email, password, mobile, dob, gender } = req.body;

    if (!name || !email || !password || !mobile || !dob || !gender) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already registered" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      mobile,
      dob,
      gender,
    });

    await issueOtpForUser(user);

    res.status(201).json({
      message: "User registered. OTP sent to email for verification",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        isVerified: user.isVerified,
      },
    });
  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password required" });
    }

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(400).json({ message: "Invalid credentials" });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });

    res.json({
      message: "Login successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// ---------------- UPDATE USER PROFILE BY EMAIL ----------------
export const updateUserProfileByEmail = async (req, res) => {
  try {
    const { email, name, mobile, dob, gender, oldPassword, newPassword, otp } =
      req.body;

    if (!email) return res.status(400).json({ message: "Email is required" });

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    // Update general profile fields
    if (name) user.name = name;
    if (mobile) user.mobile = mobile;
    if (dob) user.dob = dob;
    if (gender) user.gender = gender;

    // ---------------- PASSWORD CHANGE ----------------
    if (oldPassword || newPassword) {
      if (!oldPassword || !newPassword || !otp) {
        return res
          .status(400)
          .json({
            message: "Old password, new password, and OTP are required",
          });
      }

      // Check old password
      const isMatch = await bcrypt.compare(oldPassword, user.password);
      if (!isMatch)
        return res.status(400).json({ message: "Old password is incorrect" });

      // Verify OTP
      if (
        String(otp) !== String(user.otpCode) ||
        new Date() > new Date(user.otpExpiresAt)
      ) {
        return res.status(400).json({ message: "Invalid or expired OTP" });
      }

      // Update password
      const hashedPassword = await bcrypt.hash(newPassword, 10);
      user.password = hashedPassword;

      // Clear OTP
      user.otpCode = undefined;
      user.otpExpiresAt = undefined;
      user.isVerified = true;
    }

    await user.save();

    res.json({
      message: "Profile updated successfully",
      user: {
        name: user.name,
        email: user.email,
        mobile: user.mobile,
        dob: user.dob,
        gender: user.gender,
      },
    });
  } catch (err) {
    console.error("Update user error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

export const getLoggedInUser = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select(
      "-password -otpCode -otpExpiresAt"
    );

    if (!user) return res.status(404).json({ message: "User not found" });
    res.json({ user });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

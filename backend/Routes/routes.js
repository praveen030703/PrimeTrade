// routes/authRoutes.js
import express from "express";
import {
  register,
  login,
  getLoggedInUser,
} from "../Controller/Usercontroller.js";
import { verifyOtp, resendOtp } from "../Controller/OTP.js";
import {
  createTask,
  getTask,
  getTasksByEmail,
  updateTask,
  deleteTask,
} from "../Controller/Taskcontroller.js";
import { authMiddleware } from "../Middleware/auth.js";

const router = express.Router();

// Auth Routes
router.post("/register", register);
router.post("/login", login);
router.post("/verify-otp", verifyOtp);
router.post("/resend-otp", resendOtp);
router.get("/me", authMiddleware, getLoggedInUser);

//Task Routes
router.post("/create-task", createTask);
router.get("/get-task/:id", getTask);
router.get("/tasks/:email", getTasksByEmail);
router.put("/update-task/:id", updateTask);
router.delete("/delete-task/:id", deleteTask);

export default router;

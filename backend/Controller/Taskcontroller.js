import Task from "../Models/Task.js";
import fs from "fs";
import path from "path";
import multer from "multer";

// ---------------- MULTER SETUP ----------------
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, `${uniqueSuffix}-${file.originalname}`);
  },
});

const upload = multer({ storage }).single("image");

// ---------------- CONTROLLER FUNCTIONS ----------------

// Create Task
export const createTask = (req, res) => {
  upload(req, res, async (err) => {
    if (err) return res.status(500).json({ message: err.message });

    try {
      const { title, description, status, dueDate, email } = req.body;
      if (!title) return res.status(400).json({ message: "Title is required" });
      if (!email) return res.status(400).json({ message: "Email is required" });

      const image = req.file ? req.file.filename : null;

      const task = await Task.create({
        title,
        description,
        status,
        dueDate,
        image,
        email,
      });

      res.status(201).json({ message: "Task created successfully", task });
    } catch (error) {
      console.error("Create task error:", error);
      res.status(500).json({ message: "Server error" });
    }
  });
};

// Get tasks by email
export const getTasksByEmail = async (req, res) => {
  try {
    const { email } = req.params;
    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    const tasks = await Task.find({ email }).sort({ createdAt: -1 });

    if (!tasks || tasks.length === 0) {
      return res.status(404).json({ message: "No tasks found for this email" });
    }

    res.json(tasks);
  } catch (error) {
    console.error("Error fetching tasks by email:", error);
    res.status(500).json({ message: "Server error" });
  }
};

//  Get single task by ID
export const getTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ message: "Task not found" });
    res.json(task);
  } catch (error) {
    console.error("Get task error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Update Task
export const updateTask = (req, res) => {
  upload(req, res, async (err) => {
    if (err) return res.status(500).json({ message: err.message });

    try {
      const { title, description, status, dueDate } = req.body;
      const task = await Task.findById(req.params.id);

      if (!task) return res.status(404).json({ message: "Task not found" });

      // Replace image if new one uploaded
      if (req.file) {
        if (task.image) {
          const oldImagePath = path.join("uploads", task.image);
          if (fs.existsSync(oldImagePath)) fs.unlinkSync(oldImagePath);
        }
        task.image = req.file.filename;
      }

      task.title = title || task.title;
      task.description = description || task.description;
      task.status = status || task.status;
      task.dueDate = dueDate || task.dueDate;

      await task.save();
      res.json({ message: "Task updated successfully", task });
    } catch (error) {
      console.error("Update task error:", error);
      res.status(500).json({ message: "Server error" });
    }
  });
};

// Delete Task
export const deleteTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ message: "Task not found" });

    // Delete image file if exists
    if (task.image) {
      const imagePath = path.join("uploads", task.image);
      if (fs.existsSync(imagePath)) fs.unlinkSync(imagePath);
    }

    await task.deleteOne();
    res.json({ message: "Task deleted successfully" });
  } catch (error) {
    console.error("Delete task error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useLocation } from "react-router-dom";
import API_URL from "../Api.js";

const Task = () => {
  const location = useLocation();
  const [tasks, setTasks] = useState([]);
  const [taskForm, setTaskForm] = useState({
    title: "",
    description: "",
    status: "Pending",
    dueDate: "",
    image: null,
  });
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);

  const email = localStorage.getItem("primetrade_user_email");
  const token = localStorage.getItem("primetrade_token");

  const isEditing = useMemo(() => Boolean(editingId), [editingId]);

  const fetchTasks = useCallback(async () => {
    if (!email || !token) return;

    setIsLoading(true);
    setError("");

    try {
      const response = await fetch(
        `${API_URL}tasks/${encodeURIComponent(email)}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setError(data?.message ?? "Unable to load tasks. Please try again.");
        return;
      }

      setTasks(Array.isArray(data) ? data : data.tasks || []);
    } catch (fetchError) {
      console.error("Fetch tasks failed:", fetchError);
      setError("Unable to load tasks. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  }, [email, token]);

  useEffect(() => {
    if (email && token) {
      fetchTasks();
    }
  }, [email, token, fetchTasks]);

  useEffect(() => {
    const editTask = location.state?.editTask;
    if (editTask && tasks.length > 0) {
      const task = tasks.find(
        (item) => (item._id || item.id) === (editTask._id || editTask.id)
      );
      if (task) {
        const taskIdField = task._id || task.id;
        let dueDateValue = "";
        if (task.dueDate) {
          const date = new Date(task.dueDate);
          const year = date.getFullYear();
          const month = String(date.getMonth() + 1).padStart(2, "0");
          const day = String(date.getDate()).padStart(2, "0");
          const hours = String(date.getHours()).padStart(2, "0");
          const minutes = String(date.getMinutes()).padStart(2, "0");
          dueDateValue = `${year}-${month}-${day}T${hours}:${minutes}`;
        }

        setTaskForm({
          title: task.title,
          description: task.description || "",
          status: task.status,
          dueDate: dueDateValue,
          image: null,
        });
        setEditingId(taskIdField);
        setImagePreview(task.image || null);
        setError("");

        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tasks, location.state]);

  const handleChange = (event) => {
    const { name, value, files } = event.target;

    if (name === "image" && files && files[0]) {
      const file = files[0];
      setTaskForm((prev) => ({ ...prev, image: file }));
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    } else {
      setTaskForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  const resetForm = () => {
    setTaskForm({
      title: "",
      description: "",
      status: "Pending",
      dueDate: "",
      image: null,
    });
    setEditingId(null);
    setImagePreview(null);
    setError("");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!email || !token) {
      setError("Please log in to create tasks.");
      return;
    }

    if (!taskForm.title.trim()) {
      setError("Task title is required.");
      return;
    }

    if (!taskForm.dueDate) {
      setError("Due date is required.");
      return;
    }

    setError("");
    setIsSubmitting(true);

    try {
      const formData = new FormData();
      formData.append("title", taskForm.title);
      formData.append("description", taskForm.description || "");
      formData.append("status", taskForm.status);
      formData.append("dueDate", taskForm.dueDate);
      formData.append("email", email);
      if (taskForm.image) {
        formData.append("image", taskForm.image);
      }

      let response;
      if (editingId) {
        response = await fetch(`${API_URL}update-task/${editingId}`, {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        });
      } else {
        response = await fetch(`${API_URL}create-task`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        });
      }

      const data = await response.json();

      if (!response.ok) {
        setError(data?.message ?? "Unable to save task. Please try again.");
        return;
      }

      resetForm();
      await fetchTasks();
    } catch (submitError) {
      console.error("Submit task failed:", submitError);
      setError("Unable to save task. Please try again later.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = (taskId) => {
    const task = tasks.find(
      (item) => item._id === taskId || item.id === taskId
    );
    if (!task) return;

    const taskIdField = task._id || task.id;
    let dueDateValue = "";
    if (task.dueDate) {
      const date = new Date(task.dueDate);
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const day = String(date.getDate()).padStart(2, "0");
      const hours = String(date.getHours()).padStart(2, "0");
      const minutes = String(date.getMinutes()).padStart(2, "0");
      dueDateValue = `${year}-${month}-${day}T${hours}:${minutes}`;
    }

    setTaskForm({
      title: task.title,
      description: task.description || "",
      status: task.status,
      dueDate: dueDateValue,
      image: null,
    });
    setEditingId(taskIdField);
    setImagePreview(task.image || null);
    setError("");
  };

  const handleDelete = async (taskId) => {
    if (!email || !token) {
      setError("Please log in to delete tasks.");
      return;
    }

    if (!window.confirm("Are you sure you want to delete this task?")) {
      return;
    }

    setError("");

    try {
      const response = await fetch(`${API_URL}delete-task/${taskId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data?.message ?? "Unable to delete task. Please try again.");
        return;
      }

      if (taskId === editingId) {
        resetForm();
      }

      await fetchTasks();
    } catch (deleteError) {
      console.error("Delete task failed:", deleteError);
      setError("Unable to delete task. Please try again later.");
    }
  };

  return (
    <div className="space-y-8">
      <section className="card p-6">
        <header className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-xl font-semibold text-white">Task planner</h2>
            <p className="text-sm text-slate-400">
              Create, Update, and Delete tasks.
            </p>
          </div>
          {isEditing && (
            <button type="button" onClick={resetForm} className="btn-outline">
              Cancel edit
            </button>
          )}
        </header>

        <form
          className="mt-6 grid gap-4 md:grid-cols-2 md:gap-6"
          onSubmit={handleSubmit}
        >
          {error && (
            <div className="md:col-span-2 rounded-lg border border-red-500/40 bg-red-500/10 px-3 py-2 text-sm text-red-300">
              {error}
            </div>
          )}
          <div className="grid gap-2">
            <label
              className="text-sm font-medium text-slate-300"
              htmlFor="title"
            >
              Task title
            </label>
            <input
              id="title"
              name="title"
              value={taskForm.title}
              onChange={handleChange}
              required
              className="input"
              placeholder="e.g. Prepare campaign brief"
            />
          </div>

          <div className="grid gap-2">
            <label
              className="text-sm font-medium text-slate-300"
              htmlFor="dueDate"
            >
              Due date & time <span className="text-red-400">*</span>
            </label>
            <input
              id="dueDate"
              name="dueDate"
              type="datetime-local"
              value={taskForm.dueDate}
              onChange={handleChange}
              className="input"
              required
            />
          </div>

          <div className="md:col-span-2 grid gap-2">
            <label
              className="text-sm font-medium text-slate-300"
              htmlFor="description"
            >
              Description
            </label>
            <textarea
              id="description"
              name="description"
              rows={4}
              value={taskForm.description}
              onChange={handleChange}
              className="input"
              placeholder="Add key details, goals, and references"
            />
          </div>

          <div className="grid gap-2">
            <label
              className="text-sm font-medium text-slate-300"
              htmlFor="status"
            >
              Status
            </label>
            <select
              id="status"
              name="status"
              value={taskForm.status}
              onChange={handleChange}
              className="input"
              required
            >
              <option value="Pending">Pending</option>
              <option value="In Progress">In Progress</option>
              <option value="Completed">Completed</option>
            </select>
          </div>

          <div className="md:col-span-2 grid gap-2">
            <label
              className="text-sm font-medium text-slate-300"
              htmlFor="image"
            >
              Image (optional)
            </label>
            <input
              id="image"
              name="image"
              type="file"
              accept="image/*"
              onChange={handleChange}
              className="input file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-600 file:text-white hover:file:bg-blue-500"
            />
            {imagePreview && (
              <div className="mt-2">
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="h-32 w-auto rounded-lg border border-slate-800 object-cover"
                />
              </div>
            )}
          </div>

          <div className="md:col-span-2 flex justify-end">
            <button
              type="submit"
              className="btn-primary disabled:cursor-not-allowed disabled:opacity-70"
              disabled={isSubmitting}
            >
              {isSubmitting
                ? isEditing
                  ? "Updating…"
                  : "Creating…"
                : isEditing
                ? "Update task"
                : "Add task"}
            </button>
          </div>
        </form>
      </section>
    </div>
  );
};

export default Task;

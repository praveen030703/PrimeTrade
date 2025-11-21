import React, { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import API_URL from "../Api.js";

const CompletedTasks = () => {
  const navigate = useNavigate();

  const [completedTasks, setCompletedTasks] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const email = localStorage.getItem("primetrade_user_email");
  const token = localStorage.getItem("primetrade_token");

  const fetchTasks = useCallback(async () => {
    if (!email || !token) return;

    setIsLoading(true);

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

      if (response.status === 401) {
        navigate("/login");
        return;
      }

      const data = await response.json();

      const tasks = Array.isArray(data) ? data : data.tasks || [];

      const completed = tasks.filter(
        (task) => task.status?.toLowerCase() === "completed"
      );

      setCompletedTasks(completed);
    } catch (err) {
      console.error("Fetch tasks failed:", err);
    } finally {
      setIsLoading(false);
    }
  }, [email, token, navigate]);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  const backToDashBoard = () => {
    navigate("/dashboard");
  };

  // Filter tasks based on search term
  const filteredTasks = completedTasks.filter((task) => {
    const search = searchTerm.toLowerCase();
    return (
      task.title?.toLowerCase().includes(search) ||
      task.description?.toLowerCase().includes(search) ||
      task.status?.toLowerCase().includes(search)
    );
  });

  const handleDeleteTask = async (taskId, event) => {
    event.stopPropagation();

    if (!email || !token) {
      return;
    }

    if (!window.confirm("Are you sure you want to delete this task?")) {
      return;
    }

    try {
      const response = await fetch(`${API_URL}delete-task/${taskId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();

      if (response.ok) {
        await fetchTasks();
      } else {
        alert(data?.message ?? "Unable to delete task. Please try again.");
      }
    } catch (deleteError) {
      console.error("Delete task failed:", deleteError);
      alert("Unable to delete task. Please try again later.");
    }
  };
  return (
    <div className="w-full min-h-screen p-6 text-white flex flex-col items-center">
      <h1 className="text-2xl font-semibold mb-4  ">Completed Tasks</h1>
      {/* Search Bar Centered */}
      <div className="w-full flex justify-center mb-6">
        <input
          type="text"
          placeholder="Search tasks..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full max-w-md px-4 py-2 rounded bg-slate-700 text-white border border-slate-600 
                     focus:outline-none focus:border-blue-500"
        />
      </div>

      {/* Center Task List */}
      <div className="w-full flex justify-center">
        <ul className="space-y-4 w-full max-w-3xl">
          {filteredTasks.map((task) => (
            <li
              key={task._id}
              className="p-4 bg-slate-800 rounded flex justify-between items-center"
            >
              <div>
                <p className="text-lg font-medium">{task.title}</p>
                <p className="text-sm text-slate-400">{task.description}</p>
              </div>

              <button
                onClick={(e) => handleDeleteTask(task._id, e)}
                className="rounded-lg border border-red-500/40 p-2 text-red-300
                           hover:border-red-400 hover:bg-red-500/10 hover:text-red-200"
                title="Delete task"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                  />
                </svg>
              </button>
            </li>
          ))}
        </ul>
      </div>

      <button
        onClick={backToDashBoard}
        className="rounded-lg bg-red-500 px-4 py-2 text-sm font-semibold text-white shadow mt-10
                  hover:bg-red-600"
      >
        Back
      </button>
    </div>
  );
};

export default CompletedTasks;

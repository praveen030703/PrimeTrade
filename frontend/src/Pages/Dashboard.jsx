import React, { useCallback, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

const statusBadges = {
  Completed: 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40',
  'In Progress': 'bg-blue-500/20 text-blue-300 border border-blue-500/40',
  Pending: 'bg-amber-500/20 text-amber-300 border border-amber-500/40',
}

const Dashboard = () => {
  const navigate = useNavigate()
  const [tasks, setTasks] = useState([])
  const [isLoading, setIsLoading] = useState(false)

  const email = localStorage.getItem('primetrade_user_email')
  const token = localStorage.getItem('primetrade_token')

  const fetchTasks = useCallback(async () => {
    if (!email || !token) return

    setIsLoading(true)

    try {
      const response = await fetch(`http://localhost:5000/api/auth/tasks/${encodeURIComponent(email)}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      })

      const data = await response.json()

      if (response.ok) {
        setTasks(Array.isArray(data) ? data : data.tasks || [])
      }
    } catch (fetchError) {
      console.error('Fetch tasks failed:', fetchError)
    } finally {
      setIsLoading(false)
    }
  }, [email, token])

  useEffect(() => {
    if (email && token) {
      fetchTasks()
    }
  }, [email, token, fetchTasks])

  const pendingTasks = tasks.filter((task) => task.status === 'Pending')
  const inProgressTasks = tasks.filter((task) => task.status === 'In Progress')
  const completedTasks = tasks.filter((task) => task.status === 'Completed')

  const formatDateTime = (dateString) => {
    if (!dateString) return null
    const date = new Date(dateString)
    const dateStr = date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    })
    const timeStr = date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    })
    return `${dateStr} at ${timeStr}`
  }

  const handleDeleteTask = async (taskId, event) => {
    event.stopPropagation()

    if (!email || !token) {
      return
    }

    if (!window.confirm('Are you sure you want to delete this task?')) {
      return
    }

    try {
      const response = await fetch(`http://localhost:5000/api/auth/delete-task/${taskId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      })

      const data = await response.json()

      if (response.ok) {
        await fetchTasks()
      } else {
        alert(data?.message ?? 'Unable to delete task. Please try again.')
      }
    } catch (deleteError) {
      console.error('Delete task failed:', deleteError)
      alert('Unable to delete task. Please try again later.')
    }
  }

  const handleEditTask = (task, event) => {
    event.stopPropagation()
    navigate('/tasks', {
      state: {
        editTask: task,
      },
    })
  }

  const renderTaskCard = (task) => {
    const taskId = task._id || task.id
    const formattedDateTime = formatDateTime(task.dueDate)

    return (
      <article
        key={taskId}
        className="rounded-xl border border-slate-800 bg-slate-950/60 p-4 hover:border-slate-700 transition-colors"
      >
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0 cursor-pointer" onClick={() => navigate('/tasks')}>
            <h4 className="text-sm font-semibold text-white truncate">{task.title}</h4>
            {task.description && (
              <p className="mt-1 text-xs text-slate-400 line-clamp-2">{task.description}</p>
            )}
          </div>
          <span
            className={`flex-shrink-0 whitespace-nowrap rounded-full px-2 py-1 text-xs font-semibold ${
              statusBadges[task.status] ?? 'bg-slate-800 text-slate-300'
            }`}
          >
            {task.status}
          </span>
        </div>

        {formattedDateTime && (
          <div className="mt-3 text-xs text-slate-400" onClick={() => navigate('/tasks')}>
            Due {formattedDateTime}
          </div>
        )}

        {task.image && (
          <div className="mt-3" onClick={() => navigate('/tasks')}>
            <img
              src={task.image}
              alt={task.title}
              className="h-24 w-full rounded-lg border border-slate-800 object-cover"
            />
          </div>
        )}

        <div className="mt-3 flex items-center justify-end gap-2">
          <button
            onClick={(e) => handleEditTask(task, e)}
            className="rounded-lg border border-blue-500/40 p-1.5 text-blue-300 transition hover:border-blue-400 hover:bg-blue-500/10 hover:text-blue-200"
            title="Edit task"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
              />
            </svg>
          </button>
          <button
            onClick={(e) => handleDeleteTask(taskId, e)}
            className="rounded-lg border border-red-500/40 p-1.5 text-red-300 transition hover:border-red-400 hover:bg-red-500/10 hover:text-red-200"
            title="Delete task"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4"
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
        </div>
      </article>
    )
  }

  return (
    <div className="space-y-8">
      <section className="grid gap-6 md:grid-cols-3">
        <article className="card p-6">
          <p className="text-sm text-slate-400">Pending tasks</p>
          <p className="mt-3 text-3xl font-semibold text-white">{pendingTasks.length}</p>
          <p className="mt-4 text-xs font-medium text-amber-400">
            {pendingTasks.length === 1 ? '1 task needs attention' : `${pendingTasks.length} tasks need attention`}
          </p>
        </article>

        <article className="card p-6">
          <p className="text-sm text-slate-400">In progress tasks</p>
          <p className="mt-3 text-3xl font-semibold text-white">{inProgressTasks.length}</p>
          <p className="mt-4 text-xs font-medium text-blue-400">
            {inProgressTasks.length === 1 ? '1 task in progress' : `${inProgressTasks.length} tasks in progress`}
          </p>
        </article>

        <article className="card p-6">
          <p className="text-sm text-slate-400">Completed tasks</p>
          <p className="mt-3 text-3xl font-semibold text-white">{completedTasks.length}</p>
          <p className="mt-4 text-xs font-medium text-emerald-400">
            {completedTasks.length === 1 ? '1 task completed' : `${completedTasks.length} tasks completed`}
          </p>
        </article>
      </section>

      <section className="grid gap-6 lg:grid-cols-2">
        <div className="card p-6">
          <header className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-semibold text-white">Pending tasks</h2>
              <p className="text-sm text-slate-400">Tasks that need to be started</p>
            </div>
            {pendingTasks.length > 0 && (
              <button
                onClick={() => navigate('/tasks')}
                className="rounded-lg border border-blue-500/40 px-3 py-1 text-xs font-semibold text-blue-400 transition hover:border-blue-400 hover:text-blue-300"
              >
                View all
              </button>
            )}
          </header>

          {isLoading ? (
            <div className="text-center py-8">
              <p className="text-sm text-slate-400">Loading tasks…</p>
            </div>
          ) : pendingTasks.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-sm text-slate-400">No pending tasks</p>
              <p className="text-xs text-slate-500 mt-1">All caught up!</p>
            </div>
          ) : (
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {pendingTasks.slice(0, 5).map(renderTaskCard)}
              {pendingTasks.length > 5 && (
                <button
                  onClick={() => navigate('/tasks')}
                  className="w-full text-center text-xs text-blue-400 hover:text-blue-300 py-2"
                >
                  View {pendingTasks.length - 5} more pending tasks →
                </button>
              )}
            </div>
          )}
        </div>

        <div className="card p-6">
          <header className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-semibold text-white">In progress tasks</h2>
              <p className="text-sm text-slate-400">Tasks currently being worked on</p>
            </div>
            {inProgressTasks.length > 0 && (
              <button
                onClick={() => navigate('/tasks')}
                className="rounded-lg border border-blue-500/40 px-3 py-1 text-xs font-semibold text-blue-400 transition hover:border-blue-400 hover:text-blue-300"
              >
                View all
              </button>
            )}
          </header>

          {isLoading ? (
            <div className="text-center py-8">
              <p className="text-sm text-slate-400">Loading tasks…</p>
            </div>
          ) : inProgressTasks.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-sm text-slate-400">No tasks in progress</p>
              <p className="text-xs text-slate-500 mt-1">Start a task to see it here</p>
            </div>
          ) : (
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {inProgressTasks.slice(0, 5).map(renderTaskCard)}
              {inProgressTasks.length > 5 && (
                <button
                  onClick={() => navigate('/tasks')}
                  className="w-full text-center text-xs text-blue-400 hover:text-blue-300 py-2"
                >
                  View {inProgressTasks.length - 5} more in progress tasks →
                </button>
              )}
            </div>
          )}
        </div>
      </section>
    </div>
  )
}

export default Dashboard

import React from 'react'
import { NavLink } from 'react-router-dom'

const navItems = [
  { label: 'Dashboard', path: '/dashboard' },
  { label: 'Profile', path: '/profile' },
  { label: 'Tasks', path: '/tasks' },
]

const Sidebar = ({ isOpen = false, onClose }) => {
  const handleNavigate = () => {
    if (onClose) onClose()
  }

  return (
    <>
      <div
        className={`fixed inset-0 z-30 bg-slate-950/60 backdrop-blur transition-opacity lg:hidden ${
          isOpen ? 'opacity-100 pointer-events-auto' : 'pointer-events-none opacity-0'
        }`}
        onClick={onClose}
      />

      <aside
        className={`fixed inset-y-0 left-0 z-40 flex w-72 max-w-full transform flex-col border-r border-slate-800 bg-slate-900/90 p-6 backdrop-blur transition-transform lg:static lg:z-auto lg:w-64 lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        <div className="mb-10 flex items-center justify-between">
          <div>
            <span className="text-2xl font-extrabold tracking-tight bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">
              Primetrade
            </span>
            <p className="text-sm text-slate-400">Manage your work in one place</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="btn-outline px-2 py-1 text-xs lg:hidden"
          >
            Close
          </button>
        </div>

        <nav className="space-y-2">
          {navItems.map(({ label, path }) => (
            <NavLink
              key={path}
              to={path}
              onClick={handleNavigate}
              className={({ isActive }) =>
                `block rounded-lg px-4 py-2 font-medium transition-colors ${
                  isActive
                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30'
                    : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                }`
              }
            >
              {label}
            </NavLink>
          ))}
        </nav>
      </aside>
    </>
  )
}

export default Sidebar

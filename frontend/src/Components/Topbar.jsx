import React from "react";
import { useLocation, useNavigate } from "react-router-dom";

const titles = {
  "/dashboard": "Dashboard",
  "/profile": "Profile",
  "/profile/edit": "Edit Profile",
  "/tasks": "Tasks",
};

const Topbar = ({ onToggleSidebar }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const title = titles[location.pathname] ?? "Primetrade";

  const handleLogout = () => {
    if (window.confirm("Are you sure you want to logout?")) {
      localStorage.clear();
      navigate("/login");
    }
  };

  return (
    <header className="bg-slate-950/70 border-b border-slate-800 px-4 py-3 backdrop-blur flex items-center justify-between gap-4 sticky top-0 z-10 sm:px-6 lg:px-8">
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onToggleSidebar}
          className="btn-outline px-3 py-2 text-sm font-semibold lg:hidden"
        >
          Menu
        </button>
        <h1 className="text-2xl font-extrabold tracking-tight text-white">
          {title}
        </h1>
        <p className="hidden text-sm text-slate-400 sm:block">
          Welcome back! Stay productive today.
        </p>
      </div>
      <button
        onClick={handleLogout}
        className="rounded-lg bg-red-500 px-4 py-2 text-sm font-semibold text-white shadow shadow-red-500/30 transition hover:bg-red-600"
      >
        Logout
      </button>
    </header>
  );
};

export default Topbar;

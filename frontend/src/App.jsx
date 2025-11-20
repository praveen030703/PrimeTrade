import React from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import DashboardLayout from './Components/DashboardLayout.jsx'
import Dashboard from './Pages/Dashboard.jsx'
import EditProfile from './Pages/EditProfile.jsx'
import Login from './Pages/Login.jsx'
import OtpVerification from './Pages/OtpVerification.jsx'
import Profile from './Pages/Profile.jsx'
import Register from './Pages/Register.jsx'
import Task from './Pages/Task.jsx'

function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/otp" element={<OtpVerification />} />

      <Route element={<DashboardLayout />}>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/profile/edit" element={<EditProfile />} />
        <Route path="/tasks" element={<Task />} />
      </Route>

      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  )
}

export default App

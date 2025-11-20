import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const initialProfile = {
  fullName: 'Jane Cooper',
  phone: '+91 98765 43210',
  dob: '1992-07-18',
  gender: 'female',
  email: 'jane.cooper@primetrade.com',
  address: '221B Baker Street, London',
  oldPassword: '',
  newPassword: '',
  otp: '',
}

const EditProfile = () => {
  const navigate = useNavigate()
  const [form, setForm] = useState(initialProfile)

  const handleChange = (event) => {
    const { name, value } = event.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    navigate('/profile')
  }

  return (
    <div className="mx-auto max-w-4xl space-y-8">
      <section className="card p-8">
        <header className="mb-6 space-y-1 text-left">
          <h2 className="text-2xl font-semibold text-white">Update profile</h2>
          <p className="text-sm text-slate-400">
            Keep your personal information up to date. All fields are editable and saved locally for now.
          </p>
        </header>

        <form className="grid gap-8" onSubmit={handleSubmit}>
          <div className="grid gap-6 md:grid-cols-2">
            <div className="grid gap-2">
              <label className="text-sm font-medium text-slate-300" htmlFor="fullName">
                Full name
              </label>
              <input
                id="fullName"
                name="fullName"
                value={form.fullName}
                onChange={handleChange}
                className="rounded-lg border border-slate-800 bg-slate-950 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/40"
                required
              />
            </div>

            <div className="grid gap-2">
              <label className="text-sm font-medium text-slate-300" htmlFor="phone">
                Mobile number
              </label>
              <input
                id="phone"
                name="phone"
                value={form.phone}
                onChange={handleChange}
                className="rounded-lg border border-slate-800 bg-slate-950 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/40"
                required
              />
            </div>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <div className="grid gap-2">
              <label className="text-sm font-medium text-slate-300" htmlFor="dob">
                Date of birth
              </label>
              <input
                id="dob"
                name="dob"
                type="date"
                value={form.dob}
                onChange={handleChange}
                className="rounded-lg border border-slate-800 bg-slate-950 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/40"
              />
            </div>
            <div className="grid gap-2">
              <label className="text-sm font-medium text-slate-300" htmlFor="gender">
                Gender
              </label>
              <select
                id="gender"
                name="gender"
                value={form.gender}
                onChange={handleChange}
                className="rounded-lg border border-slate-800 bg-slate-950 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/40"
              >
                <option value="female">Female</option>
                <option value="male">Male</option>
                <option value="other">Other</option>
              </select>
            </div>
          </div>

          <div className="grid gap-2">
            <label className="text-sm font-medium text-slate-300" htmlFor="email">
              Email address
            </label>
            <input
              id="email"
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              className="rounded-lg border border-slate-800 bg-slate-950 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/40"
              required
            />
          </div>

          <div className="grid gap-2">
            <label className="text-sm font-medium text-slate-300" htmlFor="address">
              Address
            </label>
            <textarea
              id="address"
              name="address"
              rows={3}
              value={form.address}
              onChange={handleChange}
              className="rounded-lg border border-slate-800 bg-slate-950 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/40"
            />
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-950/70 p-6">
            <h3 className="text-lg font-semibold text-white">Security</h3>
            <p className="mt-1 text-xs text-slate-400">
              Update your password and confirm with OTP to secure your account.
            </p>

            <div className="mt-4 grid gap-6 md:grid-cols-3">
              <div className="grid gap-2">
                <label className="text-sm font-medium text-slate-300" htmlFor="oldPassword">
                  Old password
                </label>
                <input
                  id="oldPassword"
                  name="oldPassword"
                  type="password"
                  value={form.oldPassword}
                  onChange={handleChange}
                  className="rounded-lg border border-slate-800 bg-slate-950 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/40"
                />
              </div>

              <div className="grid gap-2">
                <label className="text-sm font-medium text-slate-300" htmlFor="newPassword">
                  New password
                </label>
                <input
                  id="newPassword"
                  name="newPassword"
                  type="password"
                  value={form.newPassword}
                  onChange={handleChange}
                  className="rounded-lg border border-slate-800 bg-slate-950 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/40"
                />
              </div>

              <div className="grid gap-2">
                <label className="text-sm font-medium text-slate-300" htmlFor="otp">
                  OTP
                </label>
                <input
                  id="otp"
                  name="otp"
                  value={form.otp}
                  onChange={handleChange}
                  className="rounded-lg border border-slate-800 bg-slate-950 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/40"
                  placeholder="Enter 6-digit code"
                />
              </div>
            </div>
          </div>

          <div className="flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="rounded-lg border border-slate-700 px-4 py-2 text-sm font-semibold text-slate-300 transition hover:border-slate-500 hover:text-white"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow shadow-blue-600/40 transition hover:bg-blue-500"
            >
              Save changes
            </button>
          </div>
        </form>
      </section>
    </div>
  )
}

export default EditProfile


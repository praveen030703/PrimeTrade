import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

const Register = () => {
  const navigate = useNavigate()
  const [form, setForm] = useState({
    fullName: '',
    email: '',
    mobile: '',
    dob: '',
    gender: '',
    password: '',
    confirmPassword: '',
  })
  const [error, setError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleChange = (event) => {
    const { name, value } = event.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()

    if (form.password !== form.confirmPassword) {
      setError('Passwords do not match. Please double-check and try again.')
      return
    }

    setError('')
    setIsSubmitting(true)

    try {
      const response = await fetch('http://localhost:5000/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: form.fullName,
          email: form.email,
          mobile: form.mobile,
          dob: form.dob,
          gender: form.gender,
          password: form.password,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data?.message ?? 'Unable to create account. Please try again.')
        return
      }

      localStorage.setItem('primetrade_pending_email', form.email)

      navigate('/otp', {
        state: {
          email: form.email,
        },
      })
    } catch (submitError) {
      console.error('Register request failed:', submitError)
      setError('Unable to reach the server. Please try again later.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen text-slate-100 flex items-center justify-center px-4">
      <div className="w-full max-w-2xl rounded-2xl border border-slate-800 bg-slate-900/80 p-10 shadow-2xl shadow-blue-900/20 backdrop-blur">
        <div className="mb-8 text-center space-y-2">
          <h1 className="text-3xl font-extrabold tracking-tight">Create your Primetrade account</h1>
          <p className="text-sm text-slate-400">
            Register to access the dashboard, manage your profile, and stay on top of tasks.
          </p>
        </div>

        <form className="grid gap-6" onSubmit={handleSubmit}>
          {error && (
            <p className="rounded-lg border border-red-500/40 bg-red-500/10 px-3 py-2 text-sm text-red-300">
              {error}
            </p>
          )}
          <div className="grid gap-2">
            <label className="text-sm font-medium text-slate-300" htmlFor="fullName">
              Full name
            </label>
            <input
              id="fullName"
              name="fullName"
              required
              value={form.fullName}
              onChange={handleChange}
              className="input"
              placeholder="Jane Doe"
            />
          </div>

          <div className="grid gap-2 md:grid-cols-2 md:gap-6">
            <div className="grid gap-2">
              <label className="text-sm font-medium text-slate-300" htmlFor="email">
                Email address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                value={form.email}
                onChange={handleChange}
                className="input"
                placeholder="you@example.com"
              />
            </div>
            <div className="grid gap-2">
              <label className="text-sm font-medium text-slate-300" htmlFor="mobile">
                Mobile number
              </label>
              <input
                id="mobile"
                name="mobile"
                type="tel"
                required
                value={form.mobile}
                onChange={handleChange}
                className="input"
                placeholder="+91 98765 43210"
              />
            </div>
          </div>

          <div className="grid gap-2 md:grid-cols-2 md:gap-6">
            <div className="grid gap-2">
              <label className="text-sm font-medium text-slate-300" htmlFor="dob">
                Date of birth
              </label>
              <input
                id="dob"
                name="dob"
                type="date"
                required
                value={form.dob}
                onChange={handleChange}
                className="input"
              />
            </div>
            <div className="grid gap-2">
              <label className="text-sm font-medium text-slate-300" htmlFor="gender">
                Gender
              </label>
              <select
                id="gender"
                name="gender"
                required
                value={form.gender}
                onChange={handleChange}
                className="input"
              >
                <option value="" disabled hidden>
                  Select gender
                </option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>
          </div>

          <div className="grid gap-2 md:grid-cols-2 md:gap-6">
            <div className="grid gap-2">
              <label className="text-sm font-medium text-slate-300" htmlFor="password">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                value={form.password}
                onChange={handleChange}
                className="input"
                placeholder="Create a strong password"
              />
            </div>
            <div className="grid gap-2">
              <label className="text-sm font-medium text-slate-300" htmlFor="confirmPassword">
                Confirm password
              </label>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                required
                value={form.confirmPassword}
                onChange={handleChange}
                className="input"
                placeholder="Confirm password"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full btn-primary disabled:cursor-not-allowed disabled:opacity-70"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Creating account…' : 'Sign up'}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-slate-400">
          Already have an account?{' '}
          <Link to="/login" className="font-medium text-blue-400 hover:text-blue-300">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  )
}

export default Register


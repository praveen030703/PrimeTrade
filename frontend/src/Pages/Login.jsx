import React, { useEffect, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'

const Login = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const [form, setForm] = useState({ email: '', password: '' })
  const [error, setError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [infoMessage, setInfoMessage] = useState(location.state?.message ?? '')

  useEffect(() => {
    localStorage.clear()
  }, [])

  useEffect(() => {
    if (location.state?.email) {
      setForm((prev) => ({ ...prev, email: location.state.email }))
    }
    if (location.state?.message) {
      setInfoMessage(location.state.message)
    }
  }, [location.state])

  const handleChange = (event) => {
    const { name, value } = event.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()

    setError('')
    setIsSubmitting(true)

    try {
      const response = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(form),
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data?.message ?? 'Unable to sign in. Please try again.')
        return
      }

      if (data?.token) {
        localStorage.setItem('primetrade_token', data.token)
      }

      if (data?.user?.email) {
        localStorage.setItem('primetrade_user_email', data.user.email)
      }

      navigate('/dashboard')
    } catch (submitError) {
      console.error('Login request failed:', submitError)
      setError('Unable to reach the server. Please try again later.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen text-slate-100 flex items-center justify-center px-4">
      <div className="w-full max-w-md space-y-8 rounded-2xl border border-slate-800 bg-slate-900/80 p-8 shadow-2xl shadow-blue-900/20 backdrop-blur">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-extrabold tracking-tight">Welcome back to Primetrade</h1>
          <p className="text-sm text-slate-400">Sign in to access your dashboard and tasks</p>
        </div>

        <form className="space-y-4" onSubmit={handleSubmit}>
          {infoMessage && (
            <p className="rounded-lg border border-emerald-500/40 bg-emerald-500/10 px-3 py-2 text-sm text-emerald-300">
              {infoMessage}
            </p>
          )}
          {error && (
            <p className="rounded-lg border border-red-500/40 bg-red-500/10 px-3 py-2 text-sm text-red-300">
              {error}
            </p>
          )}
          <div className="space-y-2">
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
              className="w-full input"
              placeholder="you@example.com"
            />
          </div>

          <div className="space-y-2">
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
              className="w-full input"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            className="w-full btn-primary disabled:cursor-not-allowed disabled:opacity-70"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Signing in…' : 'Log in'}
          </button>
        </form>

        <div className="text-center text-sm text-slate-400 space-y-1">
          <p>
            Don't have an account?{' '}
            <Link to="/register" className="font-medium text-blue-400 hover:text-blue-300">
              Sign up
            </Link>
          </p>
          <p>
            
            <Link to="/otp" className="font-medium text-blue-400 hover:text-blue-300">
              Forgot Password?
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}

export default Login


import React, { useEffect, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'

const OtpVerification = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const [otp, setOtp] = useState(['', '', '', '', '', ''])
  const [error, setError] = useState('')
  const [isVerifying, setIsVerifying] = useState(false)
  const [isResending, setIsResending] = useState(false)
  const emailFromState = location.state?.email

  const email = emailFromState ?? localStorage.getItem('primetrade_pending_email') ?? localStorage.getItem('primetrade_user_email')

  useEffect(() => {
    if (!email) {
      navigate('/register', { replace: true })
    }
  }, [email, navigate])

  const handleChange = (index, value) => {
    if (!/^[0-9]?$/.test(value)) return

    const updated = [...otp]
    updated[index] = value
    setOtp(updated)
  }

  const handleSubmit = async (event) => {
    event.preventDefault()

    if (!email) return

    const code = otp.join('')
    if (code.length !== 6) {
      setError('Please enter the 6-digit OTP to continue.')
      return
    }

    setError('')
    setIsVerifying(true)

    try {
      const response = await fetch('http://localhost:5000/api/auth/verify-otp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, otp: code }),
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data?.message ?? 'OTP verification failed. Please try again.')
        return
      }

      localStorage.clear()

      navigate('/login', {
        replace: true,
        state: {
          email,
          message: 'Your account has been verified. Please sign in to continue.',
        },
      })
    } catch (verifyError) {
      console.error('OTP verification failed:', verifyError)
      setError('Unable to verify OTP. Please try again later.')
    } finally {
      setIsVerifying(false)
    }
  }

  const handleResend = async () => {
    if (!email) return

    setError('')
    setIsResending(true)

    try {
      const response = await fetch('http://localhost:5000/api/auth/resend-otp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data?.message ?? 'Unable to resend OTP. Please try again.')
        return
      }
    } catch (resendError) {
      console.error('Resend OTP failed:', resendError)
      setError('Unable to resend OTP right now. Try again shortly.')
    } finally {
      setIsResending(false)
    }
  }

  if (!email) {
    return null
  }

  return (
    <div className="min-h-screen text-slate-100 flex items-center justify-center px-4">
      <div className="w-full max-w-xl space-y-10 rounded-2xl border border-slate-800 bg-slate-900/80 p-10 text-center shadow-2xl shadow-blue-900/20 backdrop-blur">
        <div className="space-y-2">
          <h1 className="text-3xl font-extrabold tracking-tight">Verify your account</h1>
          <p className="text-sm text-slate-400">
            We sent a 6-digit code to <span className="font-semibold text-blue-300">{email}</span>. Enter it below to continue.
          </p>
        </div>

        <form className="space-y-6" onSubmit={handleSubmit}>
          {error && (
            <p className="rounded-lg border border-red-500/40 bg-red-500/10 px-3 py-2 text-sm text-red-300">
              {error}
            </p>
          )}

          <div className="flex justify-center gap-3">
            {otp.map((value, index) => (
              <input
                key={index}
                value={value}
                onChange={(event) => handleChange(index, event.target.value)}
                maxLength={1}
                className="h-14 w-12 rounded-lg border border-slate-800 bg-slate-950 text-center text-xl font-semibold focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/40"
              />
            ))}
          </div>

          <button
            type="submit"
            className="w-full btn-primary disabled:cursor-not-allowed disabled:opacity-70"
            disabled={isVerifying}
          >
            {isVerifying ? 'Verifying…' : 'Verify & continue'}
          </button>
        </form>

        <div className="space-y-2 text-sm text-slate-400">
          <p>
            Didn&apos;t receive the code?{' '}
            <button
              className="font-medium text-blue-400 hover:text-blue-300 disabled:opacity-60"
              type="button"
              onClick={handleResend}
              disabled={isResending}
            >
              {isResending ? 'Resending…' : 'Resend OTP'}
            </button>
          </p>
          <p>
            Wrong account?{' '}
            <Link to="/login" className="font-medium text-blue-400 hover:text-blue-300">
              Back to sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}

export default OtpVerification


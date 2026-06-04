import { useState, useEffect } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useMutation } from '@tanstack/react-query'
import api from '../api'
import { setUser, getUser } from '../hooks/useAuth'
import ErrorMessage from '../components/ErrorMessage'
import { FaGoogle } from 'react-icons/fa6'

const Login = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [errorMessage, setErrorMessage] = useState('')
  const navigate = useNavigate()
  const location = useLocation()

  const redirect = new URLSearchParams(location.search).get('redirect') || '/'

  useEffect(() => {
    if (getUser()) {
      navigate(redirect)
    }
  }, [navigate, redirect])

  const loginMutation = useMutation({
    mutationFn: async () => {
      const response = await api.post('/users/login', { email, password })
      return response.data
    },
    onSuccess: (data) => {
      setUser(data)
      navigate(redirect)
    },
    onError: (error: unknown) => {
      if (error instanceof Error) setErrorMessage(error.message)
      else setErrorMessage('Invalid credentials. Please try again.')
    }
  })

  const handleGoogle = async () => {
    try {
      const response = await api.get('/users/auth/google')
      window.location.href = response.data.loginLink
    } catch {
      setErrorMessage('Unable to start Google sign-in.')
    }
  }

  return (
    <div className="mx-auto max-w-md space-y-8 py-10">
      <div className="glass-card rounded-[2.5rem] border border-slate-200/10 dark:border-slate-800 p-8 shadow-2xl backdrop-blur-xl">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white font-display">
            Welcome Back
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 max-w-xs mx-auto leading-relaxed">
            Access your bookings history, custom preferences, and saved luxury hotels.
          </p>
        </div>

        {errorMessage && (
          <div className="mt-6">
            <ErrorMessage>{errorMessage}</ErrorMessage>
          </div>
        )}

        <form
          onSubmit={(event) => {
            event.preventDefault()
            loginMutation.mutate()
          }}
          className="mt-8 space-y-4"
        >
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Email Address</label>
            <input
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              type="email"
              placeholder="e.g. arun@example.com"
              required
              className="w-full rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 px-4 py-3.5 text-xs text-slate-850 dark:text-white outline-none focus:border-brand-500"
            />
          </div>

          <div className="space-y-1.5">
            <div className="flex justify-between items-center">
              <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Password</label>
              <span className="text-[10px] font-semibold text-brand-500 dark:text-brand-300 cursor-pointer hover:underline">Forgot?</span>
            </div>
            <input
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              type="password"
              placeholder="••••••••"
              required
              className="w-full rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 px-4 py-3.5 text-xs text-slate-850 dark:text-white outline-none focus:border-brand-500"
            />
          </div>

          <button
            type="submit"
            disabled={loginMutation.status === 'pending'}
            className="w-full mt-2 rounded-2xl bg-brand-500 py-4 text-xs font-bold text-white transition hover:bg-brand-400 hover:scale-102 active:scale-98 shadow-lg shadow-brand-500/15 cursor-pointer"
          >
            {loginMutation.status === 'pending' ? 'Signing you in…' : 'Sign In'}
          </button>
        </form>

        <div className="mt-6 flex flex-col gap-3">
          <div className="relative flex py-2 items-center">
            <div className="flex-grow border-t border-slate-200 dark:border-slate-850"></div>
            <span className="flex-shrink mx-4 text-[10px] uppercase font-bold text-slate-400">or</span>
            <div className="flex-grow border-t border-slate-200 dark:border-slate-850"></div>
          </div>

          <button
            onClick={handleGoogle}
            className="w-full flex items-center justify-center gap-3 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white/5 px-5 py-3.5 text-xs font-bold text-slate-700 dark:text-slate-200 transition hover:border-brand-400 dark:hover:border-brand-400 hover:bg-slate-200/50 dark:hover:bg-slate-900/50 cursor-pointer"
          >
            <FaGoogle className="text-brand-500" />
            <span>Continue with Google</span>
          </button>

          <p className="mt-4 text-center text-xs text-slate-500 dark:text-slate-400">
            New to Traveller?{' '}
            <Link to="/register" className="font-semibold text-brand-500 dark:text-brand-300 hover:underline">
              Create an account
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}

export default Login

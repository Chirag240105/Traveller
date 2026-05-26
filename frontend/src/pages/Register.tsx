import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useMutation } from '@tanstack/react-query'
import api from '../api'
import { setUser, getUser } from '../hooks/useAuth'
import ErrorMessage from '../components/ErrorMessage'

const Register = () => {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [errorMessage, setErrorMessage] = useState('')
  const navigate = useNavigate()

  useEffect(() => {
    if (getUser()) {
      navigate('/')
    }
  }, [navigate])

  const registerMutation = useMutation({
    mutationFn: async () => {
      const response = await api.post('/users', { name, email, password })
      return response.data
    },
    onSuccess: (data) => {
      setUser(data)
      navigate('/')
    },
    onError: (error: unknown) => {
      if (error instanceof Error) setErrorMessage(error.message)
      else setErrorMessage('Unable to register. Please check input values.')
    }
  })

  return (
    <div className="mx-auto max-w-md space-y-8 py-10">
      <div className="glass-card rounded-[2.5rem] border border-slate-200/10 dark:border-slate-800 p-8 shadow-2xl backdrop-blur-xl">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white font-display">
            Create Account
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 max-w-xs mx-auto leading-relaxed">
            Join Traveller today to start booking luxury stays, saving favorites, and tracking trips.
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
            registerMutation.mutate()
          }}
          className="mt-8 space-y-4"
        >
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Full Name</label>
            <input
              value={name}
              onChange={(event) => setName(event.target.value)}
              placeholder="e.g. Arundhati Bala"
              required
              className="w-full rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 px-4 py-3.5 text-xs text-slate-850 dark:text-white outline-none focus:border-brand-500"
            />
          </div>

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
            <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Create Password</label>
            <input
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              type="password"
              placeholder="•••••••• (Min. 6 characters)"
              required
              className="w-full rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 px-4 py-3.5 text-xs text-slate-850 dark:text-white outline-none focus:border-brand-500"
            />
          </div>

          <button
            type="submit"
            disabled={registerMutation.status === 'pending'}
            className="w-full mt-4 rounded-2xl bg-brand-500 py-4 text-xs font-bold text-white transition hover:bg-brand-400 hover:scale-102 active:scale-98 shadow-lg shadow-brand-500/15 cursor-pointer"
          >
            {registerMutation.status === 'pending' ? 'Registering details…' : 'Join Traveller'}
          </button>
        </form>

        <p className="mt-6 text-center text-xs text-slate-500 dark:text-slate-400">
          Already have an account?{' '}
          <Link to="/login" className="font-semibold text-brand-500 dark:text-brand-300 hover:underline">
            Sign In
          </Link>
        </p>
      </div>
    </div>
  )
}

export default Register

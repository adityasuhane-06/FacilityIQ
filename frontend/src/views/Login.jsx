import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { login } from '../stores/authSlice'

const Login = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { loading, error } = useSelector(state => state.auth)

  const handleLogin = async (e) => {
    e.preventDefault()
    const resultAction = await dispatch(login({ email, password }))
    if (login.fulfilled.match(resultAction)) {
      navigate('/')
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 relative">
      <div className="max-w-md w-full space-y-8 bg-white/10 backdrop-blur-xl p-10 rounded-3xl shadow-2xl border border-white/20">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-white tracking-tight">
            Support Ticket System
          </h2>
          <p className="mt-2 text-center text-sm text-gray-300">
            Sign in to access your portal
          </p>
        </div>
        
        <form className="mt-8 space-y-6" onSubmit={handleLogin}>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-200">Email address</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1 appearance-none relative block w-full px-4 py-3 border border-white/20 bg-white/5 placeholder-gray-400 text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors sm:text-sm"
                placeholder="Manager@company.com"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-200">Password</label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-1 appearance-none relative block w-full px-4 py-3 border border-white/20 bg-white/5 placeholder-gray-400 text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors sm:text-sm"
                placeholder="••••••••"
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-xl text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_0_20px_rgba(147,51,234,0.4)]"
            >
              {loading ? 'Authenticating...' : 'Sign in'}
            </button>
          </div>
          
          {error && (
            <div className="mt-4 p-3 rounded-lg bg-red-500/20 border border-red-500/50 text-red-100 text-sm text-center">
              {error}
            </div>
          )}
        </form>

        <div className="mt-8 bg-black/20 rounded-xl p-4 text-sm text-gray-300">
          <p className="font-medium text-white mb-2">Demo Accounts:</p>
          <ul className="space-y-1">
            <li>Manager: manager@company.com</li>
            <li>Technician: tech1@company.com</li>
            <li>Employee: emp1@company.com</li>
          </ul>
          <p className="mt-3 pt-3 border-t border-white/10">Password: <span className="font-mono text-white">password</span></p>
        </div>
      </div>
    </div>
  )
}

export default Login

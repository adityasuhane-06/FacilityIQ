import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { login } from '../stores/authSlice'
import { KeyRound, Mail, Sparkles } from 'lucide-react'

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
    <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 relative font-inter">
      <div className="max-w-md w-full relative z-10 space-y-8 bg-[#0f172a]/40 backdrop-blur-2xl p-10 rounded-[2.5rem] shadow-[0_8px_32px_0_rgba(0,0,0,0.36)] border border-white/10 ring-1 ring-inset ring-white/5">
        
        {/* Glow effect positioned behind the card content */}
        <div className="absolute inset-0 -z-10 bg-gradient-to-br from-blue-500/10 via-purple-500/10 to-transparent rounded-[2.5rem] pointer-events-none mix-blend-overlay"></div>

        <div className="text-center">
          <div className="mx-auto h-14 w-14 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-lg shadow-purple-500/30 mb-6">
             <Sparkles className="w-7 h-7 text-white" />
          </div>
          <h2 className="text-3xl font-bold tracking-tight text-white mb-2">
            FacilityIQ
          </h2>
          <p className="text-sm font-medium text-slate-400">
            Welcome back to the premium support portal
          </p>
        </div>
        
        <form className="mt-8 space-y-6" onSubmit={handleLogin}>
          <div className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Email or Username</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-slate-500" />
                </div>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="block w-full pl-11 pr-4 py-3 border border-white/5 bg-slate-900/50 text-white placeholder-slate-500 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all shadow-inner sm:text-sm"
                  placeholder="manager@company.com"
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Password</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                  <KeyRound className="h-5 w-5 text-slate-500" />
                </div>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full pl-11 pr-4 py-3 border border-white/5 bg-slate-900/50 text-white placeholder-slate-500 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all shadow-inner sm:text-sm"
                  placeholder="••••••••"
                />
              </div>
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className="group relative w-full flex justify-center items-center gap-2 py-3.5 px-4 border border-transparent text-sm font-semibold rounded-xl text-white bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900 focus:ring-blue-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-blue-500/25"
            >
              {loading ? 'Authenticating...' : 'Sign In'}
            </button>
          </div>
          
          {error && (
            <div className="mt-4 p-4 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center gap-3 text-red-400 text-sm font-medium">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
              {error}
            </div>
          )}
        </form>

        <div className="mt-8 bg-slate-900/40 rounded-2xl p-5 border border-white/5 shadow-inner">
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">Demo Credentials</p>
          <ul className="space-y-2 text-sm text-slate-300 font-medium">
            <li className="flex justify-between"><span>Admin</span> <span className="text-white">manager@company.com</span></li>
            <li className="flex justify-between"><span>Tech</span> <span className="text-white">tech1@company.com</span></li>
            <li className="flex justify-between"><span>Staff</span> <span className="text-white">emp1@company.com</span></li>
          </ul>
          <div className="mt-4 pt-4 border-t border-white/5 flex justify-between items-center text-sm font-medium">
             <span className="text-slate-400">Password</span>
             <span className="font-mono bg-white/10 px-2 py-1 rounded text-white text-xs">password</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Login

import React, { useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { checkAuth } from './stores/authSlice'

import Login from './views/Login'
import Dashboard from './views/Dashboard'
import TicketList from './views/TicketList'
import NewTicket from './views/NewTicket'
import TicketDetail from './views/TicketDetail'
import Reports from './views/Reports'
import ThreeBackground from './components/ThreeBackground'

const ProtectedRoute = ({ children, requiredRole }) => {
  const { isAuthenticated, user } = useSelector(state => state.auth)
  
  if (!isAuthenticated) return <Navigate to="/login" replace />
  if (requiredRole && user?.role !== requiredRole) return <Navigate to="/" replace />
  
  return children
}

const App = () => {
  const dispatch = useDispatch()
  
  useEffect(() => {
    dispatch(checkAuth())
  }, [dispatch])

  return (
    <Router>
      <div className="relative min-h-screen text-gray-800 font-sans bg-transparent">
        <ThreeBackground />
        <div className="relative z-10 w-full min-h-screen pb-10">
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
            <Route path="/tickets" element={<ProtectedRoute><TicketList /></ProtectedRoute>} />
            <Route path="/tickets/new" element={<ProtectedRoute><NewTicket /></ProtectedRoute>} />
            <Route path="/tickets/:id" element={<ProtectedRoute><TicketDetail /></ProtectedRoute>} />
            <Route path="/reports" element={<ProtectedRoute requiredRole="MANAGER"><Reports /></ProtectedRoute>} />
          </Routes>
        </div>
      </div>
    </Router>
  )
}

export default App

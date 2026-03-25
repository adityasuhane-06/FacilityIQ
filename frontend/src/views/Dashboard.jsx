import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { logout } from '../stores/authSlice'
import { fetchTickets, fetchStats } from '../stores/ticketSlice'
import { LogOut, Ticket, Activity, Clock, AlertTriangle } from 'lucide-react'

const Dashboard = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { user } = useSelector(state => state.auth)
  const { items: tickets, stats } = useSelector(state => state.tickets)
  // Store a local slice for 5 tickets
  const [recentTickets, setRecentTickets] = useState([])

  useEffect(() => {
    dispatch(fetchStats())
    dispatch(fetchTickets({ size: 5 })).then((action) => {
      if (action.payload) setRecentTickets(action.payload)
    })
  }, [dispatch])

  const handleLogout = () => {
    dispatch(logout())
    navigate('/login')
  }

  const getStatusColor = (status) => {
    const colors = {
      OPEN: 'bg-white/10 text-white border border-white/20',
      ASSIGNED: 'bg-blue-500/20 text-blue-200 border border-blue-500/30',
      IN_PROGRESS: 'bg-yellow-500/20 text-yellow-200 border border-yellow-500/30',
      ESCALATED: 'bg-red-500/20 text-red-200 border border-red-500/30',
      RESOLVED: 'bg-green-500/20 text-green-200 border border-green-500/30',
      CLOSED: 'bg-gray-500/20 text-gray-300 border border-gray-500/30'
    }
    return colors[status] || 'bg-white/10 text-white border border-white/20'
  }

  return (
    <div className="min-h-screen text-white px-4 sm:px-6 lg:px-8 pb-12">
      <nav className="py-6 flex justify-between items-center mb-8 border-b border-white/10 max-w-7xl mx-auto">
        <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600">
          Support Center
        </h1>
        <div className="flex items-center gap-6">
          <div className="flex flex-col items-end">
            <span className="font-medium">{user?.name}</span>
            <span className="text-xs text-purple-300 bg-purple-900/40 px-2 py-0.5 rounded-full">{user?.role}</span>
          </div>
          <button
            onClick={handleLogout}
            className="p-2 bg-red-500/10 hover:bg-red-500/30 text-red-400 rounded-full transition-colors border border-red-500/20"
            title="Logout"
          >
            <LogOut size={20} />
          </button>
        </div>
      </nav>
      
      <div className="max-w-7xl mx-auto space-y-8">
        <div>
          <h2 className="text-3xl font-bold mb-6">Overview</h2>
          
          {stats && (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="bg-white/5 backdrop-blur-md p-6 rounded-2xl border border-white/10 hover:bg-white/10 transition-colors shadow-xl">
                <div className="flex items-center gap-3 text-purple-300 mb-2">
                  <Ticket size={20} />
                  <span className="font-medium text-sm text-gray-300 uppercase tracking-wide">Total Tickets</span>
                </div>
                <div className="text-4xl font-light">{stats.totalTickets}</div>
              </div>
              
              <div className="bg-white/5 backdrop-blur-md p-6 rounded-2xl border border-white/10 hover:bg-white/10 transition-colors shadow-xl">
                <div className="flex items-center gap-3 text-blue-400 mb-2">
                  <Activity size={20} />
                  <span className="font-medium text-sm text-gray-300 uppercase tracking-wide">Open Tickets</span>
                </div>
                <div className="text-4xl font-light">{stats.openTickets}</div>
              </div>
              
              <div className="bg-white/5 backdrop-blur-md p-6 rounded-2xl border border-white/10 hover:bg-white/10 transition-colors shadow-xl relative overflow-hidden">
                <div className="flex items-center gap-3 text-red-400 mb-2">
                  <AlertTriangle size={20} />
                  <span className="font-medium text-sm text-gray-300 uppercase tracking-wide">SLA Breach Rate</span>
                </div>
                <div className="text-4xl font-light">{stats.slaBreachRate?.toFixed(1) || 0}%</div>
                <div className="absolute inset-0 bg-red-500/5 mix-blend-overlay"></div>
              </div>
              
              <div className="bg-white/5 backdrop-blur-md p-6 rounded-2xl border border-white/10 hover:bg-white/10 transition-colors shadow-xl">
                <div className="flex items-center gap-3 text-green-400 mb-2">
                  <Clock size={20} />
                  <span className="font-medium text-sm text-gray-300 uppercase tracking-wide">Resolution Time</span>
                </div>
                <div className="text-4xl font-light">{stats.avgResolutionTimeHours?.toFixed(1) || 0} <span className="text-xl">hrs</span></div>
              </div>
            </div>
          )}
        </div>
        
        <div className="flex flex-wrap gap-4">
          <Link
            to="/tickets"
            className="px-6 py-3 bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 text-white rounded-xl shadow-lg transition-all"
          >
            View All Tickets
          </Link>
          
          {(user?.role === 'EMPLOYEE' || user?.role === 'MANAGER') && (
            <Link
              to="/tickets/new"
              className="px-6 py-3 bg-purple-600/80 hover:bg-purple-600 backdrop-blur-md border border-purple-500/50 text-white rounded-xl shadow-[0_0_15px_rgba(147,51,234,0.3)] transition-all"
            >
              Create New Ticket
            </Link>
          )}
          
          {user?.role === 'MANAGER' && (
            <Link
              to="/reports"
              className="px-6 py-3 bg-pink-600/80 hover:bg-pink-600 backdrop-blur-md border border-pink-500/50 text-white rounded-xl shadow-[0_0_15px_rgba(219,39,119,0.3)] transition-all"
            >
              View Reports
            </Link>
          )}
        </div>
        
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl p-6 md:p-8">
          <h3 className="text-xl font-medium mb-6 flex items-center gap-2">
            <Activity size={24} className="text-purple-400"/> Recent Activity
          </h3>
          <div className="flex flex-col gap-3">
            {recentTickets.length > 0 ? (
              recentTickets.map(ticket => (
                <div
                  key={ticket.id}
                  onClick={() => navigate(`/tickets/${ticket.id}`)}
                  className="group flex flex-col sm:flex-row justify-between sm:items-center p-4 rounded-xl bg-white/5 hover:bg-white/10 border border-transparent hover:border-white/10 transition-colors cursor-pointer"
                >
                  <div className="mb-3 sm:mb-0">
                    <div className="font-semibold text-lg text-white group-hover:text-purple-300 transition-colors">{ticket.title}</div>
                    <div className="text-sm text-gray-400 mt-1 flex gap-3">
                      <span>{ticket.category}</span>
                      <span className="text-gray-600">•</span>
                      <span>{ticket.priority}</span>
                    </div>
                  </div>
                  <div className="shrink-0">
                    <span className={`px-4 py-1.5 rounded-full text-xs font-medium uppercase tracking-wider ${getStatusColor(ticket.status)}`}>
                      {ticket.status}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-10 text-gray-400 bg-white/5 rounded-xl border border-white/5">
                No recent tickets found.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard

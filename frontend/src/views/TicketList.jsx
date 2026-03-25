import React, { useEffect, useState, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { fetchTickets } from '../stores/ticketSlice'
import { ArrowLeft, Search, Filter } from 'lucide-react'

const TicketList = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { items: tickets, loading } = useSelector(state => state.tickets)
  
  const [filters, setFilters] = useState({
    category: '',
    priority: '',
    status: '',
    search: ''
  })

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      const params = {}
      if (filters.category) params.category = filters.category
      if (filters.priority) params.priority = filters.priority
      if (filters.status) params.status = filters.status
      if (filters.search) params.search = filters.search
      
      dispatch(fetchTickets(params))
    }, 300)
    
    return () => clearTimeout(timer)
  }, [filters, dispatch])

  const getStatusColor = (status) => {
    const colors = {
      OPEN: 'bg-white/10 text-white border-white/20',
      ASSIGNED: 'bg-blue-500/20 text-blue-200 border-blue-500/30',
      IN_PROGRESS: 'bg-yellow-500/20 text-yellow-200 border-yellow-500/30',
      ESCALATED: 'bg-red-500/20 text-red-200 border-red-500/30',
      RESOLVED: 'bg-green-500/20 text-green-200 border-green-500/30',
      CLOSED: 'bg-gray-500/20 text-gray-300 border-gray-500/30'
    }
    return colors[status] || 'bg-white/10 text-white border-white/20'
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    const now = new Date()
    const diff = now - date
    const hours = Math.floor(diff / 3600000)
    
    if (hours < 1) return 'just now'
    if (hours < 24) return `${hours}h ago`
    const days = Math.floor(hours / 24)
    return `${days}d ago`
  }

  return (
    <div className="min-h-screen text-white px-4 sm:px-6 lg:px-8 pb-12">
      <nav className="py-6 mb-8 border-b border-white/10 max-w-7xl mx-auto flex items-center">
        <button 
          onClick={() => navigate('/')} 
          className="flex items-center gap-2 text-purple-300 hover:text-purple-100 transition-colors bg-white/5 hover:bg-white/10 px-4 py-2 rounded-xl backdrop-blur-md border border-white/10"
        >
          <ArrowLeft size={18} /> Dashboard
        </button>
      </nav>
      
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600">
          All Tickets
        </h1>
        
        <div className="bg-white/5 backdrop-blur-xl rounded-2xl shadow-xl border border-white/10 p-6 mb-8 relative z-10">
          <div className="flex items-center gap-2 text-purple-300 mb-4">
            <Filter size={20} /> <span className="font-semibold">Filters</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <select 
              value={filters.category} 
              onChange={e => setFilters({...filters, category: e.target.value})}
              className="bg-black/40 border border-white/20 text-white rounded-xl px-4 py-3 focus:ring-2 focus:ring-purple-500 outline-none appearance-none"
            >
              <option value="" className="text-black">All Categories</option>
              <option value="BILLING" className="text-black">Billing</option>
              <option value="TECHNICAL" className="text-black">Technical</option>
              <option value="ACCOUNT" className="text-black">Account</option>
              <option value="GENERAL" className="text-black">General</option>
              <option value="INFRASTRUCTURE" className="text-black">Infrastructure</option>
              <option value="HVAC" className="text-black">HVAC</option>
            </select>
            
            <select 
              value={filters.priority}
              onChange={e => setFilters({...filters, priority: e.target.value})}
              className="bg-black/40 border border-white/20 text-white rounded-xl px-4 py-3 focus:ring-2 focus:ring-purple-500 outline-none appearance-none"
            >
              <option value="" className="text-black">All Priorities</option>
              <option value="LOW" className="text-black">Low</option>
              <option value="MEDIUM" className="text-black">Medium</option>
              <option value="HIGH" className="text-black">High</option>
              <option value="CRITICAL" className="text-black">Critical</option>
            </select>
            
            <select 
              value={filters.status}
              onChange={e => setFilters({...filters, status: e.target.value})}
              className="bg-black/40 border border-white/20 text-white rounded-xl px-4 py-3 focus:ring-2 focus:ring-purple-500 outline-none appearance-none"
            >
              <option value="" className="text-black">All Statuses</option>
              <option value="OPEN" className="text-black">Open</option>
              <option value="ASSIGNED" className="text-black">Assigned</option>
              <option value="IN_PROGRESS" className="text-black">In Progress</option>
              <option value="ESCALATED" className="text-black">Escalated</option>
              <option value="RESOLVED" className="text-black">Resolved</option>
              <option value="CLOSED" className="text-black">Closed</option>
            </select>
            
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                <Search size={18} />
              </div>
              <input
                type="text"
                placeholder="Search..."
                value={filters.search}
                onChange={e => setFilters({...filters, search: e.target.value})}
                className="bg-black/40 border border-white/20 text-white rounded-xl pl-10 pr-4 py-3 w-full focus:ring-2 focus:ring-purple-500 outline-none placeholder-gray-400"
              />
            </div>
          </div>
        </div>
        
        <div className="bg-white/5 backdrop-blur-xl rounded-2xl shadow-xl border border-white/10 overflow-hidden relative z-10">
          {loading ? (
            <div className="p-12 text-center text-gray-300 animate-pulse">
              Loading tickets...
            </div>
          ) : tickets.length === 0 ? (
            <div className="p-12 text-center text-gray-400">
              No tickets found
            </div>
          ) : (
            <div className="divide-y divide-white/10">
              {tickets.map(ticket => (
                <div
                  key={ticket.id}
                  onClick={() => navigate(`/tickets/${ticket.id}`)}
                  className="p-6 hover:bg-white/10 transition-colors cursor-pointer group"
                >
                  <div className="flex flex-col sm:flex-row justify-between sm:items-start gap-4">
                    <div className="flex-1">
                      <div className="flex flex-wrap items-center gap-3 mb-1">
                        <span className="font-mono bg-white/10 px-2 py-0.5 rounded text-sm text-gray-300">
                          #{ticket.id}
                        </span>
                        <span className="font-semibold text-lg text-white group-hover:text-purple-300 transition-colors">
                          {ticket.title}
                        </span>
                        {ticket.breachedAt && (
                          <span className="text-red-400 text-xs px-2 py-1 bg-red-500/10 border border-red-500/20 rounded-full flex items-center gap-1">
                            ⚠️ SLA Breach
                          </span>
                        )}
                      </div>
                      <div className="text-sm text-gray-400 flex flex-wrap gap-x-2 gap-y-1 items-center mt-2">
                        <span className="bg-white/5 px-2 py-0.5 rounded-md border border-white/10">{ticket.category}</span>
                        <span>•</span>
                        <span className="bg-white/5 px-2 py-0.5 rounded-md border border-white/10">{ticket.priority}</span>
                        <span>•</span>
                        <span>Created {formatDate(ticket.createdAt)}</span>
                        {ticket.assignedTo && (
                          <>
                            <span>•</span>
                            <span>Assigned to <span className="text-purple-300">{ticket.assignedTo.name}</span></span>
                          </>
                        )}
                      </div>
                    </div>
                    <div>
                      <span className={`px-4 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider border ${getStatusColor(ticket.status)}`}>
                        {ticket.status}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default TicketList

import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { fetchStats } from '../stores/ticketSlice'
import { ArrowLeft, BarChart3, PieChart, Users, TrendingUp } from 'lucide-react'

const Reports = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const [stats, setStats] = useState(null)

  useEffect(() => {
    dispatch(fetchStats()).then(action => {
      if (action.payload) setStats(action.payload)
    })
  }, [dispatch])

  if (!stats) {
    return (
      <div className="min-h-screen pt-24 text-center text-white/50 animate-pulse">
        Loading reports...
      </div>
    )
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
      
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex items-center gap-3 mb-8">
          <BarChart3 size={32} className="text-purple-400" />
          <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600">
            Reports & Analytics
          </h1>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div className="bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/10 flex items-center gap-4 hover:bg-white/10 transition-colors">
            <div className="p-4 bg-blue-500/20 text-blue-300 rounded-xl">
              <TrendingUp size={24} />
            </div>
            <div>
              <div className="text-sm text-gray-400 mb-1">Avg Tickets Per Day</div>
              <div className="text-3xl font-bold">{stats.avgTicketsPerDay?.toFixed(1) || 0}</div>
            </div>
          </div>
          
          <div className="bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/10 flex items-center gap-4 hover:bg-white/10 transition-colors">
            <div className="p-4 bg-green-500/20 text-green-300 rounded-xl">
              <Clock size={24} />
            </div>
            <div>
              <div className="text-sm text-gray-400 mb-1">Avg Resolution Time</div>
              <div className="text-3xl font-bold">{stats.avgResolutionTimeHours?.toFixed(1) || 0}h</div>
            </div>
          </div>
          
          <div className="bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/10 flex items-center gap-4 hover:bg-white/10 transition-colors">
            <div className="p-4 bg-purple-500/20 text-purple-300 rounded-xl">
              <Sparkles size={24} />
            </div>
            <div>
              <div className="text-sm text-gray-400 mb-1">LLM Override Rate</div>
              <div className="text-3xl font-bold">{stats.llmOverrideRate?.toFixed(1) || 0}%</div>
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white/5 backdrop-blur-xl rounded-2xl shadow-xl border border-white/10 p-6 relative z-10">
            <h3 className="font-medium text-lg mb-6 flex items-center gap-2 border-b border-white/10 pb-4">
              <PieChart size={20} className="text-pink-400" /> Priority Breakdown
            </h3>
            <div className="space-y-3">
              {stats.priorityBreakdown && Object.entries(stats.priorityBreakdown).map(([priority, count]) => (
                <div key={priority} className="flex items-center justify-between p-3 bg-white/5 hover:bg-white/10 rounded-lg transition-colors border border-transparent hover:border-white/10">
                  <span className="font-medium text-gray-300">{priority}</span>
                  <span className="font-bold bg-white/10 w-8 h-8 flex items-center justify-center rounded-full text-white">{count}</span>
                </div>
              ))}
            </div>
          </div>
          
          <div className="bg-white/5 backdrop-blur-xl rounded-2xl shadow-xl border border-white/10 p-6 relative z-10">
            <h3 className="font-medium text-lg mb-6 flex items-center gap-2 border-b border-white/10 pb-4">
              <PieChart size={20} className="text-blue-400" /> Category Breakdown
            </h3>
            <div className="space-y-3">
              {stats.categoryBreakdown && Object.entries(stats.categoryBreakdown).map(([category, count]) => (
                <div key={category} className="flex items-center justify-between p-3 bg-white/5 hover:bg-white/10 rounded-lg transition-colors border border-transparent hover:border-white/10">
                  <span className="font-medium text-gray-300">{category}</span>
                  <span className="font-bold bg-white/10 w-8 h-8 flex items-center justify-center rounded-full text-white">{count}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
        
        <div className="bg-white/5 backdrop-blur-xl rounded-2xl shadow-xl border border-white/10 overflow-hidden relative z-10">
          <div className="p-6 border-b border-white/10">
            <h3 className="font-medium text-lg flex items-center gap-2">
              <Users size={20} className="text-green-400" /> Technician Workload
            </h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-black/20 border-b border-white/10">
                  <th className="py-4 px-6 font-medium text-gray-400">Technician</th>
                  <th className="py-4 px-6 font-medium text-gray-400 text-right">Open Tickets</th>
                  <th className="py-4 px-6 font-medium text-gray-400 text-right">Breached Tickets</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {stats.technicianWorkload && stats.technicianWorkload.map(tech => (
                  <tr key={tech.name} className="hover:bg-white/5 transition-colors">
                    <td className="py-4 px-6 font-medium">{tech.name}</td>
                    <td className="py-4 px-6 text-right">
                      <span className="bg-blue-500/10 text-blue-300 px-3 py-1 rounded-full text-sm font-semibold border border-blue-500/20">
                        {tech.openTickets}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-right">
                      {tech.breachedTickets > 0 ? (
                        <span className="bg-red-500/10 text-red-300 px-3 py-1 rounded-full text-sm font-semibold border border-red-500/20">
                          {tech.breachedTickets}
                        </span>
                      ) : (
                        <span className="bg-white/5 text-gray-400 px-3 py-1 rounded-full text-sm border border-white/10">
                          0
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}

// Simple clock internal component since we imported it but it was missing from lucide-react destructure
const Clock = ({size}) => <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>

export default Reports

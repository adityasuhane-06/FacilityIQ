import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { fetchTicket } from '../stores/ticketSlice'
import { ArrowLeft, Sparkles, AlertTriangle, MessageSquare, Clock } from 'lucide-react'

const TicketDetail = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const [ticket, setTicket] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    dispatch(fetchTicket(id)).then((action) => {
      setLoading(false)
      if (action.payload) {
        setTicket(action.payload)
      }
    })
  }, [dispatch, id])

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
    return new Date(dateString).toLocaleString()
  }

  if (loading) {
    return (
      <div className="min-h-screen pt-24 text-center text-white/50 animate-pulse">
        Loading ticket details...
      </div>
    )
  }

  if (!ticket) {
    return (
      <div className="min-h-screen pt-24 text-center text-white/50">
        Ticket not found.
      </div>
    )
  }

  return (
    <div className="min-h-screen text-white px-4 sm:px-6 lg:px-8 pb-12">
      <nav className="py-6 mb-8 border-b border-white/10 max-w-5xl mx-auto flex items-center">
        <button 
          onClick={() => navigate(-1)} 
          className="flex items-center gap-2 text-purple-300 hover:text-purple-100 transition-colors bg-white/5 hover:bg-white/10 px-4 py-2 rounded-xl backdrop-blur-md border border-white/10"
        >
          <ArrowLeft size={18} /> Back to Tickets
        </button>
      </nav>
      
      <div className="max-w-5xl mx-auto space-y-6">
        <div className="bg-white/5 backdrop-blur-xl rounded-2xl shadow-xl border border-white/10 p-6 md:p-8 relative z-10">
          <div className="flex flex-col md:flex-row justify-between md:items-start gap-4 mb-8">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold mb-2">{ticket.title}</h1>
              <div className="flex flex-wrap items-center gap-2 text-gray-400 text-sm">
                <span className="bg-white/10 px-2 py-0.5 rounded font-mono text-gray-300 border border-white/10">#{ticket.id}</span>
                <span>•</span>
                <span className="flex items-center gap-1"><Clock size={14} /> {formatDate(ticket.createdAt)}</span>
              </div>
            </div>
            <div className="shrink-0 flex items-center gap-3">
              <span className={`px-4 py-1.5 rounded-full text-sm font-semibold uppercase tracking-wider border ${getStatusColor(ticket.status)}`}>
                {ticket.status}
              </span>
            </div>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 bg-black/20 rounded-xl p-5 mb-8 border border-white/5">
            <div>
              <div className="text-sm text-gray-400 mb-1">Category</div>
              <div className="font-semibold">{ticket.category}</div>
            </div>
            <div>
              <div className="text-sm text-gray-400 mb-1">Priority</div>
              <div className="font-semibold">{ticket.priority}</div>
            </div>
            <div>
              <div className="text-sm text-gray-400 mb-1">Raised By</div>
              <div className="font-semibold">{ticket.raisedBy?.name}</div>
            </div>
            <div>
              <div className="text-sm text-gray-400 mb-1">Assigned To</div>
              <div className="font-semibold">{ticket.assignedTo?.name || <span className="text-gray-500 italic">Unassigned</span>}</div>
            </div>
          </div>
          
          <div className="mb-8">
            <div className="text-sm text-gray-400 mb-3 border-b border-white/10 pb-2">Description</div>
            <div className="text-gray-200 whitespace-pre-line leading-relaxed bg-white/5 rounded-xl p-5 border border-white/5">
              {ticket.description}
            </div>
          </div>
          
          {ticket.breachedAt && (
            <div className="p-5 bg-red-500/10 border border-red-500/30 rounded-xl mb-8 flex items-start gap-3">
              <AlertTriangle className="text-red-400 shrink-0" size={24} />
              <div>
                <div className="text-red-300 font-semibold mb-1">SLA Breach</div>
                <div className="text-sm text-red-200/80">
                  This ticket breached SLA at {formatDate(ticket.breachedAt)}
                </div>
              </div>
            </div>
          )}
          
          {ticket.suggestedCategory && (
            <div className="p-5 md:p-6 bg-purple-500/10 border border-purple-500/30 rounded-xl mb-6">
              <div className="flex items-center gap-2 text-purple-300 font-medium mb-4 pb-2 border-b border-purple-500/20">
                <Sparkles size={18} /> AI Suggestions & Analysis
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm mb-4">
                <div className="space-y-1">
                  <div className="text-purple-300/70">Suggested Category</div>
                  <div className="font-medium text-white flex items-center gap-2">
                    {ticket.suggestedCategory}
                    {ticket.category !== ticket.suggestedCategory && (
                      <span className="text-orange-400 text-xs bg-orange-500/10 px-2 py-0.5 rounded border border-orange-500/20">
                        Overridden to {ticket.category}
                      </span>
                    )}
                  </div>
                </div>
                <div className="space-y-1">
                  <div className="text-purple-300/70">Suggested Priority</div>
                  <div className="font-medium text-white flex items-center gap-2">
                    {ticket.suggestedPriority}
                    {ticket.priority !== ticket.suggestedPriority && (
                      <span className="text-orange-400 text-xs bg-orange-500/10 px-2 py-0.5 rounded border border-orange-500/20">
                        Overridden to {ticket.priority}
                      </span>
                    )}
                  </div>
                </div>
              </div>
              
              {ticket.suggestedResolutionSteps && (
                <div className="mt-4 pt-4 border-t border-purple-500/20">
                  <div className="text-purple-300/70 text-sm mb-2">Suggested Resolution Steps</div>
                  <div className="text-sm text-purple-100 whitespace-pre-line leading-relaxed bg-black/20 p-4 rounded-lg border border-purple-500/10">
                    {ticket.suggestedResolutionSteps}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
        
        <div className="bg-white/5 backdrop-blur-xl rounded-2xl shadow-xl border border-white/10 p-6 md:p-8 relative z-10">
          <h2 className="text-xl font-medium mb-6 flex items-center gap-2 border-b border-white/10 pb-4">
            <MessageSquare size={20} className="text-purple-400" /> Activity Log
          </h2>
          <div className="text-center py-12 text-gray-500 bg-black/20 rounded-xl border border-white/5 border-dashed">
            Comments and audit log would appear here
          </div>
        </div>
      </div>
    </div>
  )
}

export default TicketDetail

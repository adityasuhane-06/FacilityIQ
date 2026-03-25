import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { classifyTicket, createTicket } from '../stores/ticketSlice'
import { ArrowLeft, Sparkles, Send } from 'lucide-react'

const NewTicket = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  
  const [form, setForm] = useState({
    title: '',
    description: '',
    category: '',
    priority: '',
    llmOverridden: false
  })
  
  const [aiSuggestion, setAiSuggestion] = useState(null)
  const [classifying, setClassifying] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  const handleDescriptionBlur = () => {
    if (!form.description || form.description.length < 20) return
    
    setClassifying(true)
    dispatch(classifyTicket(form.description)).then((action) => {
      setClassifying(false)
      if (action.payload) {
        const result = action.payload
        setAiSuggestion(result)
        
        setForm(prev => {
          const next = { ...prev }
          if (!prev.category && result.suggestedCategory) {
            next.category = result.suggestedCategory.toUpperCase()
          }
          if (!prev.priority && result.suggestedPriority) {
            next.priority = result.suggestedPriority.toUpperCase()
          }
          return next
        })
      }
    })
  }

  const handleCategoryChange = (e) => {
    const val = e.target.value
    setForm(prev => ({
      ...prev,
      category: val,
      llmOverridden: !!(aiSuggestion && val !== aiSuggestion.suggestedCategory?.toUpperCase()) || prev.llmOverridden
    }))
  }

  const handlePriorityChange = (e) => {
    const val = e.target.value
    setForm(prev => ({
      ...prev,
      priority: val,
      llmOverridden: !!(aiSuggestion && val !== aiSuggestion.suggestedPriority?.toUpperCase()) || prev.llmOverridden
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSubmitting(true)
    
    const ticketData = {
      ...form,
      suggestedCategory: aiSuggestion?.suggestedCategory?.toUpperCase(),
      suggestedPriority: aiSuggestion?.suggestedPriority?.toUpperCase(),
      suggestedResolutionSteps: aiSuggestion?.suggestedResolutionSteps,
      estimatedComplexity: aiSuggestion?.estimatedComplexity?.toUpperCase(),
    }
    
    const resultAction = await dispatch(createTicket(ticketData))
    setSubmitting(false)
    if (createTicket.fulfilled.match(resultAction)) {
      navigate('/tickets')
    } else {
      alert('Failed to create ticket')
    }
  }

  return (
    <div className="min-h-screen text-white px-4 sm:px-6 lg:px-8 pb-12">
      <nav className="py-6 mb-8 border-b border-white/10 max-w-3xl mx-auto flex items-center">
        <button 
          onClick={() => navigate(-1)} 
          className="flex items-center gap-2 text-purple-300 hover:text-purple-100 transition-colors bg-white/5 hover:bg-white/10 px-4 py-2 rounded-xl backdrop-blur-md border border-white/10"
        >
          <ArrowLeft size={18} /> Back
        </button>
      </nav>
      
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600">
          Create New Ticket
        </h1>
        
        <form onSubmit={handleSubmit} className="bg-white/5 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/10 p-6 md:p-8 relative z-10">
          <div className="space-y-6">
            <div>
              <label className="block text-gray-300 mb-2 font-medium">Title *</label>
              <div className="relative">
                <input
                  type="text"
                  required
                  maxLength="200"
                  value={form.title}
                  onChange={e => setForm({...form, title: e.target.value})}
                  className="w-full bg-black/40 border border-white/20 text-white rounded-xl px-4 py-3 focus:ring-2 focus:ring-purple-500 outline-none"
                  placeholder="Summarize your request..."
                />
                <div className="absolute right-3 top-3 text-xs text-gray-500">
                  {form.title.length}/200
                </div>
              </div>
            </div>
            
            <div>
              <label className="block text-gray-300 mb-2 font-medium">Description *</label>
              <textarea
                required
                rows="5"
                value={form.description}
                onChange={e => setForm({...form, description: e.target.value})}
                onBlur={handleDescriptionBlur}
                className="w-full bg-black/40 border border-white/20 text-white rounded-xl px-4 py-3 focus:ring-2 focus:ring-purple-500 outline-none resize-none"
                placeholder="Provide detailed information about the issue. AI will analyze this for category mapping..."
              ></textarea>
            </div>
            
            {classifying && (
              <div className="flex items-center gap-2 text-purple-400 bg-purple-500/10 border border-purple-500/20 px-4 py-3 rounded-xl animate-pulse">
                <Sparkles size={18} /> <span>AI is analyzing your ticket...</span>
              </div>
            )}
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-gray-300 mb-2 font-medium">Category *</label>
                <select
                  required
                  value={form.category}
                  onChange={handleCategoryChange}
                  className="w-full bg-black/40 border border-white/20 text-white rounded-xl px-4 py-3 focus:ring-2 focus:ring-purple-500 outline-none appearance-none"
                >
                  <option value="" className="text-black">Select category...</option>
                  <option value="BILLING" className="text-black">Billing</option>
                  <option value="TECHNICAL" className="text-black">Technical</option>
                  <option value="ACCOUNT" className="text-black">Account</option>
                  <option value="GENERAL" className="text-black">General</option>
                  <option value="INFRASTRUCTURE" className="text-black">Infrastructure</option>
                  <option value="HVAC" className="text-black">HVAC</option>
                </select>
                {aiSuggestion?.suggestedCategory && (
                  <div className="text-xs text-green-400 mt-2 flex items-center gap-1 bg-green-500/10 inline-block px-2 py-1 rounded-md">
                    <Sparkles size={12} /> AI suggested: {aiSuggestion.suggestedCategory}
                  </div>
                )}
              </div>
              
              <div>
                <label className="block text-gray-300 mb-2 font-medium">Priority *</label>
                <select
                  required
                  value={form.priority}
                  onChange={handlePriorityChange}
                  className="w-full bg-black/40 border border-white/20 text-white rounded-xl px-4 py-3 focus:ring-2 focus:ring-purple-500 outline-none appearance-none"
                >
                  <option value="" className="text-black">Select priority...</option>
                  <option value="LOW" className="text-black">Low</option>
                  <option value="MEDIUM" className="text-black">Medium</option>
                  <option value="HIGH" className="text-black">High</option>
                  <option value="CRITICAL" className="text-black">Critical</option>
                </select>
                {aiSuggestion?.suggestedPriority && (
                  <div className="text-xs text-green-400 mt-2 flex items-center gap-1 bg-green-500/10 inline-block px-2 py-1 rounded-md">
                    <Sparkles size={12} /> AI suggested: {aiSuggestion.suggestedPriority}
                  </div>
                )}
              </div>
            </div>
            
            {aiSuggestion?.suggestedResolutionSteps && (
              <div className="bg-blue-500/10 border border-blue-500/30 rounded-xl p-5">
                <div className="flex items-center gap-2 text-blue-300 font-medium mb-3">
                  <Sparkles size={18} /> AI Suggested Resolution Steps:
                </div>
                <div className="text-sm text-blue-100 whitespace-pre-line leading-relaxed pl-7">
                  {aiSuggestion.suggestedResolutionSteps}
                </div>
              </div>
            )}
            
            <div className="pt-4">
              <button
                type="submit"
                disabled={submitting}
                className="w-full flex justify-center items-center gap-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white py-4 rounded-xl font-bold transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {submitting ? (
                  <span className="animate-pulse">Creating Ticket...</span>
                ) : (
                  <>Create Ticket <Send size={18} /></>
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}

export default NewTicket

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import axios from '../utils/axios'

export const fetchTickets = createAsyncThunk('tickets/fetchTickets', async (filters = {}) => {
    const response = await axios.get('/api/v1/tickets', { params: filters })
    return response.data.data.content
})

export const fetchTicket = createAsyncThunk('tickets/fetchTicket', async (id) => {
    const response = await axios.get(`/api/v1/tickets/${id}`)
    return response.data.data
})

export const fetchStats = createAsyncThunk('tickets/fetchStats', async () => {
    const response = await axios.get('/api/v1/tickets/stats')
    return response.data.data
})

export const createTicket = createAsyncThunk('tickets/createTicket', async (ticketData) => {
    const response = await axios.post('/api/v1/tickets', ticketData)
    return response.data.data
})

export const updateTicket = createAsyncThunk('tickets/updateTicket', async ({ id, updates }) => {
    const response = await axios.patch(`/api/v1/tickets/${id}`, updates)
    return response.data.data
})

export const classifyTicket = createAsyncThunk('tickets/classifyTicket', async (description) => {
    const response = await axios.post('/api/v1/tickets/classify', { description })
    return response.data.data
})

const ticketSlice = createSlice({
    name: 'tickets',
    initialState: {
        items: [],
        currentTicket: null,
        stats: null,
        loading: false,
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchTickets.pending, (state) => {
                state.loading = true
            })
            .addCase(fetchTickets.fulfilled, (state, action) => {
                state.loading = false
                state.items = action.payload || []
            })
            .addCase(fetchTickets.rejected, (state) => {
                state.loading = false
            })
            .addCase(fetchTicket.pending, (state) => {
                state.loading = true
            })
            .addCase(fetchTicket.fulfilled, (state, action) => {
                state.loading = false
                state.currentTicket = action.payload
            })
            .addCase(fetchTicket.rejected, (state) => {
                state.loading = false
            })
            .addCase(fetchStats.fulfilled, (state, action) => {
                state.stats = action.payload
            })
    }
})

export default ticketSlice.reducer

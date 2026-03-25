import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import axios from '../utils/axios'

export const login = createAsyncThunk('auth/login', async ({ email, password }, { rejectWithValue }) => {
    try {
        const response = await axios.post('/api/v1/auth/login', { email, password })
        if (response.data.success) {
            axios.defaults.headers.common['Authorization'] = `Bearer ${response.data.data.token}`
            return response.data.data
        }
        return rejectWithValue('Login failed')
    } catch (error) {
        return rejectWithValue(error.response?.data?.message || 'Login failed')
    }
})

export const logout = createAsyncThunk('auth/logout', async (_, { rejectWithValue }) => {
    try {
        await axios.post('/api/v1/auth/logout')
        delete axios.defaults.headers.common['Authorization']
        return null
    } catch (error) {
        return rejectWithValue(error.response?.data?.message || 'Logout failed')
    }
})

const authSlice = createSlice({
    name: 'auth',
    initialState: {
        token: null,
        user: null,
        isAuthenticated: false,
        loading: false,
        error: null,
    },
    reducers: {
        checkAuth: (state) => {
            // memory only setup, similar to vue pinia architecture.
        },
        clearAuth: (state) => {
            state.token = null
            state.user = null
            state.isAuthenticated = false
            delete axios.defaults.headers.common['Authorization']
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(login.pending, (state) => {
                state.loading = true
                state.error = null
            })
            .addCase(login.fulfilled, (state, action) => {
                state.loading = false
                state.token = action.payload.token
                state.user = action.payload.user
                state.isAuthenticated = true
            })
            .addCase(login.rejected, (state, action) => {
                state.loading = false
                state.error = action.payload
            })
            .addCase(logout.fulfilled, (state) => {
                state.token = null
                state.user = null
                state.isAuthenticated = false
            })
    }
})

export const { checkAuth, clearAuth } = authSlice.actions
export default authSlice.reducer

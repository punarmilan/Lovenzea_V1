import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { adminAuthService } from '../services/adminAuthService';

let storedAdmin = null;
try {
  const raw = localStorage.getItem('adminData');
  if (raw) {
    storedAdmin = JSON.parse(raw);
  }
} catch (e) {
  storedAdmin = null;
}

export const adminLogin = createAsyncThunk(
  'adminAuth/login',
  async ({ email, password }, { rejectWithValue }) => {
    try {
      const data = await adminAuthService.login(email, password);
      return data;
    } catch (error) {
      const message = error.response?.data?.message || error.response?.data || error.message || 'Login failed';
      return rejectWithValue(typeof message === 'string' ? message : JSON.stringify(message));
    }
  }
);

const adminAuthSlice = createSlice({
  name: 'adminAuth',
  initialState: {
    admin: storedAdmin,
    loading: false,
    error: null,
  },
  reducers: {
    adminLogout: (state) => {
      state.admin = null;
      state.error = null;
      adminAuthService.logout();
    },
    updateAdminProfile: (state, action) => {
      state.admin = { ...state.admin, ...action.payload };
      localStorage.setItem('adminData', JSON.stringify(state.admin));
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(adminLogin.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(adminLogin.fulfilled, (state, action) => {
        state.loading = false;
        state.admin = action.payload;
        state.error = null;
      })
      .addCase(adminLogin.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { adminLogout, updateAdminProfile } = adminAuthSlice.actions;
export default adminAuthSlice.reducer;

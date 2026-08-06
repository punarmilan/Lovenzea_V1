import { configureStore } from '@reduxjs/toolkit';
import adminAuthReducer from './adminAuthSlice';

export const store = configureStore({
  reducer: {
    adminAuth: adminAuthReducer,
  },
  devTools: process.env.NODE_ENV !== 'production',
});

export default store;

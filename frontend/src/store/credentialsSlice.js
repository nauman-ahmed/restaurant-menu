import { createSlice } from '@reduxjs/toolkit';

// Helper function to get initial credentials from localStorage
const loadCredentialsFromLocalStorage = () => {
  const savedCredentials = localStorage.getItem('credentials');
  return savedCredentials ? JSON.parse(savedCredentials) : null;
};

const initialState = {
  credentials: loadCredentialsFromLocalStorage(), // Initialize from localStorage
};

const credentialsSlice = createSlice({
  name: 'credentials',
  initialState,
  reducers: {
    setCredentials: (state, action) => {
      const { email, role, _id } = action.payload;
      state.credentials = { email, role, _id };

      // Save to localStorage
      localStorage.setItem(
        'credentials',
        JSON.stringify({ email, role, _id })
      );
    },
    clearCredentials: (state) => {
      state.credentials = null;

      // Remove from localStorage
      localStorage.removeItem('credentials');
    },
  },
});

export const { setCredentials, clearCredentials } = credentialsSlice.actions;

export default credentialsSlice.reducer;

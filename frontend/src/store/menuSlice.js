import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { getMenuRequestBody } from '../graphQlSchema/menu';
import { formatDate } from '../utilities';

const backendUrl = import.meta.env.VITE_BACKEND_URL;

export const scrapeMenus = createAsyncThunk('menu/scrapeMenus', async () => {
  const response = await axios.get(backendUrl + '/scrape', {
    params: {
      date: formatDate(new Date()),
    }
  }) 
  return response.data;
});

export const fetchMenus = createAsyncThunk('menu/fetchMenus', async () => {
  const requestBody = getMenuRequestBody()
  const response = await axios.post(
      backendUrl + "/graphql", 
      JSON.stringify(requestBody),
      {
          headers: {
              "Content-Type": "application/json"
          }
      }
  );
  return response.data.data.getAllMenus
});

const menuSlice = createSlice({
  name: 'menus',
  initialState: {
    loading: false,
    menus: [],
    error: ''
  },
  reducers: {
  },
  extraReducers: (builder) => {
    builder
      .addCase(scrapeMenus.pending, (state) => {
        state.loading = true;
      })
      .addCase(scrapeMenus.fulfilled, (state, action) => {
        state.loading = false;
        state.menus = action.payload;
        state.error = '';
      })
      .addCase(scrapeMenus.rejected, (state, action) => {
        state.loading = false;
        state.menus = [];
        state.error = action.error.message;
      })
      .addCase(fetchMenus.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchMenus.fulfilled, (state, action) => {
        state.loading = false;
        state.menus = action.payload;
        state.error = '';
      })
      .addCase(fetchMenus.rejected, (state, action) => {
        state.loading = false;
        state.menus = [];
        state.error = action.error.message;
      });
  }
});

export default menuSlice.reducer;

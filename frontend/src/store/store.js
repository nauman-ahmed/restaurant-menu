import { configureStore } from '@reduxjs/toolkit';
import credentialsReducer from './credentialsSlice';
import sidebarTabsReducer from './sidebarTabsSlice';

const store = configureStore({
  reducer: {
    credentials: credentialsReducer,
    sideBarTabs: sidebarTabsReducer,
  },
});

export default store;

import { configureStore } from "@reduxjs/toolkit";
import { userApiSlice } from "./api/userApiSlice";
import authReducer from './utility/authSlice';
import headerReducer from './utility/headerSlice';
// Import other slices as needed

export const store = configureStore({
  reducer: {
    auth: authReducer,
    header: headerReducer,
    [userApiSlice.reducerPath]: userApiSlice.reducer,
    // Add other slices here
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(userApiSlice.middleware),
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
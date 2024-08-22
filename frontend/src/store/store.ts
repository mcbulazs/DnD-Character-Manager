import { configureStore } from "@reduxjs/toolkit";
import { characterApiSlice } from "./api/characterApiSlice";
import { userApiSlice } from "./api/userApiSlice";
import authReducer from "./utility/authSlice";
import headerReducer from "./utility/headerSlice";
// Import other slices as needed

export const store = configureStore({
	reducer: {
		auth: authReducer,
		header: headerReducer,
		[userApiSlice.reducerPath]: userApiSlice.reducer,
		[characterApiSlice.reducerPath]: characterApiSlice.reducer,
	},
	middleware: (getDefaultMiddleware) =>
		getDefaultMiddleware()
			.concat(userApiSlice.middleware)
			.concat(characterApiSlice.middleware),
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;

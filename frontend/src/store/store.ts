import { configureStore } from "@reduxjs/toolkit";
import { characterApiSlice } from "./api/characterApiSlice";
import { userApiSlice } from "./api/userApiSlice";

export const store = configureStore({
	reducer: {
		[userApiSlice.reducerPath]: userApiSlice.reducer,
		[characterApiSlice.reducerPath]: characterApiSlice.reducer,
	},
	middleware: (getDefaultMiddleware) =>
		getDefaultMiddleware()
			.concat(userApiSlice.middleware)
			.concat(characterApiSlice.middleware),
});

export const resetApiState = (dispatch: AppDispatch) => {
	dispatch(userApiSlice.util.resetApiState());
	dispatch(characterApiSlice.util.resetApiState());
};

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;

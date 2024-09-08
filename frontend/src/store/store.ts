import {
	type ConfigureStoreOptions,
	configureStore,
} from "@reduxjs/toolkit";
import { characterApiSlice } from "./api/characterApiSlice";
import { userApiSlice } from "./api/userApiSlice";

const storeProps: ConfigureStoreOptions = {
	reducer: {
		[userApiSlice.reducerPath]: userApiSlice.reducer,
		[characterApiSlice.reducerPath]: characterApiSlice.reducer,
	},
	middleware: (getDefaultMiddleware) =>
		getDefaultMiddleware()
			.concat(userApiSlice.middleware)
			.concat(characterApiSlice.middleware),
};
//biome-ignore lint/suspicious/noExplicitAny: any is used to match the type of preloadedState
export const configureAppStore = (preloadedState?: any) => {
	return configureStore({
		...storeProps,
		preloadedState,
	});
}

/*
export const resetApiState = (dispatch: AppDispatch) => {
	dispatch(userApiSlice.util.resetApiState());
	dispatch(characterApiSlice.util.resetApiState());
};*/

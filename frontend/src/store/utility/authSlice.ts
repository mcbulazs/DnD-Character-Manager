import { type PayloadAction, createSlice } from "@reduxjs/toolkit";
import type { RootState } from "../store";

interface AuthState {
	isLoggedIn: boolean;
}

const initialState: AuthState = {
	isLoggedIn: false,
};

const authSlice = createSlice({
	name: "auth",
	initialState,
	reducers: {
		setLoggedIn: (state, action: PayloadAction<boolean>) => {
			state.isLoggedIn = action.payload;
		},
		logIn: (state) => {
			state.isLoggedIn = true;
		},
		logOut: (state) => {
			state.isLoggedIn = false;
		},
	},
});

export const { setLoggedIn, logIn, logOut } = authSlice.actions;
export const selectIsLoggedIn = (state: RootState): boolean =>
	state.auth.isLoggedIn;
export default authSlice.reducer;

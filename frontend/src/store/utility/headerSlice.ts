import { type PayloadAction, createSlice } from "@reduxjs/toolkit";
import type { RootState } from "../store";

interface HeaderText {
	text: string;
}

const initialState: HeaderText = {
	text: "ZX",
};

const headerSlice = createSlice({
	name: "header",
	initialState,
	reducers: {
		setHeaderText: (state, action: PayloadAction<string>) => {
			state.text = action.payload;
		},
	},
});

export const { setHeaderText } = headerSlice.actions;
export const selectHeaderText = (state: RootState): string => state.header.text;
export default headerSlice.reducer;

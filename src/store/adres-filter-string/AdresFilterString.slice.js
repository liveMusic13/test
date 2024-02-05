import { createSlice } from '@reduxjs/toolkit';

const initialState = {
	srcRequest: '',
};

export const adresFilterString = createSlice({
	name: 'adresFilterString',
	initialState,
	reducers: {
		addGetParams: (state, { payload }) => {
			state.srcRequest = payload;
		},
	},
});

export const { actions, reducer } = adresFilterString;

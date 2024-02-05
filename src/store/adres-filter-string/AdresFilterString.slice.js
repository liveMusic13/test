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
		clearGetParams: (state, { payload }) => {
			state.srcRequest = '';
		},
	},
});

export const { actions, reducer } = adresFilterString;

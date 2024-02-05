import { createSlice } from '@reduxjs/toolkit';

const initialState = [];

export const dataFilters = createSlice({
	name: 'dataFilters',
	initialState,
	reducers: {
		addFilters: (state, { payload }) => {
			return payload;
		},
	},
});

export const { actions, reducer } = dataFilters;

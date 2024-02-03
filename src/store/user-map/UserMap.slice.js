import { createSlice } from '@reduxjs/toolkit';

const initialState = {
	map: '247',
};

export const userMap = createSlice({
	name: 'userMap',
	initialState,
	reducers: {
		addNumMap: (state, { payload }) => {
			state.map = payload;
		},
	},
});

export const { actions, reducer } = userMap;

import { createSlice } from '@reduxjs/toolkit';

const initialState = {
	values: [],
};

export const dataObjectInfo = createSlice({
	name: 'dataObjectInfo',
	initialState,
	reducers: {
		addObjectInfo: (state, { payload }) => {
			return payload;
		},
	},
});

export const { actions, reducer } = dataObjectInfo;

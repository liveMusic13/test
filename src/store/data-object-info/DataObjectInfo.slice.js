import { createSlice } from '@reduxjs/toolkit';

const initialState = {};

export const dataObjectInfo = createSlice({
	name: 'dataObjectInfo',
	initialState,
	reducers: {
		addObjectInfo: (state, { payload }) => {
			return payload;
		},
		deleteObjectInfo: (state, { payload }) => {
			return {};
		},
	},
});

export const { actions, reducer } = dataObjectInfo;

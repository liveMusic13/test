import { createSlice } from '@reduxjs/toolkit';

const initialState = {
	points: {
		points: [],
	},
	visiblePoints: [],
};

export const dataObjectsInMap = createSlice({
	name: 'dataObjectsInMap',
	initialState,
	reducers: {
		// addDataObjectsInMap: (state, { payload }) => {
		// 	return payload;
		// },
		addDataObjectsInMap: (state, { payload }) => {
			state.points = payload;
		},
		updateVisibleMarkers: (state, { payload }) => {
			state.visiblePoints = payload;
		},
	},
});

export const { actions, reducer } = dataObjectsInMap;

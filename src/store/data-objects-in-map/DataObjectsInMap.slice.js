import { createSlice } from '@reduxjs/toolkit';

const initialState = {
	points: {
		points: [],
	},
	visiblePoints: [],
	centerMapObject: [55.7522, 37.6156],
};

export const dataObjectsInMap = createSlice({
	name: 'dataObjectsInMap',
	initialState,
	reducers: {
		addDataObjectsInMap: (state, { payload }) => {
			state.points = payload;
		},
		updateVisibleMarkers: (state, { payload }) => {
			state.visiblePoints = payload;
		},
		addNewCenter: (state, { payload }) => {
			state.centerMapObject = payload;
		},
	},
});

export const { actions, reducer } = dataObjectsInMap;

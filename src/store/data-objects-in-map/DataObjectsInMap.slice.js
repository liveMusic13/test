import { createSlice } from '@reduxjs/toolkit';

// const initialState = {};
const initialState = {
	// points: [
	// 	{
	// 		color: '996E36DE',
	// 		icon: 'shield-home',
	// 		id: 89070,
	// 		name: '1001 фрутамин',
	// 		crd: [55.6527, 37.7678],
	// 		raion_id: '56',
	// 		name_map: null,
	// 		polygon: [],
	// 	},
	// ],
};

export const dataObjectsInMap = createSlice({
	name: 'dataObjectsInMap',
	initialState,
	reducers: {
		addDataObjectsInMap: (state, { payload }) => {
			return payload;
			// return [{ ...payload }];
		},
	},
});

export const { actions, reducer } = dataObjectsInMap;

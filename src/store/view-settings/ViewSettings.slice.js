import { createSlice } from '@reduxjs/toolkit';

const initialState = {
	isViewFilters: true,
	isViewObjects: true,
	// isViewBurger: false,
	isSettingsMap: false,
	isObjectInfo: false,
	isLoading: false,
};

export const viewSettings = createSlice({
	name: 'viewSettings',
	initialState,
	reducers: {
		toggleFilters: (state, { payload }) => {
			return { ...state, isViewFilters: !state.isViewFilters };
		},
		toggleObjects: (state, { payload }) => {
			return { ...state, isViewObjects: !state.isViewObjects };
		},
		toggleObjectInfo: (state, { payload }) => {
			return { ...state, isObjectInfo: true };
		},

		// toggleBurger: (state, { payload }) => {
		// 	return { ...state, isViewBurger: !state.isViewBurger };
		// },
		toggleSettingsMap: (state, { payload }) => {
			return { ...state, isSettingsMap: !state.isSettingsMap };
		},
		activeSettingsMap: (state, { payload }) => {
			return { ...state, isSettingsMap: true };
		},
		activeLoading: (state, { payload }) => {
			return { ...state, isLoading: true };
		},
		defaultLoading: (state, { payload }) => {
			return { ...state, isLoading: false };
		},
		defaultFilters: (state, { payload }) => {
			return { ...state, isViewFilters: false };
		},
		defaultObjects: (state, { payload }) => {
			return { ...state, isViewObjects: false };
		},
		defaultObjectInfo: (state, { payload }) => {
			return { ...state, isObjectInfo: false };
		},
	},
});

export const { actions, reducer } = viewSettings;

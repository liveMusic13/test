import { createSlice } from '@reduxjs/toolkit';

const initialState = {
	isViewFilters: true,
	isViewObjects: true,
	// isViewBurger: false,
	isSettingsMap: false,
	isObjectInfo: false,
	isLoading: false,
	isLoadingObject: false,
	isDisplay: true,
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
		activeLoadingObject: (state, { payload }) => {
			return { ...state, isLoadingObject: true };
		},
		activeDisplay: (state, { payload }) => {
			return { ...state, isDisplay: true };
		},
		defaultDisplay: (state, { payload }) => {
			return { ...state, isDisplay: false };
		},
		defaultLoadingObject: (state, { payload }) => {
			return { ...state, isLoadingObject: false };
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

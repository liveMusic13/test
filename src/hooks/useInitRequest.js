import axios from 'axios';
import { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useSearchParams } from 'react-router-dom';
import { $axios } from '../api';
import { actions as dataFiltersAction } from '../store/data-filters/DataFilters.slice';
import { actions as dataObjectsInMapAction } from '../store/data-objects-in-map/DataObjectsInMap.slice';
import { actions as ViewSettingsActions } from '../store/view-settings/ViewSettings.slice';

export const useInitRequest = () => {
	const adresFilterString = useSelector(state => state.adresFilterString);
	const dispatch = useDispatch();
	const location = useLocation();
	const [searchParams, setSearchParams] = useSearchParams(location.search);
	const map = searchParams.get('map');

	const getObject = useCallback(async () => {
		try {
			dispatch(ViewSettingsActions.activeLoading());
			if (adresFilterString.srcRequest === '') {
				const response = await $axios.get(`/api/get_objects.php?map=${map}`);
				dispatch(dataObjectsInMapAction.addDataObjectsInMap(response.data));
			} else {
				const response = await $axios.get(
					`/api/get_objects.php${adresFilterString.srcRequest}`
				);
				dispatch(dataObjectsInMapAction.addDataObjectsInMap(response.data));
			}
		} catch (error) {
			console.log(error);
		} finally {
			dispatch(ViewSettingsActions.defaultLoading());
		}
	}, [
		map,
		dispatch,
		ViewSettingsActions,
		dataObjectsInMapAction,
		adresFilterString.srcRequest,
	]);

	const getFilters = useCallback(async () => {
		try {
			const responce = await axios.get(
				`https://mosmap.ru/api/filters.php?map=${map}`
			);
			dispatch(dataFiltersAction.addFilters(responce.data));
		} catch (error) {
			console.log(error);
		}
	}, [map, dispatch, dataFiltersAction]);

	return { getObject, getFilters };
};

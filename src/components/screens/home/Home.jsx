import axios from 'axios';
import React, { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import { $axios } from '../../../api';
import { useCheckWidth } from '../../../hooks/useCheckWidth';
import { actions as dataFiltersAction } from '../../../store/data-filters/DataFilters.slice';
import { actions as dataObjectsInMapAction } from '../../../store/data-objects-in-map/DataObjectsInMap.slice';
import { actions as userMapAction } from '../../../store/user-map/UserMap.slice';
import { actions as ViewSettingsActions } from '../../../store/view-settings/ViewSettings.slice';
import Content from '../../content/Content';
import Header from '../../header/Header';
import SettingsMap from '../../settings-map/SettingsMap';

const Home = () => {
	const dispatch = useDispatch();
	const userMap = useSelector(state => state.userMap);
	const adresFilterString = useSelector(state => state.adresFilterString);
	const viewSettings = useSelector(state => state.viewSettings);
	const { windowSize } = useCheckWidth();
	const location = useLocation();
	const navigate = useNavigate();
	const [searchParams, setSearchParams] = useSearchParams(location.search);
	const map = searchParams.get('map');
	// const { getObject, getFilters } = useInitRequest();
	const [initApp, setInitApp] = useState(false);

	useEffect(() => {
		dispatch(userMapAction.addNumMap(map));
	}, []);

	useEffect(() => {
		if (adresFilterString.srcRequest !== '') {
			setInitApp(true);
		}
	}, [adresFilterString.srcRequest]);

	const getObject = useCallback(async () => {
		try {
			dispatch(ViewSettingsActions.activeLoading());
			if (adresFilterString.srcRequest === '') {
				const response = await $axios.get(`/api/get_objects.php?map=${map}`);
				dispatch(dataObjectsInMapAction.addDataObjectsInMap(response.data));
				console.log(response.data);
			} else {
				const response = await $axios.get(
					`/api/get_objects.php${adresFilterString.srcRequest}`
				);
				dispatch(dataObjectsInMapAction.addDataObjectsInMap(response.data));
				console.log(response.data);
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
			console.log('filters: ', responce);
		} catch (error) {
			console.log(error);
		}
	}, [map, dispatch, dataFiltersAction]);

	useEffect(() => {
		if (!map) {
			navigate(`?map=247`);
		} else {
			getObject();
			getFilters();
		}
	}, [map, initApp]);

	// useEffect(() => {
	// 	if (map) {
	// 		getFilters();
	// 	}
	// }, [map]);

	useEffect(() => {
		if (windowSize.width <= 767.98) {
			dispatch(ViewSettingsActions.defaultFilters(''));
			dispatch(ViewSettingsActions.defaultObjects(''));
		}
	}, [windowSize.width]);

	console.log('render Home');

	return (
		<div style={{ height: '100%' }}>
			<Header />
			<Content />
			{/* {viewSettings.isViewBurger && <BurgerMenu />} */}
			{viewSettings.isSettingsMap && <SettingsMap />}
		</div>
	);
};

export default React.memo(Home);

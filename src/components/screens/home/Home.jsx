import axios from 'axios';
import React, { useCallback, useEffect } from 'react';
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

	useEffect(() => {
		dispatch(userMapAction.addNumMap(map));
	}, []);

	// const map = searchParams.get(userMap);

	// useEffect(() => {
	// 	const getObject = async () => {
	// 		try {
	// 			const responce = await $axios.get('/api/get_objects.php?map=247');
	// 			console.log(responce.data);
	// 			dispatch(dataObjectsInMapAction.addDataObjectsInMap(responce.data));
	// 		} catch (error) {
	// 			console.log(error);
	// 		}
	// 	};
	// 	getObject();
	// }, []);

	// const getFiltersObjects = async () => {
	// 	try {
	// 		const responce = await $axios.get(
	// 			`/api/get_objects.php${adresFilterString.srcRequest}`
	// 		);
	// 		dispatch(dataObjectsInMapAction.addDataObjectsInMap(responce.data));
	// 		if (window.innerWidth <= 767.98) {
	// 			dispatch(ViewSettingsActions.toggleSettingsMap(''));
	// 			dispatch(ViewSettingsActions.defaultFilters(''));
	// 		}
	// 	} catch (error) {
	// 		console.log(error);
	// 	}
	// };

	const getObject = useCallback(async () => {
		try {
			dispatch(ViewSettingsActions.activeLoading());

			const response = await $axios.get(`/api/get_objects.php?map=${map}`);
			console.log(response.data);
			dispatch(dataObjectsInMapAction.addDataObjectsInMap(response.data));
		} catch (error) {
			console.log(error);
		} finally {
			dispatch(ViewSettingsActions.defaultLoading());
		}
	}, [map, dispatch, ViewSettingsActions, dataObjectsInMapAction]);

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

	// useEffect(() => {
	// 	navigate(`?map=247`);

	// 	if (map) {
	// 		getObject();
	// 		getFilters();
	// 		navigate(`?map=${map}`);
	// 	}
	// }, [map]);
	useEffect(() => {
		if (!map) {
			navigate(`?map=247`);
		} else {
			getObject();
			getFilters();
		}
	}, [map]);

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

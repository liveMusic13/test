import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import { useCheckWidth } from '../../../hooks/useCheckWidth';
import { useInitRequest } from '../../../hooks/useInitRequest';
import { actions as userMapAction } from '../../../store/user-map/UserMap.slice';
import { actions as ViewSettingsActions } from '../../../store/view-settings/ViewSettings.slice';
import Content from '../../content/Content';
import Header from '../../header/Header';
import SettingsMap from '../../settings-map/SettingsMap';

const Home = () => {
	const dispatch = useDispatch();
	const adresFilterString = useSelector(state => state.adresFilterString);
	const viewSettings = useSelector(state => state.viewSettings);
	const { windowSize } = useCheckWidth();
	const location = useLocation();
	const navigate = useNavigate();
	const [searchParams, setSearchParams] = useSearchParams(location.search);
	const map = searchParams.get('map');
	const { getObject, getFilters } = useInitRequest();
	const [initApp, setInitApp] = useState(false);

	useEffect(() => {
		dispatch(userMapAction.addNumMap(map));
	}, []);

	useEffect(() => {
		if (adresFilterString.srcRequest !== '') {
			setInitApp(true);
		}
	}, [adresFilterString.srcRequest]);

	useEffect(() => {
		if (!map) {
			navigate(`?map=247`);
		} else {
			getObject();
			getFilters();
		}
	}, [map, initApp]);

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
			{viewSettings.isSettingsMap && <SettingsMap />}
		</div>
	);
};

export default React.memo(Home);

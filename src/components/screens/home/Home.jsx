import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
import { $axios } from '../../../api';
import { useCheckWidth } from '../../../hooks/useCheckWidth';
import { actions as dataObjectsInMapAction } from '../../../store/data-objects-in-map/DataObjectsInMap.slice';
import { actions as userMapAction } from '../../../store/user-map/UserMap.slice';
import { actions as ViewSettingsActions } from '../../../store/view-settings/ViewSettings.slice';
import Content from '../../content/Content';
import Header from '../../header/Header';
import SettingsMap from '../../settings-map/SettingsMap';

const Home = () => {
	const dispatch = useDispatch();
	const userMap = useSelector(state => state.userMap);
	const viewSettings = useSelector(state => state.viewSettings);
	const { windowSize } = useCheckWidth();
	const location = useLocation();
	const navigate = useNavigate();
	const searchParams = new URLSearchParams(location.search);
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

	const getObject = async () => {
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
	};

	useEffect(() => {
		navigate(`?map=247`);

		if (map) {
			getObject();
			navigate(`?map=${map}`);
		}
	}, [map]);

	useEffect(() => {
		if (windowSize.width <= 767.98) {
			dispatch(ViewSettingsActions.defaultFilters(''));
			dispatch(ViewSettingsActions.defaultObjects(''));
		}
	}, [windowSize.width]);

	// const getObjectInfo = async () => {
	// 	dispatch(ViewSettingsActions.toggleObjectInfo());

	// 	try {
	// 		dispatch(ViewSettingsActions.activeLoading());

	// 		const responce = await $axios.get(
	// 			// `/api/object_info.php?id=${object.id}`
	// 			`/api/object_info.php?id=97823`
	// 		);
	// 		console.log(responce);

	// 		dispatch(dataObjectInfoAction.addObjectInfo(responce.data));
	// 		dispatch(ViewSettingsActions.defaultFilters());
	// 		if (isMobile) dispatch(ViewSettingsActions.activeSettingsMap(''));
	// 	} catch (error) {
	// 		console.log(error);
	// 	} finally {
	// 		dispatch(ViewSettingsActions.defaultLoading());
	// 	}
	// };

	// const getObjectInfo = async () => {
	// 	try {
	// 		const responce = await $axios.get(
	// 			'https://mosmap.ru/api/filters.php?map=2'
	// 		);

	// 		console.log(responce);
	// 	} catch (error) {
	// 		console.log(error);
	// 	}
	// };

	return (
		<div style={{ height: '100%' }}>
			<Header />
			{/* <button onClick={getObjectInfo}>test</button> */}
			<Content />
			{/* {viewSettings.isViewBurger && <BurgerMenu />} */}
			{viewSettings.isSettingsMap && <SettingsMap />}
		</div>
	);
};

export default Home;

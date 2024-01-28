import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { $axios } from '../../../api';
import { useCheckWidth } from '../../../hooks/useCheckWidth';
import { actions as dataObjectsInMapAction } from '../../../store/data-objects-in-map/DataObjectsInMap.slice';
import { actions as ViewSettingsActions } from '../../../store/view-settings/ViewSettings.slice';
import Content from '../../content/Content';
import Header from '../../header/Header';
import SettingsMap from '../../settings-map/SettingsMap';

const Home = () => {
	const dispatch = useDispatch();
	const viewSettings = useSelector(state => state.viewSettings);
	const { windowSize, setWindowSize } = useCheckWidth();

	useEffect(() => {
		const getObject = async () => {
			const responce = await $axios.get('/api/get_objects.php?map=247');
			console.log(responce.data);
			dispatch(dataObjectsInMapAction.addDataObjectsInMap(responce.data));
		};
		getObject();
	}, []);

	useEffect(() => {
		if (windowSize.width <= 767.98) {
			dispatch(ViewSettingsActions.defaultFilters(''));
			dispatch(ViewSettingsActions.defaultObjects(''));
		}
	}, [windowSize.width]);

	return (
		<div style={{ height: '100%' }}>
			<Header />
			<Content />
			{/* {viewSettings.isViewBurger && <BurgerMenu />} */}
			{viewSettings.isSettingsMap && <SettingsMap />}
		</div>
	);
};

export default Home;

import { useDispatch, useSelector } from 'react-redux';
import { useCheckWidth } from '../../hooks/useCheckWidth';
import { actions as viewSettingsAction } from '../../store/view-settings/ViewSettings.slice';
import AllObjects from '../all-objects/AllObjects';
import ObjectInfo from '../object-info/ObjectInfo';
import Filters from '../ui/filters/Filters';
import styles from './SettingsMap.module.scss';

const SettingsMap = () => {
	const viewSettings = useSelector(state => state.viewSettings);
	const dispatch = useDispatch();
	const { windowSize } = useCheckWidth();

	return (
		<div className={styles.wrapper_settings}>
			<button
				className={styles.settings__button}
				onClick={() => {
					dispatch(viewSettingsAction.toggleSettingsMap(''));
					if (viewSettings.isViewFilters)
						dispatch(viewSettingsAction.toggleFilters(''));
					if (viewSettings.isViewObjects)
						dispatch(viewSettingsAction.toggleObjects(''));
					if (windowSize.width <= 767.98)
						dispatch(viewSettingsAction.defaultObjectInfo(''));
				}}
			>
				<span></span>
			</button>
			{viewSettings.isViewFilters && <Filters />}
			{viewSettings.isObjectInfo && <ObjectInfo />}
			{viewSettings.isViewObjects && <AllObjects />}
		</div>
	);
};

export default SettingsMap;

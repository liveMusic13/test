import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useCheckWidth } from '../../hooks/useCheckWidth';
import { actions as viewSettingsAction } from '../../store/view-settings/ViewSettings.slice';
import AllObjects from '../all-objects/AllObjects';
import CustomMap from '../custom-map/CustomMap';
import ObjectInfo from '../object-info/ObjectInfo';
import Filters from '../ui/filters/Filters';
import styles from './Content.module.scss';

const Content = () => {
	const viewSettings = useSelector(state => state.viewSettings);
	const { windowSize } = useCheckWidth();
	const [isDisplay, setIsDisplay] = useState(true);
	const dispatch = useDispatch();

	useEffect(() => {
		if (windowSize <= 768) {
			setIsDisplay(false);
			dispatch(viewSettingsAction.defaultDisplay(''));
		} else if (windowSize >= 768) {
			setIsDisplay(true);
			dispatch(viewSettingsAction.activeDisplay(''));
		}
	}, [windowSize]);

	return (
		<div className={styles.wrapper}>
			{viewSettings.isViewFilters && <Filters isDisplay={isDisplay} />}
			{viewSettings.isObjectInfo && <ObjectInfo isDisplay={isDisplay} />}
			{viewSettings.isViewObjects && <AllObjects isDisplay={isDisplay} />}
			<div className={styles.block__map}>
				<CustomMap />
				<div className={styles.logo__image}>
					<a href='https://mosmap.ru'></a>
				</div>
			</div>
		</div>
	);
};

export default Content;

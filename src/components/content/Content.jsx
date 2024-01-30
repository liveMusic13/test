import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useCheckWidth } from '../../hooks/useCheckWidth';
import AllObjects from '../all-objects/AllObjects';
// import CustomMap from '../custom-map/CustomMap';
import ObjectInfo from '../object-info/ObjectInfo';
import Filters from '../ui/filters/Filters';
import styles from './Content.module.scss';

const Content = () => {
	const viewSettings = useSelector(state => state.viewSettings);
	const { windowSize, setWindowSize } = useCheckWidth();
	const [isDisplay, setIsDisplay] = useState(true);

	useEffect(() => {
		if (windowSize <= 768) setIsDisplay(false);
	}, [windowSize]);

	return (
		<div className={styles.wrapper}>
			{viewSettings.isViewFilters && <Filters isDisplay={isDisplay} />}
			{viewSettings.isObjectInfo && <ObjectInfo isDisplay={isDisplay} />}
			{viewSettings.isViewObjects && <AllObjects isDisplay={isDisplay} />}
			{/* <div className={styles.block__map}>
				<CustomMap />
				<div className={styles.logo__image}>
					<a href='https://mosmap.ru'></a>
				</div>
			</div> */}
		</div>
	);
};

export default Content;

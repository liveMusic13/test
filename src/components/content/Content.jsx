import { useSelector } from 'react-redux';
import AllObjects from '../all-objects/AllObjects';
import CustomMap from '../custom-map/CustomMap';
import ObjectInfo from '../object-info/ObjectInfo';
import Filters from '../ui/filters/Filters';
import styles from './Content.module.scss';

const Content = () => {
	const viewSettings = useSelector(state => state.viewSettings);

	return (
		<div className={styles.wrapper}>
			{viewSettings.isViewFilters && <Filters />}
			{viewSettings.isObjectInfo && <ObjectInfo />}
			{viewSettings.isViewObjects && <AllObjects />}
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

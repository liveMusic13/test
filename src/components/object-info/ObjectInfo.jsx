import { useDispatch, useSelector } from 'react-redux';
import { actions as viewSettingsAction } from '../../store/view-settings/ViewSettings.slice';
import Loading from '../ui/loading/Loading';
import styles from './ObjectInfo.module.scss';

const ObjectInfo = ({ isDisplay }) => {
	const viewSettings = useSelector(state => state.viewSettings);
	const dataObjectInfo = useSelector(state => state.dataObjectInfo);
	const dispatch = useDispatch();

	return (
		<div
			className={styles.block__info}
			style={!isDisplay ? { display: 'none' } : {}}
		>
			<div className={styles.block__title}>
				<h2 className={styles.title}>Просмотр объекта</h2>
				<button
					className={styles.button__close}
					onClick={() => {
						dispatch(viewSettingsAction.defaultObjectInfo(''));
						if (window.innerWidth <= 767.98)
							dispatch(viewSettingsAction.toggleFilters(''));
					}}
				>
					<span></span>
				</button>
			</div>
			<div className={styles.block__aboutObjects}>
				{viewSettings.isLoadingObject ? (
					<>
						<div className={styles.block__loader}>
							<Loading height='calc(67/1440 * 100vw)' />
						</div>
						<div className={styles.block__loader}>
							<Loading height='calc(67/1440 * 100vw)' />
						</div>
						<div className={styles.block__loader}>
							<Loading height='calc(67/1440 * 100vw)' />
						</div>
						<div className={styles.block__loader}>
							<Loading height='calc(67/1440 * 100vw)' />
						</div>
						<div className={styles.block__loader}>
							<Loading height='calc(67/1440 * 100vw)' />
						</div>
					</>
				) : (
					dataObjectInfo.values.map(elem => {
						return (
							<div
								key={Math.random() + Math.random()}
								className={styles.block__descriptionInfo}
							>
								<h2 className={styles.title__info}>{elem.label}</h2>
								<p className={styles.description__info}>{elem.value}</p>
							</div>
						);
					})
				)}
			</div>
		</div>
	);
};

export default ObjectInfo;

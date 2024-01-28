import { useDispatch, useSelector } from 'react-redux';
import { actions as viewSettingsAction } from '../../store/view-settings/ViewSettings.slice';
import styles from './ObjectInfo.module.scss';

const ObjectInfo = () => {
	const dataObjectInfo = useSelector(state => state.dataObjectInfo);
	const dispatch = useDispatch();

	return (
		<div className={styles.block__info}>
			<div className={styles.block__title}>
				<h2 className={styles.title}>Просмотр объекта</h2>
				<button
					className={styles.button__close}
					onClick={() => {
						dispatch(viewSettingsAction.defaultObjectInfo(''));
						dispatch(viewSettingsAction.toggleFilters(''));
					}}
				>
					<span></span>
				</button>
			</div>
			<div className={styles.block__aboutObjects}>
				{dataObjectInfo.values.map(elem => {
					return (
						<div
							key={Math.random() + Math.random()}
							className={styles.block__descriptionInfo}
						>
							<h2 className={styles.title__info}>{elem.label}</h2>
							<p className={styles.description__info}>{elem.value}</p>
						</div>
					);
				})}
			</div>
		</div>
	);
};

export default ObjectInfo;

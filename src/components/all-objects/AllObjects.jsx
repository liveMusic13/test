import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { $axios } from '../../api';
import { useSearchObjectInMap } from '../../hooks/useSearchObjectInMap';
import { actions as dataObjectInfoAction } from '../../store/data-object-info/DataObjectInfo.slice';
import { actions as viewSettingsAction } from '../../store/view-settings/ViewSettings.slice';
import Button from '../ui/button/Button';
import Loading from '../ui/loading/Loading';
import styles from './AllObjects.module.scss';

const AllObjects = ({ isDisplay }) => {
	const dataObjectsInMap = useSelector(state => state.dataObjectsInMap);
	const dataObjectInfo = useSelector(state => state.dataObjectInfo);
	const viewSettings = useSelector(state => state.viewSettings);
	const loader = useRef();
	const { newCenter } = useSearchObjectInMap();
	const [isMobile, setIsMobile] = useState(false);
	const dispatch = useDispatch();

	useEffect(() => {
		if (window.innerWidth < 767.98) setIsMobile(true);
	}, [window.innerWidth]);

	const getInfoObject = marker => async () => {
		//HELP: ЗАПРОС НА ПОЛУЧЕНИЕ ИНФОРМАЦИИ ОБ ОБЪЕКТЕ
		if (isMobile) dispatch(viewSettingsAction.activeSettingsMap(''));
		dispatch(viewSettingsAction.toggleObjectInfo());

		try {
			dispatch(viewSettingsAction.activeLoadingObject());

			const response = await $axios.get(`/api/object_info.php?id=${marker.id}`);
			console.log(response);

			dispatch(dataObjectInfoAction.addObjectInfo(response.data));
		} catch (error) {
			console.log(error);
		} finally {
			dispatch(viewSettingsAction.defaultLoadingObject());
		}
	};

	const objects = dataObjectsInMap?.points?.points;

	const targetObject = useMemo(
		() => objects.find(elem => elem.id === dataObjectInfo.id),
		[objects, dataObjectInfo.id]
	);

	const otherObjects = useMemo(
		() => objects.filter(elem => elem.id !== dataObjectInfo.id),
		[objects, dataObjectInfo.id]
	);

	const [displayedObjects, setDisplayedObjects] = useState([]);

	useEffect(() => {
		if (targetObject) {
			setDisplayedObjects([targetObject, ...otherObjects]);
		} else {
			setDisplayedObjects([...otherObjects]);
		}
	}, [targetObject, otherObjects, dataObjectsInMap]);

	const mapIcon = {
		id: 0,
		src: '/images/svg/sprite.svg#target',
		hover_text: 'Показать на карте',
	};

	let style = {};

	if (!(viewSettings.isObjectInfo || viewSettings.isViewFilters)) {
		style.left = '0';
	}

	if (!isDisplay) {
		style.display = 'none';
	}

	return (
		<div className={styles.block__allObjects} style={style}>
			<div className={styles.block__title}>
				<div className={styles.allObjects}>
					<p className={styles.description}>Всего объектов в списке:</p>
					<p className={styles.value}>
						{dataObjectsInMap.points['all-points']
							? dataObjectsInMap.points['all-points']
							: '0'}
					</p>
				</div>
				<div className={styles.allObjects__inMap}>
					<p className={styles.description}>Всего объектов на карте:</p>
					<p className={styles.value}>
						{dataObjectsInMap.points['all-points']
							? dataObjectsInMap.points['all-points']
							: '0'}
					</p>
				</div>
			</div>
			<div className={styles.block__objects}>
				{viewSettings.isLoading ? (
					<>
						<div className={styles.object}>
							<Loading height='calc(60/1440 * 100vw)' />
						</div>
						<div className={styles.object}>
							<Loading height='calc(60/1440 * 100vw)' />
						</div>
						<div className={styles.object}>
							<Loading height='calc(60/1440 * 100vw)' />
						</div>
						<div className={styles.object}>
							<Loading height='calc(60/1440 * 100vw)' />
						</div>
						<div className={styles.object}>
							<Loading height='calc(60/1440 * 100vw)' />
						</div>
					</>
				) : (
					displayedObjects.map(elem => {
						return (
							<div
								key={elem.id}
								className={styles.object}
								style={
									dataObjectInfo.id === elem.id
										? { backgroundColor: '#e0e0e0' }
										: {}
								}
								onClick={getInfoObject(elem)}
							>
								<p>{elem.name}</p>
								<Button icon={mapIcon} newCenter={newCenter} elem={elem} />
							</div>
						);
					})
					// objects.map(elem => {
					// 	return (
					// 		<div
					// 			key={elem.id}
					// 			className={styles.object}
					// 			style={
					// 				dataObjectInfo.id === elem.id
					// 					? { backgroundColor: '#e0e0e0' }
					// 					: {}
					// 			}
					// 		>
					// 			<p>{elem.name}</p>
					// 			<Button icon={mapIcon} newCenter={newCenter} elem={elem} />
					// 		</div>
					// 	);
					// })
				)}
				{/* HELP: ЧТОБЫ БЫ СРАБАТЫВАЛА ПОДГРУЗКА ДАННЫХ В КОНЦЕ СКРОЛА ДОБАВЛЯЕМ БЛОК*/}
				<div ref={loader} style={{ height: '1px' }}></div>
			</div>
		</div>
	);
};

export default AllObjects;

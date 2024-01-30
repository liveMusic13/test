import { useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import Button from '../ui/button/Button';
import Loading from '../ui/loading/Loading';
import styles from './AllObjects.module.scss';

const AllObjects = ({ isDisplay }) => {
	const dataObjectsInMap = useSelector(state => state.dataObjectsInMap);
	const viewSettings = useSelector(state => state.viewSettings);
	const [numDisplayed, setNumDisplayed] = useState(40);
	const loader = useRef();

	useEffect(() => {
		const observer = new IntersectionObserver(
			entries => {
				if (entries[0].isIntersecting) {
					setNumDisplayed(prevNum => prevNum + 20);
				}
			},
			{ threshold: 1 }
		);

		if (loader.current) {
			observer.observe(loader.current);
		}

		return () => observer.disconnect();
	}, []);

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
						{dataObjectsInMap['all-points']
							? dataObjectsInMap['all-points']
							: '0'}
					</p>
				</div>
				<div className={styles.allObjects__inMap}>
					<p className={styles.description}>Всего объектов на карте:</p>
					<p className={styles.value}>
						{dataObjectsInMap['all-points']
							? dataObjectsInMap['all-points']
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
					dataObjectsInMap?.points?.slice(0, numDisplayed).map(elem => {
						return (
							<div key={elem.id} className={styles.object}>
								<p>{elem.name}</p>
								<Button icon={mapIcon} />
							</div>
						);
					})
				)}
				{/* <div ref={loader}>Загрузка...</div> */}
			</div>
		</div>
	);
};

export default AllObjects;

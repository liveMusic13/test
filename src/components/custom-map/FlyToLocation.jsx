import { useEffect } from 'react';
import { useMap } from 'react-leaflet';

const FlyToLocation = ({
	centerMapObject,
	isInitialized,
	setIsInitialized,
}) => {
	const map = useMap();

	// useEffect(() => {
	// 	if (centerMapObject) {
	// 		if (isInitialized) {
	// 			console.log('FlyToLocation');
	// 			// Смещение объекта на 0.0025 градуса вправо
	// 			map.flyTo([centerMapObject[0], centerMapObject[1] - 0.0025], 17);
	// 		} else {
	// 			// Смещение объекта на 0.0025 градуса вправо
	// 			map.flyTo([centerMapObject[0], centerMapObject[1] - 0.0025]);
	// 			setIsInitialized(true);
	// 		}
	// 	}
	// }, [centerMapObject]);
	useEffect(() => {
		if (centerMapObject) {
			if (isInitialized) {
				console.log('FlyToLocation');
				// Смещение объекта на 0.0025 градуса вправо
				map.panTo([centerMapObject[0], centerMapObject[1] - 0.0055], 17); //HELP: СДЕЛАЛ ЧЕРЕЗ panTo ЧТОБЫ НЕ БЫЛО КОНФЛИКТОВ С panTo ИЗ CanvasMarkersLayer. ПОТОМУ ЧТО ЕСЛИ СДЕЛАТЬ ЧЕРЕЗ flyTo ТО ОНО БУДЕТ ОСТАНАВЛИВАТЬСЯ КОГДА В CanvasMarkersLayer НАЧИНАЕТ ОТРАБАТЫВАТЬ panTo.
			} else {
				// Смещение объекта на 0.0025 градуса вправо
				map.panTo([centerMapObject[0], centerMapObject[1] - 0.0055]);
				setIsInitialized(true);
			}
		}
	}, [centerMapObject]);

	return null;
};

export default FlyToLocation;

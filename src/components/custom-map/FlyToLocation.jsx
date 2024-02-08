import { useEffect } from 'react';
import { useMap } from 'react-leaflet';

const FlyToLocation = ({
	centerMapObject,
	isInitialized,
	setIsInitialized,
}) => {
	const map = useMap();

	useEffect(() => {
		if (centerMapObject) {
			if (isInitialized) {
				// Смещение объекта на 0.0025 градуса вправо
				map.flyTo([centerMapObject[0], centerMapObject[1] - 0.0025], 17);
			} else {
				// Смещение объекта на 0.0025 градуса вправо
				map.flyTo([centerMapObject[0], centerMapObject[1] - 0.0025]);
				setIsInitialized(true);
			}
		}
	}, [centerMapObject]);

	return null;
};

export default FlyToLocation;

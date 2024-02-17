import 'leaflet/dist/leaflet.css';
import { useEffect, useState } from 'react';
import { MapContainer, TileLayer } from 'react-leaflet';
import { useDispatch, useSelector } from 'react-redux';
import { useCheckWidth } from '../../hooks/useCheckWidth.js';
import FlyToLocation from './FlyToLocation.jsx';
import TestLibraryMarker from './TestLibraryMarker.jsx';
import ZoomTracker from './ZoomTracker.jsx';

const TestMap = () => {
	const dispatch = useDispatch();
	const dataObjectsInMap = useSelector(state => state.dataObjectsInMap);
	const { windowSize } = useCheckWidth();
	const [isMobile, setIsMobile] = useState(false);
	const [isInitialized, setIsInitialized] = useState(false);

	useEffect(() => {
		if (windowSize.width <= 767.98) {
			setIsMobile(true);
		}
	}, [windowSize.width]);

	const [zoomLevel, setZoomLevel] = useState(13);

	const dataObjectInfo = useSelector(state => state.dataObjectInfo);

	console.log('dsds');
	return (
		<MapContainer
			center={dataObjectsInMap.centerMapObject}
			zoom={13}
			minZoom={10}
			maxZoom={17}
			scrollWheelZoom='center'
			style={{ width: '100%', height: '98%' }}
			maxBounds={[
				[56.934709, 35.189603], // Северо-западные координаты
				[54.294416, 40.128181], // Юго-восточные координаты
			]}
		>
			<TileLayer url='https://www.moscowmap.ru/leaflet/tiles/{z}/{x}/{y}.png' />
			<ZoomTracker setZoomLevel={setZoomLevel} />
			<FlyToLocation
				centerMapObject={dataObjectsInMap.centerMapObject}
				isInitialized={isInitialized}
				setIsInitialized={setIsInitialized}
			/>
			<TestLibraryMarker isMobile={isMobile} zoomLevel={zoomLevel} />
			{/* <LastTestCanvasMarker isMobile={isMobile} zoomLevel={zoomLevel} /> */}
			{/* <NewCanvasVersionThree isMobile={isMobile} zoomLevel={zoomLevel} /> */}
		</MapContainer>
	);
};

export default TestMap;

import 'leaflet/dist/leaflet.css';
import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer } from 'react-leaflet';
import MarkerClusterGroup from 'react-leaflet-cluster';
import { useSelector } from 'react-redux';
import { useCheckWidth } from '../../hooks/useCheckWidth.js';
import FlyToLocation from './FlyToLocation.jsx';
import RenderMarkers from './RenderMarkers.jsx';
import TestLibraryMarker from './TestLibraryMarker.jsx';
import ZoomTracker from './ZoomTracker.jsx';

const CustomMap = () => {
	const dataObjectsInMap = useSelector(state => state.dataObjectsInMap);
	const { windowSize } = useCheckWidth();
	const [isMobile, setIsMobile] = useState(false);
	const [isInitialized, setIsInitialized] = useState(false); //HELP: ДЛЯ ОТСЛЕЖИВАНИЯ ИНИЦИАЛИЗАЦИИ, ЧТОБЫ ПРИ ПЕРВОМ ЗАПУСКЕ ЗУМ НА 17 НЕ СТАВИЛСЯ

	useEffect(() => {
		if (windowSize.width <= 767.98) {
			setIsMobile(true);
		}
	}, [windowSize.width]);

	const [zoomLevel, setZoomLevel] = useState(13);

	console.log('render CustomMap');

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
				isInitialized={isInitialized} //HELP: ДЛЯ ОТСЛЕЖИВАНИЯ ИНИЦИАЛИЗАЦИИ, ЧТОБЫ ПРИ ПЕРВОМ ЗАПУСКЕ ЗУМ НА 17 НЕ СТАВИЛСЯ
				setIsInitialized={setIsInitialized}
			/>
			{/* <CenterZoomMouse /> */}
			{dataObjectsInMap.points.canvas_map === 0 ? (
				dataObjectsInMap.points.clastering === 0 ? (
					<RenderMarkers isMobile={isMobile} zoomLevel={zoomLevel} />
				) : (
					<MarkerClusterGroup chunkedLoading={true}>
						<RenderMarkers isMobile={isMobile} zoomLevel={zoomLevel} />
					</MarkerClusterGroup>
				)
			) : (
				// <CanvasMarkersLayer
				// 	markersData={dataObjectsInMap.points.points}
				// 	zoomLevel={zoomLevel}
				// />
				// HELP: БИБЛИОТЕКА, ТЕСТ
				<TestLibraryMarker isMobile={isMobile} zoomLevel={zoomLevel} />
				// <LastTestCanvasMarker isMobile={isMobile} zoomLevel={zoomLevel} />
			)}
		</MapContainer>
	);
};

export default CustomMap;

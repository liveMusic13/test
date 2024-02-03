import { divIcon } from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { useEffect, useState } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import {
	MapContainer,
	Marker,
	Polygon,
	Popup,
	TileLayer,
	useMapEvents,
} from 'react-leaflet';
import MarkerClusterGroup from 'react-leaflet-cluster';
import { useDispatch, useSelector } from 'react-redux';
import { $axios } from '../../api';
import { useCheckWidth } from '../../hooks/useCheckWidth.js';
import { actions as dataObjectInfoAction } from '../../store/data-object-info/DataObjectInfo.slice';
// import { actions as dataObjectsInMapAction } from '../../store/data-objects-in-map/DataObjectsInMap.slice.js'; HELP: ДЛЯ ОТРИСОВКИ МАРКЕРОВ ТОЛЬКО НА ВИДИМОЙ ЧАСТИ КАРТЫ
import { actions as viewSettingsAction } from '../../store/view-settings/ViewSettings.slice';
import { ARGBtoHEX } from '../../utils/convertColor.js';
import IconMarker from '../icon-marker/IconMarker';

// const UpdateMarkers = ({ dataObjectsInMap, setIsZoom }) => { HELP: ДЛЯ ОТРИСОВКИ МАРКЕРОВ ТОЛЬКО НА ВИДИМОЙ ЧАСТИ КАРТЫ
// 	const mapCopy = useMap();
// 	const dispatch = useDispatch();

// 	useEffect(() => {
// 		const updateMarkers = () => {
// 			const zoom = mapCopy.getZoom();
// 			if (zoom >= 16) {
// 				// Проверка уровня зума
// 				setIsZoom(true);
// 				const bounds = mapCopy.getBounds();
// 				const visibleObjects = dataObjectsInMap.points.points.filter(object => {
// 					if (object && object.crd) {
// 						return bounds.contains(object.crd);
// 					}
// 					return false;
// 				});

// 				// Затем ты можешь обновить состояние с видимыми объектами
// 				dispatch(dataObjectsInMapAction.updateVisibleMarkers(visibleObjects));
// 			} else {
// 				setIsZoom(false);
// 			}
// 		};

// 		mapCopy.on('moveend', updateMarkers);
// 		return () => {
// 			mapCopy.off('moveend', updateMarkers);
// 		};
// 	}, [mapCopy, dataObjectsInMap]);

// 	return null;
// };

const ZoomTracker = ({ setZoomLevel }) => {
	const map = useMapEvents({
		zoomend: () => {
			setZoomLevel(map.getZoom());
		},
	});

	return null;
};

const CustomMap = () => {
	const dispatch = useDispatch();
	const dataObjectsInMap = useSelector(state => state.dataObjectsInMap);
	const { windowSize } = useCheckWidth();
	const [isMobile, setIsMobile] = useState(false);
	// const [isZoom, setIsZoom] = useState(false); HELP: ДЛЯ ОТРИСОВКИ МАРКЕРОВ ТОЛЬКО НА ВИДИМОЙ ЧАСТИ КАРТЫ

	useEffect(() => {
		if (windowSize.width <= 767.98) {
			setIsMobile(true);
		}
	}, [windowSize.width]);

	useEffect(() => {
		console.log('ok');
	}, [dataObjectsInMap]);

	const [zoomLevel, setZoomLevel] = useState(13);

	return (
		<MapContainer
			center={[55.7522, 37.6156]}
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
			<MarkerClusterGroup chunkedLoading>
				{/* {(isZoom HELP: ДЛЯ ОТРИСОВКИ МАРКЕРОВ ТОЛЬКО НА ВИДИМОЙ ЧАСТИ КАРТЫ
					? dataObjectsInMap?.visiblePoints
					: dataObjectsInMap?.points?.points
				)?.map(object => { */}
				{dataObjectsInMap?.points?.points?.map(object => {
					if (object && object.crd) {
						const getObjectInfo = async () => {
							if (isMobile) dispatch(viewSettingsAction.activeSettingsMap(''));
							dispatch(viewSettingsAction.toggleObjectInfo());

							try {
								dispatch(viewSettingsAction.activeLoadingObject());

								const responce = await $axios.get(
									`/api/object_info.php?id=${object.id}`
								);
								console.log(responce);

								dispatch(dataObjectInfoAction.addObjectInfo(responce.data));
								dispatch(viewSettingsAction.defaultFilters());
							} catch (error) {
								console.log(error);
							} finally {
								dispatch(viewSettingsAction.defaultLoadingObject());
							}
						};

						let customMarkerIcon;

						if (zoomLevel >= 16 && object.polygon) {
							// Если уровень зума 16 или больше и у объекта есть полигон, отображаем полигон
							return (
								<Polygon
									key={object.id}
									positions={object.polygon}
									color={ARGBtoHEX(object.color)}
									eventHandlers={{ click: getObjectInfo }}
								>
									<Popup>{object.name}</Popup>
								</Polygon>
							);
						} else {
							// Иначе отображаем маркер
							customMarkerIcon = divIcon({
								className: 'my-custom-icon',
								iconSize: [10, 10],
								html: renderToStaticMarkup(
									<IconMarker
										key={object.id}
										srcIcon={object.icon}
										colorIcon={object.color}
									/>
								),
							});
						}

						return (
							<Marker
								key={object.id}
								position={object.crd}
								icon={customMarkerIcon}
								eventHandlers={{ click: getObjectInfo }}
							>
								<Popup>{object.name}</Popup>
							</Marker>
						);
					}
				})}
			</MarkerClusterGroup>
			{/* <UpdateMarkers HELP: ДЛЯ ОТРИСОВКИ МАРКЕРОВ ТОЛЬКО НА ВИДИМОЙ ЧАСТИ КАРТЫ
				dataObjectsInMap={dataObjectsInMap}
				setIsZoom={setIsZoom}
			/> */}
		</MapContainer>
	);
};

export default CustomMap;

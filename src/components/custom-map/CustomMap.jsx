import { divIcon } from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { useEffect, useState } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { MapContainer, Marker, Popup, TileLayer } from 'react-leaflet';
import MarkerClusterGroup from 'react-leaflet-cluster';
import { useDispatch, useSelector } from 'react-redux';
import { $axios } from '../../api';
import { useCheckWidth } from '../../hooks/useCheckWidth.js';
import { actions as dataObjectInfoAction } from '../../store/data-object-info/DataObjectInfo.slice';
import { actions as viewSettingsAction } from '../../store/view-settings/ViewSettings.slice';
import IconMarker from '../icon-marker/IconMarker';

const CustomMap = () => {
	const dispatch = useDispatch();
	const dataObjectsInMap = useSelector(state => state.dataObjectsInMap);
	const { windowSize, setWindowSize } = useCheckWidth();
	const [isMobile, setIsMobile] = useState(false);

	useEffect(() => {
		if (windowSize.width <= 767.98) {
			setIsMobile(true);
		}
	}, [windowSize.width]);

	useEffect(() => {
		console.log('ok');
	}, [dataObjectsInMap]);

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
			<MarkerClusterGroup chunkedLoading>
				{dataObjectsInMap?.points?.map(object => {
					if (object && object.crd) {
						const customMarkerIcon = divIcon({
							className: 'my-custom-icon',
							iconSize: [10, 10],
							html: renderToStaticMarkup(
								<IconMarker srcIcon={object.icon} colorIcon={object.color} />
							),
						});

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
					// const customMarkerIcon = divIcon({
					// 	className: 'my-custom-icon',
					// 	iconSize: [10, 10],
					// 	html: renderToStaticMarkup(
					// 		<IconMarker srcIcon={object.icon} colorIcon={object.color} />
					// 	),
					// });

					// const getObjectInfo = async () => {
					// 	dispatch(viewSettingsAction.toggleObjectInfo());

					// 	try {
					// 		dispatch(viewSettingsAction.activeLoadingObject());

					// 		const responce = await $axios.get(
					// 			`/api/object_info.php?id=${object.id}`
					// 		);
					// 		console.log(responce);

					// 		dispatch(dataObjectInfoAction.addObjectInfo(responce.data));
					// 		dispatch(viewSettingsAction.defaultFilters());
					// 		if (isMobile) dispatch(viewSettingsAction.activeSettingsMap(''));
					// 	} catch (error) {
					// 		console.log(error);
					// 	} finally {
					// 		dispatch(viewSettingsAction.defaultLoadingObject());
					// 	}
					// };

					// return (
					// 	<Marker
					// 		key={object.id}
					// 		position={object.crd}
					// 		icon={customMarkerIcon}
					// 		eventHandlers={{ click: getObjectInfo }}
					// 	>
					// 		<Popup>{object.name}</Popup>
					// 	</Marker>
					// );
				})}
			</MarkerClusterGroup>
		</MapContainer>
	);
};

export default CustomMap;

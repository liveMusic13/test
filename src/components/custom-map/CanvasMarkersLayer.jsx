import L from 'leaflet';
import { useEffect, useRef, useState } from 'react';
import { useMap } from 'react-leaflet';
import { useDispatch, useSelector } from 'react-redux';
import { $axios } from '../../api';
import { actions as dataObjectInfoAction } from '../../store/data-object-info/DataObjectInfo.slice';
import { actions as viewSettingsAction } from '../../store/view-settings/ViewSettings.slice';
import { ARGBtoHEX } from '../../utils/convertColor';

const CanvasMarkersLayer = ({ markersData, isMobile, zoomLevel }) => {
	const dataObjectInfo = useSelector(state => state.dataObjectInfo);
	const map = useMap();
	const dispatch = useDispatch();
	const markersRef = useRef([]);
	const polygonsRef = useRef([]);
	const [redrawMarker, setRedrawMarker] = useState(0);

	const getInfoObject = marker => async () => {
		if (isMobile) dispatch(viewSettingsAction.activeSettingsMap(''));
		dispatch(viewSettingsAction.toggleObjectInfo());

		try {
			dispatch(viewSettingsAction.activeLoadingObject());

			const response = await $axios.get(`/api/object_info.php?id=${marker.id}`);
			console.log(response);

			dispatch(dataObjectInfoAction.addObjectInfo(response.data));
			dispatch(viewSettingsAction.defaultFilters());
		} catch (error) {
			console.log(error);
		} finally {
			dispatch(viewSettingsAction.defaultLoadingObject());
			setRedrawMarker(prev => prev + 1);
		}
	};

	useEffect(() => {
		const canvasLayer = L.canvas({ padding: 0.5 }).addTo(map);

		markersRef.current.forEach(marker => map.removeLayer(marker));
		markersRef.current = [];
		polygonsRef.current.forEach(polygon => map.removeLayer(polygon));
		polygonsRef.current = [];

		map.whenReady(() => {
			if (zoomLevel >= 16) {
				markersRef.current.forEach(marker => map.removeLayer(marker));
				markersRef.current = [];
			} else {
				polygonsRef.current.forEach(polygon => map.removeLayer(polygon));
				polygonsRef.current = [];
			}

			for (let marker of markersData) {
				let mapObject;

				if (zoomLevel >= 16 && marker.polygon && marker.polygon.length > 0) {
					mapObject = new L.Polygon(marker.polygon, {
						renderer: canvasLayer,
						color: ARGBtoHEX(marker.color),
					}).addTo(map);

					polygonsRef.current.push(mapObject);
				} else {
					// mapObject = new L.CircleMarker(marker.crd, {
					// 	renderer: canvasLayer,
					// 	radius: 5,
					// 	color: ARGBtoHEX(marker.color),
					// }).addTo(map);
					mapObject = new L.Polygon(
						[
							[marker.crd[0], marker.crd[1] - 0.001], // Верхняя левая точка
							[marker.crd[0] + 0.0003, marker.crd[1] + 0.0002], // Верхняя правая точка
							[marker.crd[0], marker.crd[1] + 0.0012], // Нижняя правая точка
							[marker.crd[0] - 0.001, marker.crd[1] + 0.0012],
							[marker.crd[0] - 0.001, marker.crd[1] - 0.001],
						],
						{ color: 'black', renderer: canvasLayer }
					).addTo(map);

					mapObject = new L.Polygon(
						[
							[marker.crd[0], marker.crd[1] - 0.0009], // Верхняя левая точка
							[marker.crd[0] + 0.0002, marker.crd[1] + 0.0001], // Верхняя правая точка
							[marker.crd[0], marker.crd[1] + 0.0011], // Нижняя правая точка
							[marker.crd[0] - 0.0009, marker.crd[1] + 0.0011],
							[marker.crd[0] - 0.0009, marker.crd[1] - 0.0008],
						],
						{ color: ARGBtoHEX(marker.color), renderer: canvasLayer }
					).addTo(map);

					if (marker.id === dataObjectInfo.id) {
						// Если id маркера совпадает с выбранным id, применяем специальный стиль
						// mapObject.setStyle({
						// 	color: 'red', // Измените цвет на желаемый
						// 	shadowBlur: 1000, // Добавьте тень
						// });
						// mapObject.redraw();
						console.log(marker);

						// L.polyline(
						// 	[
						// 		[marker.crd[0], marker.crd[1] - 0.001],
						// 		[marker.crd[0] + 0.0005, marker.crd[1] + 0.0005],
						// 		[marker.crd[0] - 0.00009, marker.crd[1]],
						// 		// [marker.crd[0] , marker.crd[1] + 0.0015],
						// 		// [marker.crd[0] - 0.001, marker.crd[1] + 0.001],
						// 	],
						// 	{ color: ARGBtoHEX(marker.color) }
						// ).addTo(map);
						L.polygon(
							[
								[marker.crd[0], marker.crd[1] - 0.001], // Верхняя левая точка
								[marker.crd[0] + 0.0003, marker.crd[1] + 0.0002], // Верхняя правая точка
								[marker.crd[0], marker.crd[1] + 0.0012], // Нижняя правая точка
								[marker.crd[0] - 0.001, marker.crd[1] + 0.0012],
								[marker.crd[0] - 0.001, marker.crd[1] - 0.001],
							],
							{ color: 'black' }
						).addTo(map);

						L.polygon(
							[
								[marker.crd[0], marker.crd[1] - 0.0009], // Верхняя левая точка
								[marker.crd[0] + 0.0002, marker.crd[1] + 0.0001], // Верхняя правая точка
								[marker.crd[0], marker.crd[1] + 0.0011], // Нижняя правая точка
								[marker.crd[0] - 0.0009, marker.crd[1] + 0.0011],
								[marker.crd[0] - 0.0009, marker.crd[1] - 0.0008],
							],
							{ color: ARGBtoHEX(marker.color) }
						).addTo(map);
					}

					markersRef.current.push(mapObject);
				}
				mapObject.on('click', getInfoObject(marker, mapObject));
				mapObject.bindPopup(marker.name);
			}
		});

		console.log('render marker');
	}, [map, markersData, zoomLevel, redrawMarker]);

	return null;
};

export default CanvasMarkersLayer;

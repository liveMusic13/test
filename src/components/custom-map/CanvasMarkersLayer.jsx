import L from 'leaflet';
import { useEffect, useRef } from 'react';
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

	const getInfoObject =
		(marker, mapObject, markersRef, polygonsRef) => async () => {
			if (isMobile) dispatch(viewSettingsAction.activeSettingsMap(''));
			dispatch(viewSettingsAction.toggleObjectInfo());

			try {
				dispatch(viewSettingsAction.activeLoadingObject());

				const response = await $axios.get(
					`/api/object_info.php?id=${marker.id}`
				);
				console.log(response);

				dispatch(dataObjectInfoAction.addObjectInfo(response.data));
				dispatch(viewSettingsAction.defaultFilters());
			} catch (error) {
				console.log(error);
			} finally {
				dispatch(viewSettingsAction.defaultLoadingObject());

				// if (marker.id === dataObjectInfo.id) {
				// 	// Если id маркера совпадает с выбранным id, применяем специальный стиль
				// 	mapObject.setStyle({
				// 		color: 'red', // Измените цвет на желаемый
				// 		shadowBlur: 100, // Добавьте тень
				// 	});
				// 	mapObject.redraw();
				// }
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
					mapObject = new L.CircleMarker(marker.crd, {
						renderer: canvasLayer,
						radius: 5,
						color: ARGBtoHEX(marker.color),
					}).addTo(map);

					if (marker.id === dataObjectInfo.id) {
						// Если id маркера совпадает с выбранным id, применяем специальный стиль
						mapObject.setStyle({
							color: 'red', // Измените цвет на желаемый
							shadowBlur: 100, // Добавьте тень
						});
						mapObject.redraw();
					}

					markersRef.current.push(mapObject);
				}
				// mapObject.on('click', getInfoObject(marker, mapObject));
				mapObject.on('click', getInfoObject(marker));
				mapObject.bindPopup(marker.name);
			}
		});

		console.log('render marker', markersData);
	}, [map, markersData, zoomLevel]);

	return null;
};

export default CanvasMarkersLayer;

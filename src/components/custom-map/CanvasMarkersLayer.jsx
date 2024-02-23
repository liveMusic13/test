import L from 'leaflet';
import { useEffect, useRef } from 'react';
import { useMap } from 'react-leaflet';
import { useDispatch, useSelector } from 'react-redux';
import { $axios } from '../../api';
import { actions as dataObjectInfoAction } from '../../store/data-object-info/DataObjectInfo.slice';
import { actions as viewSettingsAction } from '../../store/view-settings/ViewSettings.slice';
import { ARGBtoHEX } from '../../utils/convertColor';
import { getIconForMarker } from '../../utils/iconForMarker';

const CanvasMarkersLayer = ({ markersData, isMobile }) => {
	const dataObjectInfo = useSelector(state => state.dataObjectInfo);
	const map = useMap();
	const dispatch = useDispatch();
	const markersRef = useRef([]);
	const polygonsRef = useRef([]);
	const bounds = map.getBounds();
	const canvasLayerRef = useRef(null);
	const targetMarker = useRef(null);

	const getInfoObject = marker => async () => {
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

	useEffect(() => {
		if (canvasLayerRef.current) {
			map.removeLayer(canvasLayerRef.current);
		}

		markersRef.current.forEach(marker => map.removeLayer(marker));
		markersRef.current = [];
		polygonsRef.current.forEach(polygon => map.removeLayer(polygon));
		polygonsRef.current = [];

		canvasLayerRef.current = L.canvas({ padding: 0.5 });
		canvasLayerRef.current.addTo(map);

		const zoomLevels = map.getZoom();

		if (zoomLevels >= 17) {
			markersRef.current.forEach(marker => map.removeLayer(marker));
			markersRef.current = [];
		} else {
			polygonsRef.current.forEach(polygon => map.removeLayer(polygon));
			polygonsRef.current = [];
		}

		for (let marker of markersData) {
			let mapObject;
			const zoomLevelsForCircle = map.getZoom();

			if (
				zoomLevelsForCircle < 17 ||
				!marker.polygon ||
				marker.polygon.length === 0
			) {
				mapObject = new L.CircleMarker(marker.crd, {
					renderer: canvasLayerRef.current,
					radius: 5,
					color:
						dataObjectInfo.id === marker.id ? 'red' : ARGBtoHEX(marker.color),
				}).addTo(map);

				mapObject.on('click', getInfoObject(marker));
				mapObject.bindPopup(marker.name);
			}
		}

		function handleMoveEndZoomEnd() {
			let bounds = map.getBounds();
			const zoomLevelForIcon = map.getZoom();

			for (let marker of markersData) {
				if (
					zoomLevelForIcon >= 17 &&
					marker.polygon &&
					marker.polygon.length > 0 &&
					bounds.contains(marker.crd)
				) {
					let svg = getIconForMarker(marker); // ПОЛУЧАЕМ МАРКЕР
					let encodedSvg = encodeURIComponent(svg); // КОНВЕРТИРУЕМ В ССЫЛКУ
					let dataUrl = 'data:image/svg+xml,' + encodedSvg; // ДОБАВЛЯЕМ К НЕМУ DATA И ТЕПЕРЬ ЭТО ССЫЛКА НА КАРТИНКУ

					const icon = L.icon({
						// СОЗДАЕМ ИКОНКУ
						iconUrl:
							dataObjectInfo.id === marker.id
								? '../images/icons/target.svg'
								: dataUrl,
						iconSize: dataObjectInfo.id === marker.id ? [60, 58] : [20, 18],
						iconAnchor: dataObjectInfo.id === marker.id ? [22, 21] : [10, 9],
					});

					let mapObject = L.marker(marker.crd, {
						icon: icon,
					}).addTo(map);
					polygonsRef.current.push(mapObject);

					// Если это маркер таргета, сохраняем ссылку на него
					if (dataObjectInfo.id === marker.id) {
						if (targetMarker.current) {
							// Если уже есть маркер таргета, удаляем его
							map.removeLayer(targetMarker.current);
							targetMarker.current = null;
						} else {
							targetMarker.current = mapObject;
						}
					}

					mapObject.on('click', getInfoObject(marker));
					mapObject.bindPopup(marker.name);
				}
			}
		}

		map.on('moveend zoomend', handleMoveEndZoomEnd);

		function updateMarkers() {
			//HELP: функция смещает координаты с центра, чтобы имитировать движение по карте. Это решает проблему, в которой при подгрузке данных или зуме, не отображался новый холст пока не передвинешь карту мышкой
			var center = map.getCenter();
			center.lat += 0.0001;
			map.panTo(center);
		}
		updateMarkers();

		return () => {
			// Удаление обработчика событий при очистке эффекта
			map.off('moveend zoomend', handleMoveEndZoomEnd);
		};
	}, [map, markersData, bounds, dataObjectInfo]);
	return null;
};

export default CanvasMarkersLayer;

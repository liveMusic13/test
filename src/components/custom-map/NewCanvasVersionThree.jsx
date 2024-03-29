import '@ftsinc/leaflet-canvas-marker';
import L from 'leaflet';
import { useEffect, useRef } from 'react';
import { useMap } from 'react-leaflet';
import { useDispatch, useSelector } from 'react-redux';
import { $axios } from '../../api';
import { actions as dataObjectInfoAction } from '../../store/data-object-info/DataObjectInfo.slice';
import { actions as viewSettingsAction } from '../../store/view-settings/ViewSettings.slice';
import { ARGBtoHEX } from '../../utils/convertColor';
import { getIconForMarker } from '../../utils/iconForMarker';

const NewCanvasVersionThree = ({ isMobile, zoomLevel }) => {
	const dispatch = useDispatch();
	const map = useMap();
	const dataObjectsInMap = useSelector(state => state.dataObjectsInMap);
	const markersData = dataObjectsInMap.points.points;
	const dataObjectInfo = useSelector(state => state.dataObjectInfo);
	const markersRef = useRef([]); //МАРКЕРЫ В ВИДЕ ИКОНОК
	const polygonsRef = useRef([]); //ПОЛИГОНЫ
	const canvasLayerRef = useRef(null);

	const getInfoObject = async id => {
		//ЗАПРОС НА ПОЛУЧЕНИЕ ИНФОРМАЦИИ ОБ ОБЪЕКТЕ В ТАРГЕТЕ
		if (isMobile) dispatch(viewSettingsAction.activeSettingsMap(''));
		dispatch(viewSettingsAction.toggleObjectInfo());

		try {
			dispatch(viewSettingsAction.activeLoadingObject());

			const response = await $axios.get(`/api/object_info.php?id=${id}`);
			console.log(response);

			dispatch(dataObjectInfoAction.addObjectInfo(response.data));
			dispatch(viewSettingsAction.defaultFilters());
		} catch (error) {
			console.log(error);
		} finally {
			dispatch(viewSettingsAction.defaultLoadingObject());
		}
	};
	useEffect(() => {
		if (!map || markersData.length === 0) return;

		// if (canvasLayerRef.current && map.hasLayer(canvasLayerRef.current)) {
		// 	map.removeLayer(canvasLayerRef.current);
		// }

		canvasLayerRef.current = L.canvasIconLayer({});
		canvasLayerRef.current.addTo(map);

		console.log(canvasLayerRef.current);

		markersRef.current.forEach(marker => {
			canvasLayerRef.current.removeMarker(marker);
		}); //УДАЛЕНИЕ МАРКЕРОВ И ПОЛИГОНОВ ПРИ СОЗДАНИИ КАРТЫ, ЧТОБЫ ОБНОВЛЯЛИСЬ ЗНАЧКИ ПРИ КЛИКЕ И ПРОЧЕМ
		markersRef.current = [];
		polygonsRef.current.forEach(polygon => map.removeLayer(polygon));
		polygonsRef.current = [];

		canvasLayerRef.current.addOnClickListener(function (e, data) {
			// ОБРАБОТЧИК КЛИКА
			let id_marker = data[0].data.options.data_marker.id; // ЗАБИРАЕМ ID ДЛЯ ЗАПРОСА ИНФОРМАЦИИ ОБ ОБЪЕКТЕ

			getInfoObject(id_marker); // ЗАПРОС НА СЕРВЕР
		});

		map.whenReady(() => {
			if (zoomLevel >= 16) {
				//ТАКОЕ ЖЕ ОБНУЛЕНИЕ ЧТО И ВЫШЕ,ТОЛЬКО ОТДЕЛЬНО ДЛЯ КАЖДОГО МАССИВА ЛИБО ПОЛИГОНОВ ЛИБО МАРКЕРОВ, В ЗАВИСИМОСТИ ОТ ЗУМА
				markersRef.current.forEach(marker => {
					canvasLayerRef.current.removeMarker(marker);
				}); //TODO: ЕСЛИ СДЕЛАТЬ УДАЛЕНИЕ СО СЛОЯ ПЛАГИНА, БУДЕТ ОШИБКА. А ЭТО И ЕСТЬ ПРОБЛЕМА ОБНОВЛЕНИЯ
				markersRef.current = [];
			} else {
				polygonsRef.current.forEach(polygon => map.removeLayer(polygon));
				polygonsRef.current = [];
			}

			for (let marker of markersData) {
				//ПЕРЕБИРАЕМ МАССИВ ОБЪЕКТОВ
				let mapObject; // КОНКРЕТНЫЙ ОБЪЕКТ, КОТОРЫЙ ПОТОМ БУДЕТ ПУШИТСЯ В МАССИВ МАРКЕРОВ ИЛИ ПОЛИГОНОВ
				if (zoomLevel >= 16 && marker.polygon && marker.polygon.length > 0) {
					mapObject = new L.Polygon(marker.polygon, {
						// СОЗДАЕМ ПОЛИГОН
						color: ARGBtoHEX(marker.color), // ЗАБИРАЕМ ЦВЕТ ИЗ ОБЪЕКТА, ПЕРЕВОДИМ В ХЭШ И КРАСИМ
					}).addTo(map); // ДОБАВЛЯЕМ НА КАРТУ

					polygonsRef.current.push(mapObject); //ПУШИМ В МАССИВ ПОЛИГОНОВ
				} else {
					let svg = getIconForMarker(marker); // ПОЛУЧАЕМ МАРКЕР
					let encodedSvg = encodeURIComponent(svg); // КОНВЕРТИРУЕМ В ССЫЛКУ
					let dataUrl = 'data:image/svg+xml,' + encodedSvg; // ДОБАВЛЯЕМ К НЕМУ DATA И ТЕПЕРЬ ЭТО ССЫЛКА НА КАРТИНКУ

					const icon = L.icon({
						// СОЗДАЕМ ИКОНКУ
						iconUrl: dataUrl,
						iconSize: [20, 18],
						iconAnchor: [10, 9],
					});

					mapObject = L.marker(marker.crd, { icon, data_marker: marker }); // СОЗДАЕМ МАРКЕР С КАСТОМНОЙ ИКОНКОЙ И ДОБАВЛЯЕМ НА КАРТУ
					markersRef.current.push(mapObject); // ПУШИМ В МАССИВ МАРКЕРОВ
					canvasLayerRef.current.addLayers([mapObject]);
				}

				mapObject.bindPopup(marker.name); //ДОБАВЛЯЕМ ВСЕМ ОБЪЕКТАМ НА КАРТЕ, И ПОЛИГОНАМ И МАРКЕРАМ, ПОПАПЫ
				mapObject.on('click', () => getInfoObject(marker.id));
			} // СТАНДАРТНЫЙ КОД ГДЕ И МАРКЕРЫ И ПОЛИГОНЫ ВИДНЫ
		});

		canvasLayerRef.current.addLayers(markersRef.current); //ДОБАВЛЕНИЕ НА СЛОЙ КАРТИНОК
		console.log('render MARKERS OR POLYGON');
	}, [map, markersData, zoomLevel]); // ОТСЛЕЖИВАЕМ И ВЫЗЫВАЕМ РЕРЕНДЕР ПРИ ИЗМЕНЕНИИ ЗУМА, ДАННЫХ ОБ ОБЪЕКТАХ И КАРТЫ

	return null;
};

export default NewCanvasVersionThree;

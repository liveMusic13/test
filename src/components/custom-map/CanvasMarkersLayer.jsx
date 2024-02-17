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

		L.Canvas.include({
			_updateImg(layer) {
				//Метод добавления img на Canvas-слой
				const { img } = layer.options;
				const p = layer._point.round();
				this._ctx.drawImage(
					img.el,
					p.x - img.size[0] / 2,
					p.y - img.size[1] / 2,
					img.size[0],
					img.size[1]
				);
			},
		});

		const CanvasMarker = L.CircleMarker.extend({
			_updatePath() {
				if (!this.options.img.el) {
					if (this.options.imageCache[this.options.img.url]) {
						this.options.img.el = this.options.imageCache[this.options.img.url];
						this.redraw();
						return;
					}

					//Создаем элемент IMG
					const img = document.createElement('img');
					img.src = this.options.img.url;
					this.options.img.el = img;
					img.onload = () => {
						this.options.imageCache[this.options.img.url] = img;
						this.redraw(); //После загрузки запускаем перерисовку
					};
				} else {
					this._renderer._updateImg(this); //Вызываем _updateImg
				}
			},
		});

		const customMarker = (L.canvasMarker = function (...options) {
			return new CanvasMarker(...options);
		});

		console.log(customMarker());

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

					mapObject = new customMarker(marker.crd, {
						img: {
							url: '../images/icons/target.svg',
							size: [20, 20],
						},
					});
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

import { divIcon } from 'leaflet';
import 'leaflet/dist/leaflet.css';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { Marker, Polygon, Popup } from 'react-leaflet';
import { useDispatch, useSelector } from 'react-redux';
import { $axios } from '../../api.js';
import { actions as dataObjectInfoAction } from '../../store/data-object-info/DataObjectInfo.slice.js';
import { actions as viewSettingsAction } from '../../store/view-settings/ViewSettings.slice.js';
import { ARGBtoHEX } from '../../utils/convertColor.js';
import IconMarker from '../icon-marker/IconMarker.jsx';

const RenderMarkers = ({ isMobile, zoomLevel }) => {
	const dispatch = useDispatch();
	const dataObjectsInMap = useSelector(state => state.dataObjectsInMap);
	const dataObjectInfo = useSelector(state => state.dataObjectInfo);

	return (
		<>
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
						} catch (error) {
							console.log(error);
						} finally {
							dispatch(viewSettingsAction.defaultLoadingObject());
						}
					};

					let customMarkerIcon;

					if (zoomLevel >= 16 && object.polygon && object.polygon.length > 0) {
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
							className:
								dataObjectInfo.id === object.id
									? 'my-custom-icon_target'
									: 'my-custom-icon',
							iconSize: [23, 23],
							html: renderToStaticMarkup(
								<IconMarker key={object.id} object={object} />
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
		</>
	);
};

export default RenderMarkers;

import { useMapEvents } from 'react-leaflet';

const ZoomTracker = ({ setZoomLevel }) => {
	const map = useMapEvents({
		zoomend: () => {
			setZoomLevel(map.getZoom());
		},
	});

	return null;
};

export default ZoomTracker;

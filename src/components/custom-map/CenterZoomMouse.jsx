import { useState } from 'react';
import { useMapEvents } from 'react-leaflet';

const CenterZoomMouse = () => {
	const [cursorPosition, setCursorPosition] = useState(null);

	const map = useMapEvents({
		zoomend: () => {
			if (cursorPosition) {
				map.setView(cursorPosition, map.getZoom());
			}
		},
		mousemove: e => {
			// setCursorPosition([e.latlng.lat, e.latlng.lng + 0.012]);
			setCursorPosition(e.latlng);
		},
	});

	return null;
};

export default CenterZoomMouse;

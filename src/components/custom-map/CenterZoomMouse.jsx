import { useState } from 'react';
import { useMapEvents } from 'react-leaflet';

const CenterZoomMouse = () => {
	const [cursorPosition, setCursorPosition] = useState(null);
	const [count, setCount] = useState(0);

	const map = useMapEvents({
		// zoomend: () => {
		// 	if (cursorPosition) {
		// 		map.setView(cursorPosition, map.getZoom());
		// 		// map.flyTo(cursorPosition);
		// 		// setCount(1);
		// 		// const timer = setTimeout(() => {
		// 		// 	setCount(0);
		// 		// }, 1000);
		// 		// return () => clearTimeout(timer);
		// 	}
		// },
		// mousemove: e => {
		// 	// setCursorPosition([e.latlng.lat, e.latlng.lng + 0.012]);
		// 	setCursorPosition(e.latlng);
		// },
		wheel: e => {
			if (e.originalEvent.deltaY < 0) {
				map.zoomIn(map.options.zoomSnap, { around: e.latlng });
			} else {
				map.zoomOut(map.options.zoomSnap, { around: e.latlng });
			}
		},
	});

	return null;
};

export default CenterZoomMouse;

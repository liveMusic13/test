import { useDispatch } from 'react-redux';
import { actions as dataObjectsInMapAction } from '../store/data-objects-in-map/DataObjectsInMap.slice';

export const useSearchObjectInMap = () => {
	const dispatch = useDispatch();

	const newCenter = arr => {
		dispatch(dataObjectsInMapAction.addNewCenter(arr));
	};

	return { newCenter };
};

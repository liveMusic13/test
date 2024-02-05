import {
	combineReducers,
	configureStore,
	createSerializableStateInvariantMiddleware,
	isPlain,
	Tuple,
} from '@reduxjs/toolkit';
import { Iterable } from 'immutable';
import { reducer as dataFilters } from './data-filters/DataFilters.slice';
import { reducer as dataObjectInfo } from './data-object-info/DataObjectInfo.slice';
import { reducer as dataObjectsInMap } from './data-objects-in-map/DataObjectsInMap.slice';
import { reducer as userMap } from './user-map/UserMap.slice';
import { reducer as viewSettings } from './view-settings/ViewSettings.slice';

const reducers = combineReducers({
	viewSettings: viewSettings,
	dataObjectsInMap: dataObjectsInMap,
	dataObjectInfo: dataObjectInfo,
	userMap: userMap,
	dataFilters: dataFilters,
});

const isSerializable = value => Iterable.isIterable(value) || isPlain(value);

const getEntries = value =>
	Iterable.isIterable(value) ? value.entries() : Object.entries(value);

const serializableMiddleware = createSerializableStateInvariantMiddleware({
	isSerializable,
	getEntries,
});

export const store = configureStore({
	reducer: reducers,
	middleware: () => new Tuple(serializableMiddleware),
});

export const transformFieldForSelect = array => {
	return array.map(obj => ({
		value: obj.item_id,
		label: obj.item_name,
	}));
};

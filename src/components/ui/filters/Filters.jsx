import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { $axios } from '../../../api';
import { actions as dataObjectsInMapAction } from '../../../store/data-objects-in-map/DataObjectsInMap.slice';
import { actions as viewSettingsAction } from '../../../store/view-settings/ViewSettings.slice';
import BlockInput from '../block-input/BlockInput';
import CustomSelect from '../custom-select/CustomSelect';
import Input from '../input/Input';
import styles from './Filters.module.scss';

const Filters = ({ isDisplay }) => {
	const dispatch = useDispatch();
	const dataFilters = useSelector(state => state.dataFilters);
	const adresFilterString = useSelector(state => state.adresFilterString);
	const [clearFilter, setClearFilter] = useState(false);

	const getFiltersObjects = async () => {
		try {
			if (adresFilterString.srcRequest === '') {
				const responce = await $axios.get(`/api/get_objects.php?map=${map}`);
				dispatch(dataObjectsInMapAction.addDataObjectsInMap(responce.data));
			} else {
				const responce = await $axios.get(
					`/api/get_objects.php${adresFilterString.srcRequest}`
				);
				dispatch(dataObjectsInMapAction.addDataObjectsInMap(responce.data));
			}
			if (window.innerWidth <= 767.98) {
				dispatch(viewSettingsAction.toggleSettingsMap(''));
				dispatch(viewSettingsAction.defaultFilters(''));
			}
		} catch (error) {
			console.log(error);
		}
	};

	return (
		<div
			className={styles.block__filters}
			style={isDisplay ? {} : { display: 'none' }}
		>
			<h2 className={styles.title}>Фильтры</h2>
			<div className={styles.wrapper_block__filters}>
				{dataFilters?.map(field => {
					if (field.type === 'number') {
						return (
							<BlockInput
								key={field.id}
								title={field.caption}
								id={field.id}
								clearFilter={clearFilter}
							/>
						);
					} else {
						return (
							<CustomSelect
								key={field.id}
								isMultiChoice={field.multiple === 1 ? true : false}
								title={field.caption}
								isImage={field.multiple === 1 ? true : false}
								dataSelect={field}
								clearFilter={clearFilter}
							/>
						);
					}
				})}
				<Input
					placeholder='От'
					name={`fix_bag_247`}
					clearFilter={clearFilter}
				/>
				<div className={styles.block__buttons}>
					<button
						className={styles.button_clear}
						onClick={() => {
							setClearFilter(true);
							console.log('clear test');
							const timeoutId = setTimeout(() => {
								setClearFilter(false);
							}, 1000);
							return () => clearTimeout(timeoutId);
						}}
					>
						очистить
					</button>
					<button className={styles.button} onClick={getFiltersObjects}>
						показать
					</button>
				</div>
			</div>
		</div>
	);
};

export default Filters;

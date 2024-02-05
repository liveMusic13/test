import { useSelector } from 'react-redux';
import { $axios } from '../../../api';
import BlockInput from '../block-input/BlockInput';
import CustomSelect from '../custom-select/CustomSelect';
import styles from './Filters.module.scss';

const Filters = ({ isDisplay }) => {
	const dataFilters = useSelector(state => state.dataFilters);
	const adresFilterString = useSelector(state => state.adresFilterString);
	const userMap = useSelector(state => state.userMap);

	const getFiltersObjects = async () => {
		try {
			const responce = await $axios.get(
				`/api/get_objects.php?map=${userMap}${adresFilterString}`
			);
			console.log(responce.data);
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
				{dataFilters.map(field => {
					if (field.type === 'number') {
						return (
							<BlockInput
								key={field.id}
								title={field.caption}
								name={field.name}
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
							/>
						);
					}
				})}
				<div className={styles.block__buttons}>
					<button className={styles.button_clear}>очистить</button>
					<button className={styles.button} onClick={getFiltersObjects}>
						показать
					</button>
				</div>
			</div>
		</div>
	);
};

export default Filters;

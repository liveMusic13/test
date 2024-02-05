import { useSelector } from 'react-redux';
import BlockInput from '../block-input/BlockInput';
import CustomSelect from '../custom-select/CustomSelect';
import styles from './Filters.module.scss';

const Filters = ({ isDisplay }) => {
	const dataFilters = useSelector(state => state.dataFilters);

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
					<button className={styles.button}>показать</button>
				</div>
			</div>
		</div>
	);
};

export default Filters;

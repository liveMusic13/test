import CustomSelect from '../custom-select/CustomSelect';
import Input from '../input/Input';
import styles from './Filters.module.scss';

const Filters = ({ isDisplay }) => {
	return (
		<div
			className={styles.block__filters}
			style={isDisplay ? {} : { display: 'none' }}
		>
			<h2 className={styles.title}>Фильтры</h2>
			<div className={styles.block__inputs}>
				<h2 className={styles.title__inputs}>Количество</h2>
				<div className={styles.inputs}>
					<Input placeholder='От' />
					<Input placeholder='До' />
				</div>
			</div>
			<CustomSelect isMultiChoice={true} title='Тип клиента' isImage={true} />
			<CustomSelect isMultiChoice={false} title='Агент' isImage={false} />
			<CustomSelect isMultiChoice={false} title='test' isImage={false} />
			<CustomSelect isMultiChoice={true} title='Округа' isImage={true} />
			<div className={styles.block__buttons}>
				<button className={styles.button_clear}>очистить</button>
				<button className={styles.button}>показать</button>
			</div>
		</div>
	);
};

export default Filters;

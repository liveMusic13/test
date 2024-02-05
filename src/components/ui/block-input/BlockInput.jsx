import Input from '../input/Input';
import styles from './BlockInput.module.scss';

const BlockInput = ({ title, name, clearFilter }) => {
	return (
		<div className={styles.block__inputs}>
			<h2 className={styles.title__inputs}>{title}</h2>
			<div className={styles.inputs}>
				<Input
					placeholder='От'
					name={`${name}_from`}
					clearFilter={clearFilter}
				/>
				<Input placeholder='До' name={`${name}_to`} clearFilter={clearFilter} />
			</div>
		</div>
	);
};

export default BlockInput;

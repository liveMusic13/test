import Input from '../input/Input';
import styles from './BlockInput.module.scss';

const BlockInput = ({ title, id, clearFilter }) => {
	return (
		<div className={styles.block__inputs}>
			<h2 className={styles.title__inputs}>{title}</h2>
			<div className={styles.inputs}>
				<Input
					placeholder='От'
					name={`num_from[${id}]`}
					clearFilter={clearFilter}
				/>
				<Input
					placeholder='До'
					name={`num_to[${id}]`}
					clearFilter={clearFilter}
				/>
			</div>
		</div>
	);
};

export default BlockInput;

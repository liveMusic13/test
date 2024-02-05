import Input from '../input/Input';
import styles from './BlockInput.module.scss';

const BlockInput = ({ title, name }) => {
	return (
		<div className={styles.block__inputs}>
			<h2 className={styles.title__inputs}>{title}</h2>
			<div className={styles.inputs}>
				<Input placeholder='От' name={`${name}_from`} />
				<Input placeholder='До' name={`${name}_to`} />
			</div>
		</div>
	);
};

export default BlockInput;

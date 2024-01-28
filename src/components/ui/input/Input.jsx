import { useState } from 'react';
import styles from './Input.module.scss';

const Input = ({ placeholder }) => {
	const [test, setTest] = useState('');

	return (
		<input
			className={styles.input}
			placeholder={placeholder}
			type='text'
			value={test}
			onChange={event => setTest(event.target.value)}
			style={test !== '' ? { borderBottom: '1px solid #26a69a' } : {}}
		/>
	);
};

export default Input;

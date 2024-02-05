import { debounce } from 'lodash';
import { useState } from 'react';
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import styles from './Input.module.scss';

const Input = ({ placeholder, name }) => {
	const [test, setTest] = useState('');
	const [isInputValid, setIsInputValid] = useState(true);

	const navigate = useNavigate();
	const { search } = useLocation();
	const [searchParams, setSearchParams] = useSearchParams();

	const updateURL = debounce((name, value) => {
		setSearchParams(prevPar => {
			if (value === '') {
				prevPar.delete(name);
			} else {
				prevPar.set(name, value);
			}
		});
		navigate('?' + searchParams.toString());
	}, 500); // 500 миллисекунд задержки

	const onChange = event => {
		const value = event.target.value;
		const isValidNumber = /^\d*$/.test(value);
		if (isValidNumber) {
			setTest(value);
			setIsInputValid(true);

			updateURL(name, value);
		} else {
			setIsInputValid(false);
		}
	};

	return (
		<div className={styles.wrapper_input}>
			<input
				className={styles.input}
				placeholder={placeholder}
				type='text'
				value={test}
				onChange={onChange}
				style={test !== '' ? { borderBottom: '1px solid #26a69a' } : {}}
			/>
			{!isInputValid && (
				<p style={{ color: 'red' }} className={styles.error}>
					Пожалуйста, введите только цифры.
				</p>
			)}
		</div>
	);
};

export default Input;

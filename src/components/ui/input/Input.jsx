import { debounce } from 'lodash';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import { actions as adresFilterStringAction } from '../../../store/adres-filter-string/AdresFilterString.slice';
import styles from './Input.module.scss';

const Input = ({ placeholder, name, clearFilter }) => {
	const [test, setTest] = useState('');
	const [isInputValid, setIsInputValid] = useState(true);
	const dispatch = useDispatch();
	const navigate = useNavigate();
	const { search } = useLocation();
	const [searchParams, setSearchParams] = useSearchParams();
	const userMap = useSelector(state => state.userMap);

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

	useEffect(() => {
		dispatch(adresFilterStringAction.addGetParams(search));
	}, [search]);

	useEffect(() => {
		if (clearFilter) {
			setTest('');
			setSearchParams({ map: userMap.map });
			dispatch(adresFilterStringAction.clearGetParams(''));
		}
	}, [clearFilter]);

	useEffect(() => {
		if (searchParams.get(name)) {
			setTest(searchParams.get(name));
		}
	}, []);

	return (
		<div className={styles.wrapper_input}>
			<input
				className={styles.input}
				placeholder={placeholder}
				type='text'
				value={test}
				onChange={onChange}
				style={
					name === 'fix_bag_247'
						? { width: '0px', height: '0px', margin: '0px' }
						: test !== ''
						? { borderBottom: '1px solid #26a69a' }
						: {}
				}
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

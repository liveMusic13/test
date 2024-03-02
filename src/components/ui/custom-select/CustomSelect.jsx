import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import Select from 'react-select';
import { actions as adresFilterStringAction } from '../../../store/adres-filter-string/AdresFilterString.slice';
import { getNumbersFromString } from '../../../utils/numbersFromString';
import { transformFieldForSelect } from '../../../utils/transformFieldForSelect';
import styles from './CustomSelect.module.scss';

const CustomSelect = ({
	isMultiChoice,
	title,
	isImage,
	dataSelect,
	clearFilter,
}) => {
	const filtersData = useSelector(state => state.dataFilters);
	const [selectedOption, setSelectedOption] = useState(null);
	const optionsAgent = transformFieldForSelect(dataSelect.items);
	const navigate = useNavigate();
	const [searchParams, setSearchParams] = useSearchParams();
	const dispatch = useDispatch();
	const { search } = useLocation();

	useEffect(() => {
		if (searchParams.get(dataSelect.name)) {
			const nameSelect = dataSelect.name; //HELP: ПОЛУЧАЕМ ИМЯ ФИЛЬТРА

			if (isMultiChoice) {
				const arrayValue = getNumbersFromString(
					searchParams.get(dataSelect.name)
				);

				const multiTargetSelect = filtersData //HELP: НАХОДИМ ТОТ СЕЛЕКТ И ТЕ ОПЦИИ КОТОРЫЕ ЕСТЬ В АДРЕСНОЙ СТРОКЕ
					.filter(filterObj => filterObj.name === nameSelect)[0];

				const matchingItems = multiTargetSelect.items.filter(
					(
						item //HELP: СРАВНИВАЕМ С МАССИВОМ ЗНАЧЕНИЙ ИЗ СТРОКИ И ВОЗВРАЩАЕМ МАССИВ С ОБЪЕКТАМИ, КОТОРЫЕ СОВПАЛИ
					) => arrayValue.includes(item.item_id)
				);

				const transformedItems = transformFieldForSelect(matchingItems); //HELP: МЕНЯЕМ ПОЛЯ

				setSelectedOption(transformedItems);
			} else {
				const targetSelect = filtersData //HELP: НАХОДИМ ТОТ СЕЛЕКТ И ТЕ ОПЦИИ КОТОРЫЕ ЕСТЬ В АДРЕСНОЙ СТРОКЕ
					.filter(filterObj => filterObj.name === nameSelect)[0]
					.items.filter(
						option =>
							option.item_id === Number(searchParams.get(dataSelect.name))
					);

				const newKeyInObj = transformFieldForSelect(targetSelect); //HELP: С ПОМОЩЬЮ ФУНКЦИИ МЕНЯЕМ НАЗВАНИЯ ПОЛЕЙ, ЧТОБЫ REACT-SELECT МОГ СЧИТЫВАТЬ ЗНАЧЕНИЯ.

				setSelectedOption(newKeyInObj); //HELP: ЗАПИСЫВАЕМ МАССИВ С ОДНИМ ОБЪЕКТОМ В ЗНАЧЕНИЯ СЕЛЕКТА
			}
		}
	}, []);

	const handleChange = selectedOption => {
		setSelectedOption(selectedOption);

		if (Array.isArray(selectedOption)) {
			//HELP: ПРОВЕРКА НА МАССИВ, ЕСЛИ ДА, ЗНАЧИТ ЭТО МУЛЬТИСЕЛЕКТ
			let arrValue = [];

			selectedOption.forEach(option => {
				arrValue.push(option.value); //HELP: ЗАПИСЬ ВСЕХ ЗНАЧЕНИЙ МУЛЬТИСЛЕКТА В МАССИВ
			});

			setSearchParams(prevPar => {
				if (arrValue.length > 0) {
					prevPar.set(dataSelect.name, arrValue.join(','));
				} else {
					prevPar.delete(dataSelect.name);
				} //HELP: ЗАПИСЬ ЗНАЧЕНИЙ В СТРОКУ
			});
			navigate('?' + searchParams.toString());
		} else {
			setSearchParams(prevPar => {
				if (selectedOption && selectedOption.value) {
					prevPar.set(dataSelect.name, selectedOption.value);
				} else {
					prevPar.delete(dataSelect.name);
				}
			});
			navigate('?' + searchParams.toString());
		}
	};

	// const handleChange = selectedOption => {
	// 	setSelectedOption(selectedOption);

	// 	if (Array.isArray(selectedOption)) {
	// 		let arrValue = [];

	// 		selectedOption.forEach(option => {
	// 			arrValue.push(option.value);
	// 		});

	// 		setSearchParams(prevPar => {
	// 			if (arrValue.length > 0) {
	// 				prevPar.set(dataSelect.name, arrValue.join(','));
	// 			} else {
	// 				prevPar.delete(dataSelect.name);
	// 			}
	// 		});
	// 		navigate('?' + searchParams.toString());
	// 	} else {
	// 		setSearchParams(prevPar => {
	// 			if (selectedOption && selectedOption.value) {
	// 				prevPar.set(dataSelect.name, selectedOption.value);
	// 			} else {
	// 				prevPar.delete(dataSelect.name);
	// 			}
	// 		});
	// 		navigate('?' + searchParams.toString());
	// 	}
	// };

	useEffect(() => {
		dispatch(adresFilterStringAction.addGetParams(search));
	}, [search]);

	useEffect(() => {
		if (clearFilter) {
			setSelectedOption(null);
			dispatch(adresFilterStringAction.clearGetParams(''));
		}
	}, [clearFilter]);
	// useEffect(() => {
	// 	if (clearFilter) {
	// 		setSelectedOption(null);
	// 		(async () => {
	// 			await setSearchParams(prevPar => {
	// 				prevPar.delete(dataSelect.name);
	// 				console.log('после удаления');
	// 			});
	// 			// navigate('?' + searchParams.toString());
	// 			console.log('после навигейта');
	// 		})();
	// 		dispatch(adresFilterStringAction.clearGetParams(''));

	// 		console.log('после диспатча');
	// 	}
	// }, [clearFilter]);

	const customStyles = {
		option: (provided, state) => {
			if (isImage) {
				return {
					...provided,
					backgroundImage: state.isSelected
						? 'url("../images/icons/ok.svg")'
						: 'url("../images/icons/test.png")',
					backgroundRepeat: 'no-repeat',
					backgroundSize: '10%',
					backgroundPosition: 'center left',
					paddingLeft: '12%',
					backgroundColor: state.isSelected ? '#e0e0e0' : 'transparent',
					color: '#9e9e9e',
					'&:hover': {
						cursor: 'pointer',
					},
				};
			} else {
				return {
					'&:hover': {
						cursor: 'pointer',
					},
				};
			}
		},
		control: (provided, state) => ({
			...provided,
			maxHeight: 'calc(40 / 1440 * 100vw)',
			overflow: 'auto',
			border: state.isFocused ? '1px solid #26a69a' : 'none',
			boxShadow: state.isFocused ? '0px 0px 3px #26a69a' : 'none',
			borderBottom: state.isFocused ? '1px solid #26a69a' : '1px solid #121212',
			borderRadius: '0px',
			'&:hover': {
				borderColor: '#26a69a',
				boxShadow: '0px 0px 3px #26a69a',
				cursor: 'pointer',
			},
		}),
	};

	return (
		<div className={styles.block__select}>
			<h2 className={styles.title}>{title}</h2>
			<Select
				className={styles.custom_select}
				classNamePrefix='custom_select'
				placeholder=''
				isMulti={isMultiChoice}
				options={optionsAgent}
				closeMenuOnSelect={!isMultiChoice}
				hideSelectedOptions={false}
				value={selectedOption}
				onChange={handleChange}
				styles={customStyles}
			/>
		</div>
	);
};

export default CustomSelect;

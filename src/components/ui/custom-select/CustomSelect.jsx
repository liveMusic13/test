import { useState } from 'react';
import Select from 'react-select';
import styles from './CustomSelect.module.scss';

const optionsAgent = [
	{ value: 'Вариант 1', label: 'Вариант 1' },
	{ value: 'Вариант 2', label: 'Вариант 2' },
	{ value: 'Вариант 3', label: 'Вариант 3' },
	{ value: 'Вариант 4', label: 'Вариант 4' },
	{ value: 'Вариант 5', label: 'Вариант 5' },
	{ value: 'Вариант 6', label: 'Вариант 6' },
];

const CustomSelect = ({ isMultiChoice, title, isImage }) => {
	const [selectedOption, setSelectedOption] = useState(null);

	const handleChange = selectedOption => {
		setSelectedOption(selectedOption);
		console.log(`Option selected:`, selectedOption);
	};

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
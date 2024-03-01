import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { $axios } from '../../../api';
import { useCheckWidth } from '../../../hooks/useCheckWidth';
import { actions as dataObjectInfoAction } from '../../../store/data-object-info/DataObjectInfo.slice';
import { actions as viewSettingsAction } from '../../../store/view-settings/ViewSettings.slice';
import styles from './Button.module.scss';

const Button = ({ icon, newCenter, elem }) => {
	const [clickButton, setClickButton] = useState(false);
	const dispatch = useDispatch();
	const { windowSize } = useCheckWidth();

	const getObjectInfo = async id => {
		if (window.innerWidth <= 767.98)
			dispatch(viewSettingsAction.defaultObjects(''));
		dispatch(viewSettingsAction.toggleObjectInfo());
		try {
			dispatch(viewSettingsAction.activeLoadingObject());

			const responce = await $axios.get(`/api/object_info.php?id=${id}`);
			console.log(responce);

			dispatch(dataObjectInfoAction.addObjectInfo(responce.data));
		} catch (error) {
			console.log(error);
		} finally {
			dispatch(viewSettingsAction.defaultLoadingObject());
		}
	}; //TODO: ПЕРЕДЕЛАТЬ ПОД НАЖАТИЕ ЗДЕСЬ. УБРАТЬ ЛИШНИЙ КОД

	return (
		<button
			className={styles.icon__button}
			onClick={() => {
				if (windowSize.width <= 767.98) {
					if (icon.id === 6) {
						dispatch(viewSettingsAction.toggleSettingsMap(''));
						dispatch(viewSettingsAction.toggleFilters(''));
					}
					if (icon.id === 7) {
						dispatch(viewSettingsAction.toggleSettingsMap(''));
						dispatch(viewSettingsAction.toggleObjects(''));
					}
				} else {
					if (icon.id === 6) dispatch(viewSettingsAction.toggleFilters(''));
					if (icon.id === 7) dispatch(viewSettingsAction.toggleObjects(''));
				}

				if (windowSize.width >= 767.98) setClickButton(!clickButton);
				if (icon.id === 0) newCenter(elem.crd);

				if (elem && elem.id) getObjectInfo(elem.id); //HELP: ЧТОБЫ НЕ БЫЛО ОШИБКИ В КОНСОЛИ МОЛ НЕТУ ОБЪЕКТА
			}}
		>
			{elem?.crd === null ? (
				<svg viewBox='0 0 24 24'>
					<path
						fill='red'
						d='M12 2C15.9 2 19 5.1 19 9C19 14.2 12 22 12 22S5 14.2 5 9C5 5.1 8.1 2 12 2M11 6V12H13V6H11M11 14V16H13V14H11Z'
					></path>
				</svg>
			) : (
				<svg className={icon.id === 0 ? styles.icon_svg_home : styles.icon_svg}>
					<use
						xlinkHref={
							clickButton
								? icon.src
								: icon.src_active
								? icon.src_active
								: icon.src
						}
					></use>
				</svg>
			)}

			<p
				className={styles.hover__text}
				style={
					icon.id === 0 || icon.id === 6 || icon.id === 7 || icon.id === 8
						? {
								right: 0,
						  }
						: { left: 0 }
				}
			>
				{elem?.crd === null ? 'Объекта нет на карте' : icon.hover_text}
			</p>
		</button>
	);
};

export default Button;

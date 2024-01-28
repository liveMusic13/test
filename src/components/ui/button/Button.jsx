import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useCheckWidth } from '../../../hooks/useCheckWidth';
import { actions as viewSettingsAction } from '../../../store/view-settings/ViewSettings.slice';
import styles from './Button.module.scss';

const Button = ({ icon }) => {
	const [clickButton, setClickButton] = useState(false);
	const dispatch = useDispatch();
	const { windowSize, setWindowSize } = useCheckWidth();

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
			}}
			style={
				icon.id === 0
					? { backgroundColor: 'transparent', cursor: 'default' }
					: {}
			}
		>
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
				{icon.hover_text}
			</p>
		</button>
	);
};

export default Button;

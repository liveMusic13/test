import { useDispatch } from 'react-redux';
import { actions as viewSettingsAction } from '../../store/view-settings/ViewSettings.slice';
import AllObjects from '../all-objects/AllObjects';
import Filters from '../ui/filters/Filters';
import styles from './BurgerMenu.module.scss';

const BurgerMenu = () => {
	const dispatch = useDispatch();

	return (
		<div className={styles.wrapper_burger}>
			<div className={styles.block__title}>
				<button className={styles.logout__button}>
					<svg className={styles.logout_svg}>
						<use xlinkHref='/images/svg/sprite.svg#logout'></use>
					</svg>
				</button>
				<button
					className={styles.burger__button}
					onClick={() => dispatch(viewSettingsAction.toggleBurger(''))}
				>
					<span></span>
				</button>
			</div>
			<div className={styles.block__settingsMap}>
				<Filters />
				<AllObjects />
			</div>
		</div>
	);
};

export default BurgerMenu;

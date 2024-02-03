import Button from '../ui/button/Button';
import styles from './Header.module.scss';
import { arrayNumSettingIcons } from './icons.data';

const Header = () => {
	return (
		<header className={styles.header}>
			<div className={styles.map__buttons}>
				{/* {arrayNumIcons.map(icon => {
					return <Button key={icon.id} icon={icon} />;
				})} */}
				<div className={styles.block__title}>
					{/* <div className={styles.line}></div>
					<div className={styles.line}></div> */}
					<h1 className={styles.title}>Тестовая карта</h1>
				</div>
			</div>
			<div className={styles.settings__buttons}>
				{arrayNumSettingIcons.map(icon => {
					return <Button key={icon.id} icon={icon} />;
				})}
			</div>
			{/* <button
				className={styles.burger__button}
				onClick={() => dispatch(viewSettingsAction.toggleBurger(''))}
			>
				<span></span>
			</button> */}
		</header>
	);
};

export default Header;

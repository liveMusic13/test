import styles from './Loading.module.scss';

const Loading = ({ height }) => {
	return (
		<div
			className={styles.loading}
			style={height ? { height: height } : {}}
		></div>
	);
};

export default Loading;

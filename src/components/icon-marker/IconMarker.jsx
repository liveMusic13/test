const IconMarker = ({ object, idTarget }) => {
	// const [style, setStyle] = useState({
	// 	width: '20px',
	// 	height: '20px',
	// 	color: `#${object.color}`,
	// 	borderRadius: '50%',
	// });
	// console.log(idTarget.id);

	// useEffect(() => {
	// 	if (object.id === idTarget.id) {
	// 		setStyle({
	// 			width: '20px',
	// 			height: '20px',
	// 			color: `#${object.color}`,
	// 			boxShadow: `0 0 20px rgba(135, 78, 175, 1)`,
	// 			background: 'rgba(135, 78, 175, 0.6)',
	// 			borderRadius: '50%',
	// 		});
	// 	} else {
	// 		setStyle({
	// 			width: '20px',
	// 			height: '20px',
	// 			color: `#${object.color}`,
	// 			borderRadius: '50%',
	// 		});
	// 	}
	// 	console.log(style);
	// }, [idTarget.id]);

	return (
		<svg style={{ width: '20px', height: '20px', color: `#${object.color}` }}>
			<use xlinkHref={`../images/svg/sprite.svg#${object.icon}`}></use>
		</svg>
	);
};

export default IconMarker;

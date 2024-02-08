const IconMarker = ({ object }) => {
	return (
		<svg style={{ width: '20px', height: '20px', color: `#${object.color}` }}>
			<use xlinkHref={`../images/svg/sprite.svg#${object.icon}`}></use>
		</svg>
	);
};

export default IconMarker;

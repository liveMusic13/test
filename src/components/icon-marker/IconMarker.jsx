const IconMarker = ({ srcIcon, colorIcon }) => {
	return (
		<svg style={{ width: '20px', height: '20px', color: `#${colorIcon}` }}>
			<use xlinkHref={`../images/svg/sprite.svg#${srcIcon}`}></use>
		</svg>
	);
};

export default IconMarker;

import { useTheme } from '@mui/material';
import { actions, useAppState } from '../context/AppStateContext';
import React, { useState, useEffect } from 'react';

const HoverMarker = () => {
	const { state, dispatch } = useAppState();
	const [mousePosition, setMousePosition] = useState<number>(0);
	const theme = useTheme();

	const handleMouseMove = (event: MouseEvent) => {
		setMousePosition(event.clientX);
	};

	useEffect(() => {
		window.addEventListener('mousemove', handleMouseMove);

		return () => {
			window.removeEventListener('mousemove', handleMouseMove);
		};
	}, []);

	return (
		<div
			style={{
				backgroundColor: theme.palette.common.brightRed,
				height: `${state.resizePosition}px`,
				width: '1px',
				position: 'absolute',
				left: `${mousePosition}px`,
				opacity: '40%',
				visibility: state.isHoveredWaveform ? 'visible' : 'hidden',
				pointerEvents: 'none',
				zIndex: '-1',
			}}
		></div>
	);
};

export default HoverMarker;

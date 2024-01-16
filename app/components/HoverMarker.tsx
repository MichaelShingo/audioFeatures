import { useTheme } from '@mui/material';
import { useAppState } from '../context/AppStateContext';
import React from 'react';

const HoverMarker: React.FC = () => {
	const { state } = useAppState();
	const theme = useTheme();

	return (
		<div
			style={{
				backgroundColor: theme.palette.common.brightRed,
				height: `${state.resizePosition - 50}px`,
				width: '1px',
				position: 'absolute',
				left: `${state.mousePosition.x}px`,
				opacity: '50%',
				visibility:
					state.isHoveredWaveform && !state.isSeekHandleHovered ? 'visible' : 'hidden',
				pointerEvents: 'none',
				zIndex: '-1',
			}}
		></div>
	);
};

export default HoverMarker;

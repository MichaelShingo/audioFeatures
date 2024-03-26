import { useTheme } from '@mui/material';
import { useAppState } from '../../context/AppStateContext';
import React from 'react';
import { Box } from '@mui/system';

const HoverMarker: React.FC = () => {
	const { state } = useAppState();
	const theme = useTheme();

	return (
		<Box
			sx={{
				backgroundColor: theme.palette.common.brightRed,
				height: `100%`,
				width: '1.5px',
				left: `${state.mousePosition.x + state.waveformScrollPosition}px`,
				opacity: '50%',
				visibility: state.isHoveredWaveform ? 'visible' : 'hidden',
				pointerEvents: 'none',
				zIndex: '-1',
				position: 'absolute',
				top: '0px',
			}}
		></Box>
	);
};

export default HoverMarker;

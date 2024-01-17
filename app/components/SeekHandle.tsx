import { useTheme } from '@mui/material';
import React, { useRef } from 'react';
import { actions, useAppState } from '../context/AppStateContext';
import { Box } from '@mui/system';

const SeekHandle: React.FC = () => {
	const { state, dispatch } = useAppState();
	const theme = useTheme();
	const ref = useRef<HTMLElement>(null);
	const wavelengthLength: number = state.loudnessData.length / 2;

	const handleOnMouseEnter = () => {
		dispatch({ type: actions.SET_IS_SEEK_HANDLE_HOVERED, payload: true });
	};

	const handleOnMouseLeave = () => {
		dispatch({ type: actions.SET_IS_SEEK_HANDLE_HOVERED, payload: false });
	};

	const calcPosition = (): number => {
		const playbackPercentage: number = state.seconds / state.audioDuration;
		return playbackPercentage * wavelengthLength;
	};

	return (
		<Box
			ref={ref}
			onMouseEnter={handleOnMouseEnter}
			onMouseLeave={handleOnMouseLeave}
			sx={{
				backgroundColor: theme.palette.common.brightRed,
				height: `100%`,
				width: '1px',
				position: 'relative',
				top: '0px',
				left: `${calcPosition()}px`,
				zIndex: '2',
			}}
		>
			<Box
				sx={{
					width: '10px',
					height: '10px',
					position: 'relative',
					left: '-5px',
					top: '0px',
					backgroundColor: theme.palette.common.lightBlue,
					'&:hover': {
						cursor: 'grab',
					},
				}}
			></Box>
			<Box
				sx={{
					width: '0px',
					height: '0px',
					borderLeft: '5px solid transparent',
					borderRight: '5px solid transparent',
					borderTop: `5px solid ${theme.palette.common.lightBlue}`,
					position: 'relative',
					left: '-5px',
					top: '0px',
					'&:hover': {
						cursor: 'grab',
					},
				}}
			></Box>
		</Box>
	);
};

export default SeekHandle;

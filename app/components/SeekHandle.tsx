import { useTheme } from '@mui/material';
import React, { useEffect, useRef } from 'react';
import { actions, useAppState } from '../context/AppStateContext';
import { Box } from '@mui/system';
import { WAVEFORM_PIXEL_WIDTH } from '../data/constants';
import * as Tone from 'tone';

const SeekHandle: React.FC = () => {
	const { state, dispatch } = useAppState();
	const theme = useTheme();
	const ref = useRef<HTMLElement>(null);
	const wavelengthLength: number = state.loudnessData.length / (1 / WAVEFORM_PIXEL_WIDTH);

	const calcPosition = (currentTimeInSeconds: number): number => {
		const playbackPercentage: number = currentTimeInSeconds / state.audioDuration;
		return playbackPercentage * wavelengthLength;
	};

	const handleOnMouseEnter = () => {
		dispatch({ type: actions.SET_IS_SEEK_HANDLE_HOVERED, payload: true });
	};

	const handleOnMouseLeave = () => {
		dispatch({ type: actions.SET_IS_SEEK_HANDLE_HOVERED, payload: false });
	};

	useEffect(() => {
		if (ref.current) {
			ref.current.style.left = `${calcPosition(state.seconds)}px`;
		}
	}, [state.isPlaying, state.seconds]);

	function updatePosition() {
		const position = calcPosition(Tone.Transport.seconds);
		if (ref.current) {
			ref.current.style.left = `${position}px`;
		}
	}

	useEffect(() => {
		let scheduledEventId: number = 0;
		if (Tone.Transport.state === 'started') {
			scheduledEventId = Tone.Transport.scheduleRepeat(
				function (time) {
					Tone.Draw.schedule(updatePosition, time);
				},
				1 / 60,
				0
			);
		} else {
			// Tone.Transport.clear(scheduledEventId);
		}
	}, [state.isPlaying]);

	return (
		<Box
			ref={ref}
			onMouseEnter={handleOnMouseEnter}
			onMouseLeave={handleOnMouseLeave}
			sx={{
				backgroundColor: theme.palette.common.brightRed,
				height: `100%`,
				width: '2px',
				position: 'relative',
				top: '0px',
				zIndex: '2',
				'@keyframes playAnimation': {
					from: {
						left: `${calcPosition(state.seconds)}px`,
					},
					to: {
						left: `${calcPosition(state.audioDuration)}px`,
					},
				},
				// animation: state.isPlaying
				// 	? `playAnimation ${state.audioDuration - state.seconds}s linear`
				// 	: 'none',
			}}
		>
			<Box
				sx={{
					width: '10px',
					height: '10px',
					position: 'relative',
					left: '-4px',
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
					left: '-4px',
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

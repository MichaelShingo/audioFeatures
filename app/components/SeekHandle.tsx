import { useTheme } from '@mui/material';
import React, { useEffect, useRef } from 'react';
import { actions, useAppState } from '../context/AppStateContext';
import { Box } from '@mui/system';
import * as Tone from 'tone';
import usePositionCalculations from '../customHooks/usePositionCalculations';

const SeekHandle: React.FC = () => {
	const { state, dispatch } = useAppState();
	const { calcPositionFromSeconds, calcSecondsFromPosition } = usePositionCalculations();
	const theme = useTheme();
	const ref = useRef<HTMLElement>(null);
	const scrollPositionRef = useRef<number>(state.waveformScrollPosition);

	useEffect(() => {
		if (ref.current) {
			ref.current.style.left = `${calcPositionFromSeconds(state.seconds)}px`;
		}
	}, [state.isPlaying, state.seconds]);

	const handleScroll = (): void => {
		const currentViewEndPosition: number =
			state.waveformScrollPosition + state.windowWidth;
		let currentPosition: number = 0;
		if (ref.current) {
			currentPosition = parseInt(ref.current?.style.left);
		}

		console.log(currentViewEndPosition, currentPosition);

		if (currentPosition >= currentViewEndPosition) {
			console.log('scrolling');
			dispatch({
				type: actions.SET_WAVEFORM_SCROLL_POSITION,
				payload: state.waveformScrollPosition + state.windowWidth,
			});
			// scrollPositionRef.current = scrollPositionRef.current + state.windowWidth;
		}
	};

	useEffect(() => {
		if (Tone.Transport.state === 'started') {
			Tone.Transport.scheduleRepeat(handleScroll, 1 / 4, 0);
		}
	}, [state.isPlaying]);

	const updatePosition = (): void => {
		const position = calcPositionFromSeconds(Tone.Transport.seconds);
		if (ref.current) {
			ref.current.style.left = `${position}px`;
		}
	};

	useEffect(() => {
		if (Tone.Transport.state === 'started') {
			Tone.Transport.scheduleRepeat(
				(time) => {
					Tone.Draw.schedule(updatePosition, time);
				},
				1 / 60,
				0
			);
		}
	}, [state.isPlaying]);

	const handleOnMouseDown = (e: React.MouseEvent): void => {
		e.stopPropagation();
		dispatch({ type: actions.SET_SEEK_HANDLE_MOUSE_DOWN, payload: true });
	};
	const handleOnMouseUp = (e: React.MouseEvent): void => {
		e.stopPropagation();
		console.log('mouse up inside seek handle');
		dispatch({ type: actions.SET_SEEK_HANDLE_MOUSE_DOWN, payload: false });
	};

	useEffect(() => {
		// mouse position change not being detected when not-allowed?
		const containerWidth: number = calcPositionFromSeconds(state.audioDuration);
		let position: number = state.mousePosition.x + state.waveformScrollPosition;
		position = position > containerWidth ? containerWidth : position;
		position = position < 0 ? 0 : position;
		if (state.seekHandleMouseDown && ref.current) {
			ref.current.style.left = `${position}px`;
			dispatch({
				type: actions.SET_SECONDS,
				payload: calcSecondsFromPosition(position),
			});
		}
	}, [
		state.mousePosition,
		state.seekHandleMouseDown,
		state.waveformScrollPosition,
		state.waveformWidth,
	]);

	return (
		<Box
			ref={ref}
			onMouseDown={handleOnMouseDown}
			onMouseUp={handleOnMouseUp}
			sx={{
				backgroundColor: theme.palette.common.brightRed,
				height: `100%`,
				width: '2px',
				position: 'relative',
				top: '0px',
				zIndex: '2',
				'&:hover': {
					cursor: 'grab',
				},
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
				}}
			></Box>
		</Box>
	);
};

export default SeekHandle;

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
	const seekHandleRef = useRef<HTMLElement>(null);
	const scrollPositionRef = useRef<number>(state.waveformScrollPosition);
	const windowWidthRef = useRef<number>(state.windowWidth);

	useEffect(() => {
		if (seekHandleRef.current) {
			seekHandleRef.current.style.left = `${calcPositionFromSeconds(state.seconds)}px`;
		}
	}, [state.isPlaying, state.seconds]);

	useEffect(() => {
		scrollPositionRef.current = state.waveformScrollPosition;
	}, [state.waveformScrollPosition]);

	useEffect(() => {
		windowWidthRef.current = state.windowWidth;
	}, [state.windowWidth]);

	const handleScroll = (): void => {
		const currentViewEndPosition: number =
			scrollPositionRef.current + windowWidthRef.current;
		let currentPosition: number = 0;
		if (seekHandleRef.current) {
			currentPosition = parseInt(seekHandleRef.current?.style.left);
		}

		if (currentPosition >= currentViewEndPosition) {
			dispatch({
				type: actions.SET_WAVEFORM_SCROLL_POSITION,
				payload: scrollPositionRef.current + windowWidthRef.current,
			});
			scrollPositionRef.current = scrollPositionRef.current + windowWidthRef.current;
		}
	};

	useEffect(() => {
		if (Tone.Transport.state === 'started') {
			Tone.Transport.scheduleRepeat(handleScroll, 1 / 4, 0);
		}
	}, [state.isPlaying]);

	const updatePosition = (): void => {
		const position = calcPositionFromSeconds(Tone.Transport.seconds);
		if (seekHandleRef.current) {
			seekHandleRef.current.style.left = `${position}px`;
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
		e.preventDefault();
		e.movementX = 500;

		dispatch({ type: actions.SET_SEEK_HANDLE_MOUSE_DOWN, payload: true });
	};
	const handleOnMouseUp = (e: React.MouseEvent): void => {
		e.stopPropagation();
		dispatch({ type: actions.SET_SEEK_HANDLE_MOUSE_DOWN, payload: false });
	};

	useEffect(() => {
		const containerWidth: number = calcPositionFromSeconds(state.audioDuration);
		let position: number = state.mousePosition.x + state.waveformScrollPosition;
		position = position > containerWidth ? containerWidth : position;
		position = position < 0 ? 0 : position;
		if (state.seekHandleMouseDown && seekHandleRef.current) {
			seekHandleRef.current.style.left = `${position}px`;
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
			ref={seekHandleRef}
			onMouseDown={handleOnMouseDown}
			onMouseUp={handleOnMouseUp}
			sx={{
				backgroundColor: theme.palette.common.brightRed,
				height: `100%`,
				width: '2px',
				position: 'relative',
				top: '0px',
				zIndex: '5',
				pointerEvents: 'all',
				'&:hover': {
					cursor: 'grab',
				},
				'&: active': {
					cursor: 'grabbing',
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

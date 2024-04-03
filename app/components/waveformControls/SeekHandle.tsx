import { useTheme } from '@mui/material';
import React, { useEffect, useRef } from 'react';
import { actions, useAppState } from '../../context/AppStateContext';
import { Box } from '@mui/system';
import * as Tone from 'tone';
import usePositionCalculations from '../../customHooks/usePositionCalculations';

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
	}, [state.seconds]);

	useEffect(() => {
		// const position = calcPositionFromSeconds(state.seconds);
		scrollPositionRef.current = state.waveformScrollPosition;
		// if (seekHandleRef.current) {
		// 	seekHandleRef.current.style.left = `${position - state.waveformScrollPosition}px`;
		// }
	}, [state.waveformScrollPosition]);

	useEffect(() => {
		windowWidthRef.current = state.windowWidth;
	}, [state.windowWidth]);

	const handleScroll = (): void => {
		const currentViewEndPosition: number =
			scrollPositionRef.current + windowWidthRef.current;
		let currentPosition: number = 0;
		if (seekHandleRef.current) {
			currentPosition = parseInt(seekHandleRef.current.style.left);
		}

		if (currentPosition >= currentViewEndPosition) {
			dispatch({
				type: actions.SET_WAVEFORM_SCROLL_POSITION,
				payload: scrollPositionRef.current + windowWidthRef.current,
			});
			scrollPositionRef.current = scrollPositionRef.current + windowWidthRef.current;
		}
	};

	const updatePosition = (): void => {
		const position = calcPositionFromSeconds(Tone.Transport.seconds);
		if (seekHandleRef.current) {
			seekHandleRef.current.style.left = `${position}px`;
		}
	};

	useEffect(() => {
		if (Tone.Transport.state === 'started') {
			Tone.Transport.scheduleRepeat(handleScroll, 1 / 4, 0);
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
	}, [state.mousePosition, state.seekHandleMouseDown, state.waveformScrollPosition]);

	useEffect(() => {
		if (seekHandleRef.current) {
			seekHandleRef.current.style.left = `${calcPositionFromSeconds(state.seconds)}px`;
		}
	}, [state.zoomFactor]);

	return (
		<Box
			id="seek-handle"
			ref={seekHandleRef}
			onMouseDown={handleOnMouseDown}
			onMouseUp={handleOnMouseUp}
			sx={{
				height: `200%`,
				width: '2px',
				position: 'relative',
				top: '0px',
				zIndex: '50',
				pointerEvents: 'all',
				'&:hover': {
					cursor: 'grab',
				},
				'&: active': {
					cursor: 'grabbing',
				},
				backgroundColor: theme.palette.common.brightRed,
			}}
		>
			<svg
				xmlns="http://www.w3.org/2000/svg"
				viewBox="0 0 158.92 291.35"
				fill="#37a9e5"
				style={{
					width: '8.5px',
					height: '10px',
					position: 'relative',
					left: '-4px',
					top: '-03px',
					transform: 'scale(200%)',
				}}
			>
				<polygon points="0 0 0 152.97 0 152.97 79.46 291.35 158.92 152.97 158.92 152.97 158.92 0 0 0" />
			</svg>
		</Box>
	);
};

export default SeekHandle;

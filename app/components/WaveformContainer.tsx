import React, { RefObject, useEffect, useRef, useState } from 'react';
import { actions, useAppState } from '../context/AppStateContext';
import { LinearProgress, Typography } from '@mui/material';
import { Box, Stack } from '@mui/system';
import SeekHandle from './SeekHandle';
import usePositionCalculations from '../customHooks/usePositionCalculations';
import HoverMarker from './HoverMarker';
import WaveformSVG from './WaveformSVG';

const WaveformContainer: React.FC = () => {
	const { state, dispatch } = useAppState();
	const { calcSecondsFromPosition, calcPositionFromSeconds } = usePositionCalculations();
	const [isDragging, setIsDragging] = useState<boolean>(false);

	const containerRef: RefObject<HTMLDivElement> = useRef<HTMLDivElement>(null);

	useEffect(() => {
		if (state.seekHandleMouseDown && containerRef.current) {
			const containerRect = containerRef.current.getBoundingClientRect();
			const mouseX = state.mousePosition.x - containerRect.left;
			const containerWidth = containerRef.current.clientWidth;

			const SCROLL_THRESHOLD = 50;
			const SCROLL_SPEED = 80;

			if (mouseX < SCROLL_THRESHOLD) {
				containerRef.current.scrollLeft -= SCROLL_SPEED;
			} else if (mouseX > containerWidth - SCROLL_THRESHOLD) {
				containerRef.current.scrollLeft += SCROLL_SPEED;
			}
		}
	}, [state.mousePosition]);

	useEffect(() => {
		if (containerRef.current) {
			containerRef.current.scrollLeft = state.waveformScrollPosition;
		}
	}, [state.waveformScrollPosition]);

	useEffect(() => {
		if (containerRef.current) {
			containerRef.current.scrollLeft =
				calcPositionFromSeconds(state.seconds) - state.windowWidth / 2;
		}
	}, [state.zoomFactor]);

	useEffect(() => {
		const handleScroll = () => {
			if (containerRef.current) {
				dispatch({
					type: actions.SET_WAVEFORM_SCROLL_POSITION,
					payload: containerRef.current.scrollLeft,
				});
			}
		};

		if (containerRef.current) {
			containerRef.current.addEventListener('scroll', handleScroll);
		}

		return () => {
			if (containerRef.current) {
				containerRef.current.removeEventListener('scroll', handleScroll);
			}
		};
	}, []);

	const handleOnMouseEnterStack = () => {
		dispatch({ type: actions.SET_IS_HOVERED_WAVEFORM, payload: true });
	};

	const handleOnMouseLeave = () => {
		dispatch({ type: actions.SET_IS_HOVERED_WAVEFORM, payload: false });
	};

	const handleOnClick = (event: React.MouseEvent<HTMLDivElement>) => {
		const target = event.target as HTMLDivElement;
		if (target.tagName.toLowerCase() !== 'div') {
			return;
		}
		const position: number = state.mousePosition.x + state.waveformScrollPosition;
		const seconds: number = calcSecondsFromPosition(position);
		dispatch({ type: actions.SET_SECONDS, payload: seconds });
	};

	const isDraggingScrollbar = (): boolean => {
		if (containerRef.current) {
			return state.mousePosition.y > containerRef.current.clientHeight;
		}
		return false;
	};

	const handleDragSelection = () => {
		if (isDraggingScrollbar()) {
			return;
		}
		setIsDragging(true);
		const startSeconds: number = calcSecondsFromPosition(
			state.mousePosition.x + state.waveformScrollPosition
		);
		dispatch({
			type: actions.SET_SELECTION_START_SECONDS,
			payload: startSeconds,
		});
		dispatch({
			type: actions.SET_SELECTION_END_SECONDS,
			payload: startSeconds,
		});
	};

	const handleEndDragSelection = () => {
		if (isDraggingScrollbar()) {
			return;
		}
		setIsDragging(false);
		dispatch({
			type: actions.SET_SELECTION_END_SECONDS,
			payload: calcSecondsFromPosition(
				state.mousePosition.x + state.waveformScrollPosition
			),
		});
	};

	useEffect(() => {
		if (isDragging) {
			dispatch({
				type: actions.SET_SELECTION_END_SECONDS,
				payload: calcSecondsFromPosition(
					state.mousePosition.x + state.waveformScrollPosition
				),
			});
		}
	}, [state.mousePosition, state.selectionStartSeconds]);

	return (
		<div
			ref={containerRef}
			id="waveform-container"
			onMouseEnter={handleOnMouseEnterStack}
			onMouseLeave={handleOnMouseLeave}
			onMouseDown={handleDragSelection}
			onMouseUp={handleEndDragSelection}
			onClick={
				state.isUploaded
					? (e: React.MouseEvent<HTMLDivElement>) => handleOnClick(e)
					: () => {}
			}
			style={{
				width: '100vw',
				backgroundColor: '',
				height: '90%',
				overflowX: 'scroll',
				overflowY: 'hidden',
				paddingInline: '0px',
				display: 'flex',
				alignItems: 'center',
				justifyContent: 'flex-start',
				flexDirection: 'row',
				flexWrap: 'nowrap',
				gap: '0px',
				marginBottom: '7px',
				pointerEvents: 'all',
			}}
		>
			<Stack
				alignItems="center"
				justifyContent="center"
				direction="column"
				sx={{
					width: '100%',
					backgroundColor: '',
					display:
						(state.isUploading && !state.isUploaded) || state.isUploaded
							? 'none'
							: 'block',
				}}
			>
				<Typography
					sx={{
						textAlign: 'center',
						marginBottom: '25px',
						width: '100%',
					}}
					variant="h4"
				>
					Upload audio or activate microphone.
				</Typography>
			</Stack>
			<Box
				sx={{
					width: '50%',
					marginInline: 'auto',
					display: state.isUploading ? 'block' : 'none',
				}}
			>
				<LinearProgress />
			</Box>

			{state.isUploaded && !state.isUploading ? (
				<>
					<SeekHandle />
					<HoverMarker />
					<WaveformSVG />
				</>
			) : (
				<></>
			)}
		</div>
	);
};

export default WaveformContainer;

import React, { RefObject, useEffect, useRef, useState } from 'react';
import { actions, useAppState } from '../../context/AppStateContext';
import SeekHandle from '../waveformControls/SeekHandle';
import usePositionCalculations from '../../customHooks/usePositionCalculations';
import WaveformSVG from '../waveformControls/WaveformSVG';
import PreUpload from '../waveformControls/PreUpload';
import MidiContainer from '../midi/MidiContainer';
import { debounce } from 'lodash';
import { Box } from '@mui/system';

const WaveformContainer: React.FC = () => {
	const { state, dispatch } = useAppState();
	const { calcSecondsFromPosition, calcPositionFromSeconds } = usePositionCalculations();
	const [isDragging, setIsDragging] = useState<boolean>(false);
	const [mouseDownTime, setMouseDownTime] = useState<number>(Date.now());

	const containerRef: RefObject<HTMLDivElement> = useRef<HTMLDivElement>(null);

	useEffect(() => {
		const handleScroll = debounce(() => {
			if (containerRef.current) {
				console.log('scroll left', containerRef.current.scrollLeft);

				dispatch({
					type: actions.SET_WAVEFORM_SCROLL_POSITION,
					payload: containerRef.current.scrollLeft,
				});
			}
		}, 300);

		if (containerRef.current) {
			containerRef.current.addEventListener('scroll', handleScroll);
		}

		const localContainerRefCurrent = containerRef.current;

		return () => {
			localContainerRefCurrent?.removeEventListener('scroll', handleScroll);
		};
	}, []);

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
		const shouldDetectScroll: boolean =
			state.seekHandleMouseDown ||
			state.isDraggingSelectionHandleLeft ||
			state.isDraggingSelectionHandleRight ||
			isDragging;
		if (shouldDetectScroll && containerRef.current) {
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
	}, [state.mousePosition, state.seekHandleMouseDown]);

	useEffect(() => {
		if (
			(isDragging && !state.isDraggingSelectionHandleLeft) ||
			state.isDraggingSelectionHandleRight
		) {
			dispatch({
				type: actions.SET_SELECTION_END_SECONDS,
				payload: calcSecondsFromPosition(
					state.mousePosition.x + state.waveformScrollPosition
				),
			});
		}
	}, [
		state.mousePosition,
		state.isDraggingSelectionHandleLeft,
		state.isDraggingSelectionHandleRight,
	]);

	const handleOnMouseEnterStack = () => {
		dispatch({ type: actions.SET_IS_HOVERED_WAVEFORM, payload: true });
	};

	const handleOnMouseLeave = () => {
		dispatch({ type: actions.SET_IS_HOVERED_WAVEFORM, payload: false });
	};

	const handleOnClick = (event: React.MouseEvent<HTMLDivElement>) => {
		if (Date.now() - mouseDownTime > 150) {
			return;
		}
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

	const handleDragSelection = (e: React.MouseEvent) => {
		e.stopPropagation();
		e.preventDefault();
		if (isDraggingScrollbar()) {
			return;
		}
		if (state.isDraggingSelectionHandleLeft || state.isDraggingSelectionHandleRight) {
			return;
		}

		setIsDragging(true);
		setMouseDownTime(Date.now());
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
		if (state.isDraggingSelectionHandleLeft || state.isDraggingSelectionHandleRight) {
			return;
		}
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
				overflowY: 'scroll',
				paddingInline: '0px',
				display: 'flex',
				// alignItems: 'center',
				// justifyContent: 'flex-start',
				flexDirection: 'column',
				// flexWrap: 'nowrap',
				gap: '0px',
				marginBottom: '7px',
				pointerEvents: state.isUploaded ? 'all' : 'none',
			}}
		>
			<PreUpload />
			{state.isUploaded && !state.isUploading ? (
				<>
					<Box sx={{ height: '30%', backgroundColor: '' }}>
						<WaveformSVG />
					</Box>
					<Box sx={{ height: '70%', backgroundColor: '' }}>
						<MidiContainer />
					</Box>
					{/* <SeekHandle /> */}
				</>
			) : (
				<></>
			)}
		</div>
	);
};

export default WaveformContainer;

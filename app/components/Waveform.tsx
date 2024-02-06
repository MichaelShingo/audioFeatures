import React, { RefObject, useEffect, useRef, useState } from 'react';
import { actions, useAppState } from '../context/AppStateContext';
import { LinearProgress, Typography } from '@mui/material';
import { Box, Stack } from '@mui/system';
import SeekHandle from './SeekHandle';
import usePositionCalculations from '../customHooks/usePositionCalculations';
import HoverMarker from './HoverMarker';
import DraggableSelection from './DraggableSelection';

const Waveform: React.FC = () => {
	const { state, dispatch } = useAppState();
	const { calcSecondsFromPosition, calcPositionFromSeconds } = usePositionCalculations();
	const [svgPathData, setSVGPathData] = useState<string>('');
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

	useEffect(() => {
		if (!state.isUploading) {
			generateWaveform();
		}
	}, [state.isUploading]);

	const generateWaveform = (): void => {
		if (!state.waveform) {
			return;
		}

		const loudnessDataLength: number = state.loudnessData.length;

		let newSVGData = 'M0 500,';

		for (let i = 0; i < loudnessDataLength; i++) {
			newSVGData += createSVGCoordinate(i, getLoudnessTotal(i));
		}

		for (let i = loudnessDataLength - 1; i >= 0; i--) {
			let loudnessTotal: number | undefined = getLoudnessTotal(i);
			loudnessTotal = loudnessTotal ? loudnessTotal * -1 : 0;
			newSVGData += createSVGCoordinate(i, loudnessTotal);
		}

		setSVGPathData(newSVGData);

		newSVGData += `" fill-opacity="0.3" /></g></svg>`;
	};

	const createSVGCoordinate = (x: number, y: number | undefined): string => {
		let yValue: number | undefined = y;
		const offset: number = 100;
		const scale: number = 5;
		yValue = y ? y + offset : offset;
		return `L${x} ${Math.round(yValue * scale)}, `;
	};

	const getLoudnessTotal = (index: number): number | undefined => {
		return state.loudnessData[index]?.total;
	};

	const calcVerticalScalePercentage = (): number | undefined => {
		if (state.isDragging) {
			return state.mousePosition.y / 5;
		}
	};

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

	const calcStrokeWidth = (): number => {
		if (state.zoomFactor < 0.5) {
			return 0.6;
		}
		return 1 / state.zoomFactor + 0.1;
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

					<div
						style={{
							backgroundColor: '',
							transform: `scaleY(${calcVerticalScalePercentage()}%)`,
							pointerEvents: 'none',
							position: 'relative',
						}}
					>
						<DraggableSelection />
						<svg
							xmlns="http://www.w3.org/2000/svg"
							height="1000px"
							width={`${state.loudnessData.length * state.zoomFactor}px`}
							viewBox={`0 0 ${state.loudnessData.length} 1000`}
							preserveAspectRatio="none"
						>
							<g fill="#3498db" stroke="#3498db" strokeWidth={calcStrokeWidth()}>
								<path d={svgPathData} fillOpacity="0.3" />
							</g>
						</svg>
					</div>
				</>
			) : (
				<></>
			)}
		</div>
	);
};

export default Waveform;

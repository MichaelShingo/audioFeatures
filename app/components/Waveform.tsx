import React, { RefObject, useEffect, useRef, useState } from 'react';
import { actions, useAppState } from '../context/AppStateContext';
import { LinearProgress, Typography } from '@mui/material';
import { Box, Stack, createContainer } from '@mui/system';
import SeekHandle from './SeekHandle';
import usePositionCalculations from '../customHooks/usePositionCalculations';
import HoverMarker from './HoverMarker';

const Waveform: React.FC = () => {
	const { state, dispatch } = useAppState();
	const { calcSecondsFromPosition } = usePositionCalculations();

	const [svgData, setSVGData] = useState<string>(
		`<svg xmlns="http://www.w3.org/2000/svg" width="500" height="200" viewBox="0 0 500 200"></svg>`
	);
	const containerRef: RefObject<HTMLDivElement> = useRef<HTMLDivElement>(null);

	useEffect(() => {
		if (state.seekHandleMouseDown && containerRef.current) {
			const containerRect = containerRef.current.getBoundingClientRect();
			const mouseX = state.mousePosition.x - containerRect.left;
			const containerWidth = containerRef.current.clientWidth;

			const scrollThreshold = 50;

			const SCROLL_SPEED = 60;

			if (mouseX < scrollThreshold) {
				containerRef.current.scrollLeft -= SCROLL_SPEED;
			} else if (mouseX > containerWidth - scrollThreshold) {
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
		let newSVGData: string = `<svg xmlns="http://www.w3.org/2000/svg" 
			width="${loudnessDataLength}" viewBox="0 0 ${loudnessDataLength} 1000">
			<g fill="#3498db" stroke="#3498db" stroke-width="1">
			<path d="M0 500, `;

		for (let i = 0; i < loudnessDataLength; i++) {
			newSVGData += createSVGCoordinate(i, getLoudnessTotal(i));
		}

		for (let i = loudnessDataLength - 1; i >= 0; i--) {
			let loudnessTotal: number | undefined = getLoudnessTotal(i);
			loudnessTotal = loudnessTotal ? loudnessTotal * -1 : 0;
			newSVGData += createSVGCoordinate(i, loudnessTotal);
		}

		newSVGData += `" fill-opacity="0.3" /></g></svg>`;
		setSVGData(newSVGData);
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

	const calcWaveformScalePercentage = (): number | undefined => {
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

	const handleOnClick = () => {
		const position: number = state.mousePosition.x + state.waveformScrollPosition;
		const seconds: number = calcSecondsFromPosition(position);
		dispatch({ type: actions.SET_SECONDS, payload: seconds });
	};

	return (
		<div
			ref={containerRef}
			id="waveform-container"
			onMouseEnter={handleOnMouseEnterStack}
			onMouseLeave={handleOnMouseLeave}
			onClick={handleOnClick}
			style={{
				width: '100vw',
				backgroundColor: '',
				height: '90%',
				overflowX: 'auto',
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
							transform: `scaleY(${calcWaveformScalePercentage()}%)`,
							pointerEvents: 'none',
						}}
						dangerouslySetInnerHTML={{ __html: svgData }}
					/>
				</>
			) : (
				<></>
			)}
		</div>
	);
};

export default Waveform;

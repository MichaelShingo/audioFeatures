import React, { useEffect, useState } from 'react';
import { actions, useAppState } from '../context/AppStateContext';
import { LinearProgress, Typography } from '@mui/material';
import HoverMarker from './HoverMarker';
import { Box, Stack } from '@mui/system';
import SeekHandle from './SeekHandle';

const calcMinAndMax = (waveform: Float32Array): [number, number] => {
	let max = -Infinity;
	let min = Infinity;
	for (const num of waveform) {
		if (num > max) {
			max = num;
		}
		if (num < min) {
			min = num;
		}
	}
	return [min, max];
};

const scaleToRange = (
	value: number,
	min: number,
	max: number,
	newMin: number,
	newMax: number
) => {
	return ((value - min) / (max - min)) * (newMax - newMin) + newMin;
};

const Waveform: React.FC = () => {
	const { state, dispatch } = useAppState();
	const [svgData, setSVGData] = useState<string>(
		`<svg xmlns="http://www.w3.org/2000/svg" width="500" height="200" viewBox="0 0 500 200"></svg>`
	);
	let scaledWaveform: Float32Array | null = null;

	if (state.waveform) {
		const [min, max] = calcMinAndMax(state.waveform);
		scaledWaveform = state.waveform.map((value) => scaleToRange(value, min, max, 0, 100));
	}

	// const handleOnMouseEnter = (value: number) => {
	// 	dispatch({ type: actions.SET_CURRENT_PCM, payload: value });
	// 	dispatch({ type: actions.SET_IS_HOVERED_WAVEFORM, payload: true });
	// };

	useEffect(() => {
		if (!state.isUploading) {
			generateWaveform();
		}
	}, [state.isUploading]);

	const generateWaveform = (): void => {
		if (!scaledWaveform || !state.waveform) {
			return;
		}

		const loudnessDataLength: number = state.loudnessData.length;
		let newSVGData: string = `<svg xmlns="http://www.w3.org/2000/svg" width="${loudnessDataLength}" height="1000" viewBox="0 0 ${loudnessDataLength} 1000">
		<rect width="100%" height="100%" fill="rgba(255, 0, 0, 0)" />
		<g fill="#3498db" stroke="#3498db" stroke-width="1">
		<path d="M0 0, `;

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

	const handleOnMouseEnterStack = () => {
		dispatch({ type: actions.SET_IS_HOVERED_WAVEFORM, payload: true });
	};

	const handleOnMouseLeave = () => {
		dispatch({ type: actions.SET_IS_HOVERED_WAVEFORM, payload: false });
	};

	const handleClick = () => {
		dispatch({ type: actions.SET_MARKER_POSITION, payload: 5 });
	};

	return (
		<div
			id="waveform-container"
			onMouseEnter={handleOnMouseEnterStack}
			onMouseLeave={handleOnMouseLeave}
			onClick={handleClick}
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
			}}
		>
			<Stack
				alignItems="center"
				justifyContent="center"
				direction="column"
				sx={{
					width: '100%',
					display: state.isUploaded ? 'none' : 'block',
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
			{/* <HoverMarker /> */}
			{state.isUploaded && !state.isUploading ? (
				<>
					<SeekHandle />
					<div dangerouslySetInnerHTML={{ __html: svgData }} />{' '}
				</>
			) : (
				<></>
			)}
		</div>
	);
};

export default Waveform;

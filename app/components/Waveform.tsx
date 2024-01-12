import React, { ReactNode } from 'react';
import { Box, Stack } from '@mui/system';
import { actions, useAppState } from '../context/AppStateContext';
import { useTheme } from '@mui/material';

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
	const theme = useTheme();
	const positionPercentage: number = (state.resizePosition / state.windowHeight) * 100;

	let scaledWaveform: Float32Array | null = null;

	if (state.waveform) {
		const [min, max] = calcMinAndMax(state.waveform);
		scaledWaveform = state.waveform.map((value) => scaleToRange(value, min, max, 0, 100));
	}

	const handleOnMouseEnter = (value: number) => {
		dispatch({ type: actions.SET_CURRENT_PCM, payload: value });
	};

	const generateWaveform = (): ReactNode[] => {
		const res: ReactNode[] = [];
		if (!scaledWaveform || !state.waveform) {
			return res;
		}
		// console.log(scaledWaveform.length, state.pitchData);

		// pitch data is an array of arrays.length(12)
		console.log(state.loudnessData.length);
		for (let i = 0; i < state.loudnessData.length; i++) {
			const loudnessTotal: number | undefined = state.loudnessData[i]?.total;
			let loudness: number = 0;
			if (loudnessTotal) {
				loudness = loudnessTotal;
			}
			res.push(
				<div
					key={i}
					onMouseEnter={() => handleOnMouseEnter(loudness)}
					style={{
						width: '1px',
						height: `${loudness * 5}%`,
						backgroundColor: theme.palette.common.lightGrey,
					}}
				></div>
			);
		}
		return res;
	};

	return (
		<Stack
			direction={'row'}
			alignItems="center"
			alignSelf="center"
			sx={{
				width: '100%',
				backgroundColor: '',
				height: '90%',
				overflowX: 'auto',
				overflowY: 'auto',
			}}
		>
			{scaledWaveform && generateWaveform()}
		</Stack>
	);
};

export default Waveform;

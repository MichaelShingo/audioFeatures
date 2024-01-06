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
		console.log(theme.palette.common.brightRed);
	};

	const generateWaveform = (): ReactNode[] => {
		const res: ReactNode[] = [];
		if (!scaledWaveform || !state.waveform) {
			return res;
		}
		for (let i = 0; i < scaledWaveform.length; i++) {
			if (i % 1000 === 0) {
				res.push(
					<Box
						key={i}
						onMouseEnter={() => handleOnMouseEnter(state.waveform[i])}
						sx={{
							width: '1px',
							height: `${scaledWaveform[i]}%`,
							backgroundColor: theme.palette.common.darkRed,
							':hover': {
								cursor: 'text',
								backgroundColor: theme.palette.common.brightRed,
							},
						}}
					></Box>
				);
			}
		}
		return res;
	};
	console.log('waveform percent', positionPercentage);

	return (
		<Stack
			direction={'row'}
			alignItems="center"
			alignSelf="center"
			sx={{
				width: '100%',
				backgroundColor: 'blue',
				height: `${positionPercentage}%`,
				overflowX: 'auto',
				overflowY: 'auto',
			}}
		>
			{scaledWaveform && generateWaveform()}
		</Stack>
	);
};

export default Waveform;

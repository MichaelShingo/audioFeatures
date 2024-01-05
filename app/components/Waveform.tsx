import React, { ReactNode } from 'react';
import { Box, Stack } from '@mui/system';
import { useAppState } from '../context/AppStateContext';

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
	const { state } = useAppState();
	let scaledWaveform: Float32Array | null = null;

	if (state.waveform) {
		const [min, max] = calcMinAndMax(state.waveform);
		scaledWaveform = state.waveform.map((value) => scaleToRange(value, min, max, 0, 500));
	}

	const generateWaveform = (): ReactNode[] => {
		const res: ReactNode[] = [];
		if (!scaledWaveform) {
			return res;
		}
		for (let i = 0; i < scaledWaveform.length; i++) {
			if (i % 1000 === 0) {
				res.push(
					<Box
						sx={{
							width: '0.5px',
							height: `${scaledWaveform[i]}px`,
							backgroundColor: 'blue',
						}}
					></Box>
				);
			}
		}
		return res;
	};

	return (
		<Stack direction={'row'} alignItems="center">
			{scaledWaveform && generateWaveform()}
		</Stack>
	);
};

export default Waveform;

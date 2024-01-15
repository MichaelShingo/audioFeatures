import React, { ReactNode } from 'react';
import { Stack } from '@mui/system';
import { actions, useAppState } from '../context/AppStateContext';
import { useTheme } from '@mui/material';
import HoverMarker from './HoverMarker';

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

	let scaledWaveform: Float32Array | null = null;

	if (state.waveform) {
		const [min, max] = calcMinAndMax(state.waveform);
		scaledWaveform = state.waveform.map((value) => scaleToRange(value, min, max, 0, 100));
	}

	const handleOnMouseEnter = (value: number) => {
		dispatch({ type: actions.SET_CURRENT_PCM, payload: value });
		dispatch({ type: actions.SET_IS_HOVERED_WAVEFORM, payload: true });
	};

	const generateWaveform = (): ReactNode[] => {
		const res: ReactNode[] = [];
		if (!scaledWaveform || !state.waveform) {
			return res;
		}
		// console.log(scaledWaveform.length, state.pitchData);

		// pitch data is an array of arrays.length(12)
		for (let i = 0; i < state.loudnessData.length; i++) {
			const loudnessTotal: number | undefined = state.loudnessData[i]?.total;
			let loudness: number = 0;
			if (loudnessTotal) {
				loudness = loudnessTotal;
			}
			res.push(
				<div
					key={i}
					// onMouseEnter={() => handleOnMouseEnter(loudness)}
					style={{
						width: '0.5px',
						height: `${loudness}%`,
						backgroundColor: theme.palette.common.lightGrey,
						zIndex: '-5',
						flexShrink: '0',
					}}
				></div>
			);
		}
		return res;
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
			onMouseEnter={handleOnMouseEnterStack}
			onMouseLeave={handleOnMouseLeave}
			onClick={handleClick}
			style={{
				width: '100vw',
				backgroundColor: '',
				height: '90%',
				overflowX: 'auto',
				overflowY: 'hidden',

				paddingInline: '25px',
				display: 'flex',
				alignItems: 'center',
				justifyContent: 'flex-start',
				flexDirection: 'row',
				flexWrap: 'nowrap',
				gap: '0px',
			}}
		>
			<HoverMarker />
			{/* <div style={{ width: '20000px', height: '50px', backgroundColor: 'blue' }}></div>
			<div style={{ width: '20000px', height: '50px', backgroundColor: 'blue' }}></div> */}
			{scaledWaveform && generateWaveform()}
		</div>
	);
};

export default Waveform;

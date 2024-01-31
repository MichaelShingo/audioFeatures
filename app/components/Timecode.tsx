import { Stack } from '@mui/system';
import { useAppState } from '../context/AppStateContext';
import React, { useEffect, useRef } from 'react';
import { Typography, useTheme } from '@mui/material';
import * as Tone from 'tone';

const calcMinutes = (seconds: number): string => {
	return Math.floor(seconds / 60).toString();
};
const calcSeconds = (seconds: number): string => {
	return Math.floor(seconds % 60).toString();
};
const calcMilliseconds = (seconds: number): string => {
	return Math.round((seconds * 1000) % 1000).toString();
};

const colonStyle = { marginInline: '8px', fontSize: '1.6rem' };

const Timecode = () => {
	const { state } = useAppState();
	const theme = useTheme();
	const refMilliseconds = useRef<HTMLInputElement>(null);
	const refSeconds = useRef<HTMLInputElement>(null);
	const refMinutes = useRef<HTMLInputElement>(null);

	const inputStyle = {
		backgroundColor: theme.palette.common.mediumGrey,
		color: 'white',
		fontFamily: theme.typography.fontFamily,
		fontSize: '30px',
		width: '50px',
		margin: '0',
		padding: '0',
		border: '0',
		borderRadius: '10px',
		textAlign: 'center' as const,
	};

	const setTimecode = (seconds: number): void => {
		if (refMilliseconds.current && refSeconds.current && refMinutes.current) {
			refMilliseconds.current.value = calcMilliseconds(seconds);
			refSeconds.current.value = calcSeconds(seconds);
			refMinutes.current.value = calcMinutes(seconds);
		}
	};

	useEffect(() => {
		if (Tone.Transport.state === 'started') {
			Tone.Transport.scheduleRepeat(
				(time) => {
					Tone.Draw.schedule(() => setTimecode(Tone.Transport.seconds), time);
				},
				1 / 24,
				0
			);
		} else {
			setTimecode(state.seconds);
		}
	}, [state.isPlaying, state.seconds]);

	return (
		<Stack direction="row" sx={{ marginRight: '5px' }}>
			<input ref={refMinutes} type="number" style={inputStyle} />
			<Typography sx={colonStyle}>:</Typography>
			<input type="number" ref={refSeconds} style={inputStyle} />
			<Typography sx={colonStyle}>:</Typography>
			<input ref={refMilliseconds} type="number" style={inputStyle} />
		</Stack>
	);
};

export default Timecode;

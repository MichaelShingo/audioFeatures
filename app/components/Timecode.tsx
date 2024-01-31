import { Stack } from '@mui/system';
import { useAppState } from '../context/AppStateContext';
import React, { ChangeEvent, useEffect, useRef } from 'react';
import { Typography, useTheme } from '@mui/material';
import * as Tone from 'tone';

const calcMinutes = (): string => {
	return Math.floor(Tone.Transport.seconds / 60).toString();
};
const calcSeconds = (): string => {
	return Math.floor(Tone.Transport.seconds % 60).toString();
};
const calcMilliseconds = (): string => {
	return Math.round((Tone.Transport.seconds * 1000) % 1000).toString();
};

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

	const setSeconds = (e: ChangeEvent<HTMLInputElement>) => {
		console.log('set minutes', e.target.value);
	};
	const setMinutes = (e: ChangeEvent<HTMLInputElement>) => {
		console.log('set minutes', e.target.value);
	};

	const setMilliseconds = (e: ChangeEvent<HTMLInputElement>) => {
		console.log('set minutes', e.target.value);
	};

	const setTimecode = (): void => {
		if (refMilliseconds.current && refSeconds.current && refMinutes.current) {
			refMilliseconds.current.value = calcMilliseconds();
			refSeconds.current.value = calcSeconds();
			refMinutes.current.value = calcMinutes();
		}
	};

	useEffect(() => {
		if (Tone.Transport.state === 'started') {
			Tone.Transport.scheduleRepeat(
				(time) => {
					Tone.Draw.schedule(setTimecode, time);
				},
				1 / 24,
				0
			);
		}
	}, [state.isPlaying]);

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

const colonStyle = { marginInline: '8px', fontSize: '1.6rem' };

export default Timecode;

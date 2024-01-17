import { Stack } from '@mui/system';
import { useAppState } from '../context/AppStateContext';
import React, { ChangeEvent, useEffect, useRef } from 'react';
import { Typography, useTheme } from '@mui/material';
import * as Tone from 'tone';

const calcMinutes = (currentTimeInSeconds: number): number => {
	return Math.floor(currentTimeInSeconds / 60);
};
const calcSeconds = (currentTimeInSeconds: number): number => {
	return Math.floor(currentTimeInSeconds % 60);
};
const calcMilliseconds = (currentTimeInSeconds: number): number => {
	return Math.round((currentTimeInSeconds * 1000) % 1000);
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

	useEffect(() => {
		refMilliseconds.current.value = 0;
		refSeconds.current.value = 0;
		refMinutes.current.value = 0;
	}, []);
	useEffect(() => {
		const fps: number = 1 / 20;

		Tone.Transport.pause;

		if (Tone.Transport.state === 'started') {
			const transportState: Tone.PlaybackState = Tone.Transport.state;
			Tone.Transport.scheduleRepeat(() => {
				const currentTime: number = Tone.Transport.seconds;
				refMilliseconds.current.value = calcMilliseconds(currentTime);
				refSeconds.current.value = calcSeconds(currentTime);
				refMinutes.current.value = calcMinutes(currentTime);
			}, fps);
		} else {
			console.log('stopping or pausing');
			setTimeout(() => {
				const currentTime: number = state.seconds;
				refMilliseconds.current.value = calcMilliseconds(currentTime);
				refSeconds.current.value = calcSeconds(currentTime);
				refMinutes.current.value = calcMinutes(currentTime);
			}, 50);
		}
	}, [state.isPlaying]);

	// useEffect(() => {
	// 	const currentTime: number = state.seconds;
	// 	console.log(currentTime);
	// 	refMilliseconds.current.value = calcMilliseconds(currentTime);
	// 	refSeconds.current.value = calcSeconds(currentTime);
	// 	refMinutes.current.value = calcMinutes(currentTime);
	// }, [state.seconds]);

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

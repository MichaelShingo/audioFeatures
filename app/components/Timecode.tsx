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

	const setTimecode = (currentTime: number): void => {
		refMilliseconds.current.value = calcMilliseconds(currentTime);
		refSeconds.current.value = calcSeconds(currentTime);
		refMinutes.current.value = calcMinutes(currentTime);
	};

	useEffect(() => {
		setTimecode(0);
	}, []);

	useEffect(() => {
		const fps: number = 1 / 10;
		let scheduleRepeatId: number | undefined = undefined;
		if (Tone.Transport.state === 'started') {
			scheduleRepeatId = Tone.Transport.scheduleRepeat(() => {
				const currentTime: number = Tone.Transport.seconds;
				setTimecode(currentTime);
			}, fps);
		} else {
			if (scheduleRepeatId) {
				Tone.Transport.clear(scheduleRepeatId);
			}
			const currentTime: number = state.seconds;
			setTimecode(currentTime);
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
